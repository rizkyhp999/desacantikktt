import * as XLSX from "xlsx";

export interface CardExportOptions {
  cardTitle: string;
  headers: string[]; // e.g. ["Status / Kategori", "RT 001", "RT 002", "RT 003", "RT 004", "RT 005", "Total Desa"]
  rows: (string | number)[][];
  fileName?: string;
}

/**
 * Helper utilitas untuk mengekspor data breakdown RT 1-5 ke file Excel (.xlsx)
 */
export function exportCardToExcel({ cardTitle, headers, rows, fileName }: CardExportOptions) {
  // 1. Buat worksheet baru
  const wsData = [
    [`Laporan Statistik Desa Buong Baru`],
    [`Indikator Card: ${cardTitle}`],
    [`Tanggal Unduh: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`],
    [], // Baris kosong
    headers,
    ...rows,
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Set lebar kolom otomatis agar rapi
  const colWidths = headers.map((h, i) => {
    let maxLen = h.length;
    rows.forEach((row) => {
      const valStr = String(row[i] ?? "");
      if (valStr.length > maxLen) maxLen = valStr.length;
    });
    return { wch: Math.max(maxLen + 4, 12) };
  });
  worksheet["!cols"] = colWidths;

  // 2. Buat workbook baru
  const workbook = XLSX.utils.book_new();
  const safeSheetName = cardTitle.replace(/[\\/*?:[\]]/g, "").slice(0, 30);
  XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName || "Data RT");

  // 3. Trigger download browser
  const cleanFileName = (fileName || cardTitle).toLowerCase().replace(/[^a-z0-9]/g, "_");
  XLSX.writeFile(workbook, `statistik_rt_${cleanFileName}.xlsx`);
}
