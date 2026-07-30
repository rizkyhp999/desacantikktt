import ExcelJS from "exceljs";

export interface CardExportOptions {
  cardTitle: string;
  headers: string[];
  columnNumbers?: string[]; // e.g. ["(1)", "(2)", "(3)", ...]
  rows: (string | number)[][];
  fileName?: string;
}

/**
 * Helper utilitas untuk mengekspor data breakdown RT 1-5 ke file Excel (.xlsx)
 * Menggunakan ExcelJS untuk mendukung styling font Aptos, ukuran font, shading warna, tanpa border.
 */
export async function exportCardToExcel({ cardTitle, headers, columnNumbers, rows, fileName }: CardExportOptions) {
  const colNums = columnNumbers || headers.map((_, idx) => `(${idx + 1})`);

  // 1. Buat Workbook & Worksheet baru dengan ExcelJS
  const workbook = new ExcelJS.Workbook();
  const safeSheetName = cardTitle.replace(/[\\/*?:[\]]/g, "").slice(0, 30);
  const worksheet = workbook.addWorksheet(safeSheetName || "Data RT");

  // 2. Tambahkan Baris Judul Laporan & Metadata (Baris 1-3)
  worksheet.addRow([`Laporan Statistik Desa Buong Baru`]);
  worksheet.addRow([`Indikator Card: ${cardTitle}`]);
  worksheet.addRow([`Tanggal Unduh: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`]);
  worksheet.addRow([]); // Baris 4 kosong

  // Style untuk Judul Dokumen (Baris 1-3)
  const titleRow = worksheet.getRow(1);
  titleRow.height = 24;
  titleRow.getCell(1).font = { name: "Aptos", size: 14, bold: true, color: { argb: "FF153E5C" } };

  const subTitleRow = worksheet.getRow(2);
  subTitleRow.height = 20;
  subTitleRow.getCell(1).font = { name: "Aptos", size: 11, bold: true, color: { argb: "FF333333" } };

  const dateRow = worksheet.getRow(3);
  dateRow.height = 18;
  dateRow.getCell(1).font = { name: "Aptos", size: 10, italic: true, color: { argb: "FF666666" } };

  // 3. Tambahkan Baris 1 Tabel (Judul Kolom / Headers - Baris 5 di Sheet)
  // Permintaan User: Baris pertama (seluruh kolom header) ukuran fontnya 11.
  const headerRow = worksheet.addRow(headers);
  headerRow.height = 32; // Tinggi baris header diatur rapi dan proporsional (32px)
  headerRow.eachCell((cell) => {
    cell.font = { 
      name: "Aptos", 
      size: 11, // Seluruh baris pertama / header bernilai font 11
      bold: true, 
      color: { argb: "FFFFFFFF" } 
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF153E5C" }, // Shading #153E5C
    };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {}; // Tanpa border
  });

  // 4. Tambahkan Baris 2 Tabel (Nomor Kolom (1), (2), (3)... - Baris 6 di Sheet)
  const colNumRow = worksheet.addRow(colNums);
  colNumRow.height = 22; // Tinggi baris nomor kolom (22px)
  colNumRow.eachCell((cell) => {
    cell.font = { name: "Aptos", size: 8, bold: true, color: { argb: "FFFFFFFF" } }; // Font Aptos 8 Putih
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2980B9" }, // Shading #2980B9
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {}; // Tanpa border
  });

  // 5. Tambahkan Baris Data (Baris 7 ke atas)
  // Shading Data: Selang-Seling #FDF3E7 & #F9DCB9
  // Baris Total shading warnanya SAMA seperti kolom header (#153E5C)
  rows.forEach((rowData, rowIndex) => {
    const dataRow = worksheet.addRow(rowData);
    dataRow.height = 24; // Tinggi baris data diatur rapi dan lega (24px)

    const isTotalRow = rowIndex === rows.length - 1; // Baris Total Desa (Baris Terakhir)
    const rowShadingColor = isTotalRow ? "FF153E5C" : rowIndex % 2 === 0 ? "FFFDF3E7" : "FFF9DCB9";
    const fontColor = isTotalRow ? "FFFFFFFF" : "FF141413";

    dataRow.eachCell((cell, colIndex) => {
      cell.font = {
        name: "Aptos",
        size: 10,
        bold: isTotalRow || colIndex === 1,
        color: { argb: fontColor },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowShadingColor },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: colIndex === 1 ? "left" : "center",
      };
      cell.border = {}; // Tanpa border
    });
  });

  // 6. Set Lebar Kolom Otomatis yang Presisi dan Rapi
  headers.forEach((headerText, i) => {
    let maxLen = Math.max(headerText.length, colNums[i]?.length || 0);
    rows.forEach((r) => {
      const valStr = String(r[i] ?? "");
      if (valStr.length > maxLen) maxLen = valStr.length;
    });

    const col = worksheet.getColumn(i + 1);
    // Kolom 1 (Wilayah RT) diberikan padding ekstra, kolom data diberikan ruang lega minimal 16
    col.width = i === 0 ? Math.max(maxLen + 6, 22) : Math.max(maxLen + 6, 16);
  });

  // 7. Write & Download di Browser
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const cleanFileName = (fileName || cardTitle).toLowerCase().replace(/[^a-z0-9]/g, "_");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `statistik_rt_${cleanFileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
