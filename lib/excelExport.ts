import ExcelJS from "exceljs";

export interface ExcelTableGroup {
  tableTitle?: string;
  headers: string[];
  columnNumbers?: string[];
  rows: (string | number)[][];
}

export interface CardExportOptions {
  cardTitle: string;
  tables?: ExcelTableGroup[];
  headers?: string[];
  columnNumbers?: string[];
  rows?: (string | number)[][];
  fileName?: string;
}

/**
 * Helper utilitas untuk mengekspor data breakdown RT 1-5 ke file Excel (.xlsx)
 * Mengabaikan border, mendukung multi-tabel terpisah di dalam satu sheet secara rapi.
 */
export async function exportCardToExcel({
  cardTitle,
  tables,
  headers,
  columnNumbers,
  rows,
  fileName,
}: CardExportOptions) {
  // Jika dipanggil dalam format single table, konversi ke format tables
  const tableGroups: ExcelTableGroup[] = tables || [
    {
      headers: headers || [],
      columnNumbers,
      rows: rows || [],
    },
  ];

  // 1. Buat Workbook & Worksheet baru dengan ExcelJS
  const workbook = new ExcelJS.Workbook();
  const safeSheetName = cardTitle.replace(/[\\/*?:[\]]/g, "").slice(0, 30);
  const worksheet = workbook.addWorksheet(safeSheetName || "Data RT");

  // 2. Tambahkan Baris Judul Laporan & Metadata (Baris 1-3)
  worksheet.addRow([`Laporan Statistik Desa Buong Baru`]);
  worksheet.addRow([`Indikator Card: ${cardTitle}`]);
  worksheet.addRow([`Tanggal Unduh: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`]);
  worksheet.addRow([]); // Baris 4 kosong

  // Style Judul Dokumen
  const titleRow = worksheet.getRow(1);
  titleRow.height = 24;
  titleRow.getCell(1).font = { name: "Aptos", size: 14, bold: true, color: { argb: "FF153E5C" } };

  const subTitleRow = worksheet.getRow(2);
  subTitleRow.height = 20;
  subTitleRow.getCell(1).font = { name: "Aptos", size: 11, bold: true, color: { argb: "FF333333" } };

  const dateRow = worksheet.getRow(3);
  dateRow.height = 18;
  dateRow.getCell(1).font = { name: "Aptos", size: 10, italic: true, color: { argb: "FF666666" } };

  // Max column widths tracker
  const maxColWidths: number[] = [];

  // Loop setiap tabel dalam group (Multi Table Support)
  tableGroups.forEach((tableGroup, tableIdx) => {
    const tHeaders = tableGroup.headers;
    const tColNums = tableGroup.columnNumbers || tHeaders.map((_, idx) => `(${idx + 1})`);
    const tRows = tableGroup.rows;

    // Jika tabel punya sub-judul & bukan tabel pertama
    if (tableGroup.tableTitle) {
      if (tableIdx > 0) {
        worksheet.addRow([]); // Jarak 1 baris kosong antar tabel
      }
      const sectionTitleRow = worksheet.addRow([`TABEL: ${tableGroup.tableTitle.toUpperCase()}`]);
      sectionTitleRow.height = 24;
      sectionTitleRow.getCell(1).font = { name: "Aptos", size: 12, bold: true, color: { argb: "FF153E5C" } };
    }

    // 3. Baris 1 Tabel (Headers)
    const headerRow = worksheet.addRow(tHeaders);
    headerRow.height = 32;
    headerRow.eachCell((cell) => {
      cell.font = { name: "Aptos", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF153E5C" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = {};
    });

    // 4. Baris 2 Tabel (Nomor Kolom (1), (2)...)
    const colNumRow = worksheet.addRow(tColNums);
    colNumRow.height = 22;
    colNumRow.eachCell((cell) => {
      cell.font = { name: "Aptos", size: 8, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2980B9" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {};
    });

    // 5. Baris Data (Selang seling #FDF3E7 & #F9DCB9, Total = #153E5C)
    tRows.forEach((rowData, rowIndex) => {
      const dataRow = worksheet.addRow(rowData);
      dataRow.height = 24;

      const isTotalRow = rowIndex === tRows.length - 1;
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
        cell.border = {};
      });
    });

    // Track column widths
    tHeaders.forEach((headerText, i) => {
      let maxLen = Math.max(headerText.length, tColNums[i]?.length || 0);
      tRows.forEach((r) => {
        const valStr = String(r[i] ?? "");
        if (valStr.length > maxLen) maxLen = valStr.length;
      });
      maxColWidths[i] = Math.max(maxColWidths[i] || 0, maxLen);
    });
  });

  // 6. Set Lebar Kolom Otomatis untuk Seluruh Worksheet
  maxColWidths.forEach((maxLen, i) => {
    const col = worksheet.getColumn(i + 1);
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
