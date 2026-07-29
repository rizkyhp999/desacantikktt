import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clearStatistikCache } from "@/lib/cache";
import * as XLSX from "xlsx";

function cleanVal(v: any) {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number" && isNaN(v)) return null;
  return v;
}

/**
 * POST /api/data/import
 * Menerima file Excel (.xlsx) dan meng-upsert (menimpa/memperbarui) Data Master, Data Perulangan, & Metadata
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File Excel tidak ditemukan" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const wb = XLSX.read(buffer, { type: "buffer", raw: false, cellText: true });

    let metaCount = 0;
    let masterCount = 0;
    let repeatCount = 0;

    // 1. Process Sheet Metadata (Jika ada)
    if (wb.SheetNames.includes("Metadata")) {
      const wsMeta = wb.Sheets["Metadata"];
      const rawMeta: any[] = XLSX.utils.sheet_to_json(wsMeta, { raw: false });

      const metaToUpsert = rawMeta
        .map((row) => {
          const p = row["Parameter"] ? String(row["Parameter"]).trim() : "";
          const v = row["Value"] ? String(row["Value"]).trim() : "";
          const o = row["Options"] ? String(row["Options"]).trim() : null;
          if (!p || p === "nan") return null;
          return { parameter: p, label: v, options: o };
        })
        .filter(Boolean) as { parameter: string; label: string; options: string | null }[];

      for (const item of metaToUpsert) {
        await prisma.metadata.upsert({
          where: { parameter: item.parameter },
          update: { label: item.label, options: item.options },
          create: item,
        });
        metaCount++;
      }
    }

    // 2. Process Sheet Data_Master (Wajib ada)
    if (wb.SheetNames.includes("Data_Master")) {
      const wsMaster = wb.Sheets["Data_Master"];
      const rawMaster: any[] = XLSX.utils.sheet_to_json(wsMaster, { raw: false });

      for (const row of rawMaster) {
        const idDok = row["ID_Dokumen"] ? String(row["ID_Dokumen"]).trim() : "";
        if (!idDok) continue;

        const no = cleanVal(row["No"]);
        const noKK = row["No_KK"] ? String(row["No_KK"]).trim() : null;
        const namaKRT = row["Nama_KRT"] ? String(row["Nama_KRT"]).trim() : null;
        const kecamatan = row["Kecamatan"] ? String(row["Kecamatan"]).trim() : null;
        const desa = row["Desa"] ? String(row["Desa"]).trim() : null;
        const sls = row["SLS"] ? String(row["SLS"]).trim() : null;
        const subSls = row["Sub_SLS"] ? String(row["Sub_SLS"]).trim() : null;

        const dynamicData: Record<string, any> = {};
        Object.entries(row).forEach(([k, v]) => {
          const kClean = String(k).trim();
          if (["No", "ID_Dokumen", "No_KK", "Nama_KRT", "Kecamatan", "Desa", "SLS", "Sub_SLS"].includes(kClean)) {
            return;
          }
          const valClean = cleanVal(v);
          if (valClean !== null) {
            dynamicData[kClean] = valClean;
          }
        });

        await prisma.dataMaster.upsert({
          where: { idDokumen: idDok },
          update: {
            no: typeof no === "number" ? no : null,
            noKK,
            namaKRT,
            kecamatan,
            desa,
            sls,
            subSls,
            data: dynamicData,
          },
          create: {
            idDokumen: idDok,
            no: typeof no === "number" ? no : null,
            noKK,
            namaKRT,
            kecamatan,
            desa,
            sls,
            subSls,
            data: dynamicData,
          },
        });
        masterCount++;
      }
    }

    // 3. Process Sheet Data_Perulangan (Jika ada)
    if (wb.SheetNames.includes("Data_Perulangan")) {
      const wsRepeat = wb.Sheets["Data_Perulangan"];
      const rawRepeat: any[] = XLSX.utils.sheet_to_json(wsRepeat, { raw: false });

      // Untuk perulangan, hapus data lama yang ada di ID_Dokumen terkait lalu masukkan ulang
      const affectedDocIds = new Set<string>();
      rawRepeat.forEach((r) => {
        if (r["ID_Dokumen"]) affectedDocIds.add(String(r["ID_Dokumen"]).trim());
      });

      if (affectedDocIds.size > 0) {
        await prisma.dataPerulangan.deleteMany({
          where: { idDokumen: { in: Array.from(affectedDocIds) } },
        });
      }

      for (const row of rawRepeat) {
        const idDok = row["ID_Dokumen"] ? String(row["ID_Dokumen"]).trim() : "";
        if (!idDok) continue;

        const noKK = row["No_KK"] ? String(row["No_KK"]).trim() : null;
        const namaKRT = row["Nama_KRT"] ? String(row["Nama_KRT"]).trim() : null;
        const isianKe = cleanVal(row["Isian_Ke"]);

        const dynamicData: Record<string, any> = {};
        Object.entries(row).forEach(([k, v]) => {
          const kClean = String(k).trim();
          if (["ID_Dokumen", "No_KK", "Nama_KRT", "Isian_Ke"].includes(kClean)) {
            return;
          }
          const valClean = cleanVal(v);
          if (valClean !== null) {
            dynamicData[kClean] = valClean;
          }
        });

        await prisma.dataPerulangan.create({
          data: {
            idDokumen: idDok,
            noKK,
            namaKRT,
            isianKe: typeof isianKe === "number" ? isianKe : null,
            data: dynamicData,
          },
        });
        repeatCount++;
      }
    }

    // Invalidadasikan cache statistik
    clearStatistikCache();

    return NextResponse.json({
      success: true,
      message: "Data Excel berhasil diunggah dan diperbarui ke database!",
      summary: {
        metadataUpdated: metaCount,
        masterUpdated: masterCount,
        repeatUpdated: repeatCount,
      },
    });
  } catch (error) {
    console.error("API Import error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses dan memperbarui data dari file Excel" },
      { status: 500 }
    );
  }
}
