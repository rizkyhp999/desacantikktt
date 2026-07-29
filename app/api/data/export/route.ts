import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

/**
 * GET /api/data/export
 * Mengunduh seluruh data (Metadata, Data_Master, Data_Perulangan) dalam bentuk file Excel (.xlsx)
 */
export async function GET() {
  try {
    const [metadataItems, masterItems, repeatItems] = await Promise.all([
      prisma.metadata.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.dataMaster.findMany({ orderBy: { no: "asc" } }),
      prisma.dataPerulangan.findMany({ orderBy: { idDokumen: "asc" } }),
    ]);

    // 1. Format Sheet Metadata
    const metadataSheetData = metadataItems.map((m) => ({
      Parameter: m.parameter,
      Value: m.label,
      Options: m.options || "",
    }));

    // 2. Format Sheet Data_Master
    const masterSheetData = masterItems.map((m) => {
      const row: Record<string, any> = {
        No: m.no,
        ID_Dokumen: m.idDokumen,
        No_KK: m.noKK,
        Nama_KRT: m.namaKRT,
        Kecamatan: m.kecamatan,
        Desa: m.desa,
        SLS: m.sls,
        Sub_SLS: m.subSls,
      };
      // Gabungkan variabel JSON
      const dynamicData = m.data as Record<string, any>;
      Object.entries(dynamicData || {}).forEach(([k, v]) => {
        row[k] = v;
      });
      return row;
    });

    // 3. Format Sheet Data_Perulangan
    const repeatSheetData = repeatItems.map((r) => {
      const row: Record<string, any> = {
        ID_Dokumen: r.idDokumen,
        No_KK: r.noKK,
        Nama_KRT: r.namaKRT,
        Isian_Ke: r.isianKe,
      };
      // Gabungkan variabel JSON
      const dynamicData = r.data as Record<string, any>;
      Object.entries(dynamicData || {}).forEach(([k, v]) => {
        row[k] = v;
      });
      return row;
    });

    // Buat Workbook Excel
    const wb = XLSX.utils.book_new();

    const wsMeta = XLSX.utils.json_to_sheet(metadataSheetData);
    const wsMaster = XLSX.utils.json_to_sheet(masterSheetData);
    const wsRepeat = XLSX.utils.json_to_sheet(repeatSheetData);

    XLSX.utils.book_append_sheet(wb, wsMeta, "Metadata");
    XLSX.utils.book_append_sheet(wb, wsMaster, "Data_Master");
    XLSX.utils.book_append_sheet(wb, wsRepeat, "Data_Perulangan");

    // Output buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="Data_Descan_Buong_Baru_2026.xlsx"',
      },
    });
  } catch (error) {
    console.error("API Export error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengunduh data Excel" },
      { status: 500 }
    );
  }
}
