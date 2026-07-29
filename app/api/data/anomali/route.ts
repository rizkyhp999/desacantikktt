import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function isExcludedVariable(key: string): boolean {
  const match = key.match(/^(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    // Block 7: 700-799
    if (num >= 700 && num <= 799) return true;
    // Block 8: 800-899
    if (num >= 800 && num <= 899) return true;
    // Block 9: 900-999
    if (num >= 900 && num <= 999) return true;
    // Block 12: 1200-1299
    if (num >= 1200 && num <= 1299) return true;
    // Block 13: 1300-1399
    if (num >= 1300 && num <= 1399) return true;
  }
  return false;
}

export async function GET() {
  try {
    const [masterItems, repeatItems, metadataItems] = await Promise.all([
      prisma.dataMaster.findMany(),
      prisma.dataPerulangan.findMany(),
      prisma.metadata.findMany(),
    ]);

    const totalDoc = masterItems.length;
    if (totalDoc === 0) {
      return NextResponse.json({
        success: true,
        summary: { totalDoc: 0, anomalyCount: 0 },
        anomalies: [],
        descriptiveStats: [],
      });
    }

    // Map metadata
    const metaMap: Record<string, { label: string; options?: string | null }> = {};
    metadataItems.forEach((m) => {
      metaMap[m.parameter] = { label: m.label, options: m.options };
    });

    // Kumpulkan nilai per variabel (dari Master & Perulangan)
    const varValues: Record<string, { docId: string; val: any }[]> = {};

    masterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      Object.entries(d || {}).forEach(([k, v]) => {
        if (isExcludedVariable(k)) return;
        if (!varValues[k]) varValues[k] = [];
        varValues[k].push({ docId: m.idDokumen, val: v });
      });
    });

    repeatItems.forEach((r) => {
      const d = r.data as Record<string, any>;
      Object.entries(d || {}).forEach(([k, v]) => {
        if (isExcludedVariable(k)) return;
        if (!varValues[k]) varValues[k] = [];
        varValues[k].push({ docId: r.idDokumen, val: v });
      });
    });

    const anomalies: {
      idDokumen: string;
      parameter: string;
      label: string;
      val: any;
      reason: string;
      severity: "high" | "medium";
    }[] = [];

    const statsList: {
      parameter: string;
      label: string;
      type: "numeric" | "categorical";
      fillCount: number;
      fillPercentage: number;
      nullCount: number;
      min?: number;
      max?: number;
      avg?: number;
      outliersCount?: number;
      uniqueValuesCount?: number;
      invalidCategoryCount?: number;
      values?: { docId: string; val: any; isAnomaly: boolean }[];
    }[] = [];

    // Iterasi tiap variabel untuk analisis statistik & deteksi anomali
    Object.entries(varValues).forEach(([param, entries]) => {
      const meta = metaMap[param];
      const label = meta?.label || param;
      const fillCount = entries.length;
      const nullCount = totalDoc - fillCount;
      const fillPercentage = Math.round((fillCount / totalDoc) * 100);

      // Cek numerik
      const numericVals = entries
        .map((e) => Number(e.val))
        .filter((n) => !isNaN(n));

      const isNumeric = numericVals.length > 0 && numericVals.length >= fillCount * 0.7;

      if (isNumeric) {
        const min = Math.min(...numericVals);
        const max = Math.max(...numericVals);
        const sum = numericVals.reduce((acc, curr) => acc + curr, 0);
        const avg = Number((sum / numericVals.length).toFixed(2));

        // Deteksi Outlier dengan standar IQR (Interquartile Range)
        const sorted = [...numericVals].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        let outliersCount = 0;
        entries.forEach((e) => {
          const num = Number(e.val);
          if (!isNaN(num)) {
            if (iqr > 0 && (num < lowerBound || num > upperBound)) {
              outliersCount++;
              anomalies.push({
                idDokumen: e.docId,
                parameter: param,
                label,
                val: e.val,
                reason: `Nilai statistik ekstrem (Outlier IQR: < ${lowerBound.toFixed(1)} atau > ${upperBound.toFixed(1)})`,
                severity: "medium",
              });
            }
          }
        });

        statsList.push({
          parameter: param,
          label,
          type: "numeric",
          fillCount,
          fillPercentage,
          nullCount,
          min,
          max,
          avg,
          outliersCount,
          values: entries.map((e) => {
            const num = Number(e.val);
            const isAnomaly = iqr > 0 && !isNaN(num) && (num < lowerBound || num > upperBound);
            return { docId: e.docId, val: e.val, isAnomaly };
          }),
        });
      } else {
        // Kategorikal / Teks
        const freqMap: Record<string, number> = {};
        entries.forEach((e) => {
          const strVal = String(e.val);
          freqMap[strVal] = (freqMap[strVal] || 0) + 1;
        });

        // Parse Opsi jika ada di metadata untuk mendeteksi Nilai Tidak Valid
        const validOptionsSet = new Set<string>();
        if (meta?.options) {
          const parts = meta.options.split("|");
          parts.forEach((pt) => {
            const code = pt.split("=")[0]?.trim();
            if (code) validOptionsSet.add(code);
          });
        }

        let invalidCategoryCount = 0;
        entries.forEach((e) => {
          const valCode = String(e.val).trim();
          const isAnomaly = validOptionsSet.size > 0 && !validOptionsSet.has(valCode);
          if (isAnomaly) {
            invalidCategoryCount++;
            anomalies.push({
              idDokumen: e.docId,
              parameter: param,
              label,
              val: e.val,
              reason: `Kode kuis/kategori tidak valid (Opsi sah: ${meta?.options})`,
              severity: "high",
            });
          }
        });

        statsList.push({
          parameter: param,
          label,
          type: "categorical",
          fillCount,
          fillPercentage,
          nullCount,
          uniqueValuesCount: Object.keys(freqMap).length,
          invalidCategoryCount,
          values: entries.map((e) => {
            const valCode = String(e.val).trim();
            const isAnomaly = validOptionsSet.size > 0 && !validOptionsSet.has(valCode);
            return { docId: e.docId, val: e.val, isAnomaly };
          }),
        });
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalDoc,
        totalVariables: Object.keys(varValues).length,
        anomalyCount: anomalies.length,
      },
      anomalies,
      descriptiveStats: statsList.sort((a, b) => (b.outliersCount || 0) - (a.outliersCount || 0)),
    });
  } catch (error) {
    console.error("API Anomaly Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menganalisis anomali data" },
      { status: 500 }
    );
  }
}
