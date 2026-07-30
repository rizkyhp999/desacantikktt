"use client";

import React from "react";
import { Download } from "lucide-react";
import { exportCardToExcel, ExcelTableGroup } from "@/lib/excelExport";

export interface CardDownloadButtonProps {
  cardTitle: string;
  /**
   * Jika mode = "rt_columns": Kolom = RT 001 - RT 005 & Total Desa, Baris = Indikator / Program
   * Jika mode = "rt_rows" (default): Kolom = Indikator / Program, Baris = RT 001 - RT 005 & Total Desa
   */
  mode?: "rt_rows" | "rt_columns";
  /**
   * Jika card memiliki 2 kelompok/sub-tabel (misal: Bahan & Kondisi Fisik)
   */
  tables?: Array<{
    title: string;
    items: Array<{
      label: string;
      getValue: (statsObj: any) => number | string;
    }>;
  }>;
  /**
   * Data breakdown single table per indikator / variabel.
   */
  items?: Array<{
    label: string;
    getValue: (statsObj: any) => number | string;
  }>;
  /**
   * Object yang berisi data statistik per RT.
   * Key: "all", "01", "02", "03", "04", "05"
   */
  statsByRt?: Record<string, any>;
  /**
   * Data statistik RT saat ini jika statsByRt tidak tersedia
   */
  currentStats?: any;
  fileName?: string;
  className?: string;
  buttonText?: string;
}

export default function CardDownloadButton({
  cardTitle,
  mode = "rt_rows",
  tables,
  items,
  statsByRt = {},
  currentStats,
  fileName,
  className = "",
  buttonText = "Excel RT",
}: CardDownloadButtonProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();

    const rts = [
      { key: "01", label: "RT 001" },
      { key: "02", label: "RT 002" },
      { key: "03", label: "RT 003" },
      { key: "04", label: "RT 004" },
      { key: "05", label: "RT 005" },
    ];

    // MODE 1: RT DI KOLOM (headers: Indikator, RT 001 - RT 005, Total Desa)
    if (mode === "rt_columns") {
      const headers = [
        "Indikator / Program",
        "RT 001",
        "RT 002",
        "RT 003",
        "RT 004",
        "RT 005",
        "Total Desa (Buong Baru)",
      ];

      if (tables && tables.length > 0) {
        const excelTables: ExcelTableGroup[] = tables.map((tGroup) => {
          const rows = tGroup.items.map((item) => {
            const rtValues = rts.map((rt) => {
              const rtStats = statsByRt[rt.key] || {};
              return item.getValue(rtStats) ?? 0;
            });
            const totalDesaStats = statsByRt["all"] || currentStats || {};
            const totalDesaValue = item.getValue(totalDesaStats) ?? 0;
            return [item.label, ...rtValues, totalDesaValue];
          });
          return {
            tableTitle: tGroup.title,
            headers,
            rows,
          };
        });

        exportCardToExcel({
          cardTitle,
          tables: excelTables,
          fileName,
        });
        return;
      }

      if (items && items.length > 0) {
        const rows = items.map((item) => {
          const rtValues = rts.map((rt) => {
            const rtStats = statsByRt[rt.key] || {};
            return item.getValue(rtStats) ?? 0;
          });
          const totalDesaStats = statsByRt["all"] || currentStats || {};
          const totalDesaValue = item.getValue(totalDesaStats) ?? 0;
          return [item.label, ...rtValues, totalDesaValue];
        });

        exportCardToExcel({
          cardTitle,
          headers,
          rows,
          fileName,
        });
        return;
      }
    }

    // MODE 2: RT DI BARIS (default: headers: Wilayah / RT, Indikator 1, Indikator 2...)
    if (tables && tables.length > 0) {
      const excelTables: ExcelTableGroup[] = tables.map((tGroup) => {
        const headers = ["Wilayah / RT", ...tGroup.items.map((i) => i.label)];
        const rows = [
          ...rts.map((rt) => {
            const rtStats = statsByRt[rt.key] || {};
            const indicatorValues = tGroup.items.map((item) => item.getValue(rtStats) ?? 0);
            return [rt.label, ...indicatorValues];
          }),
          (() => {
            const totalDesaStats = statsByRt["all"] || currentStats || {};
            const totalDesaValues = tGroup.items.map((item) => item.getValue(totalDesaStats) ?? 0);
            return ["Total Desa (Buong Baru)", ...totalDesaValues];
          })(),
        ];
        return {
          tableTitle: tGroup.title,
          headers,
          rows,
        };
      });

      exportCardToExcel({
        cardTitle,
        tables: excelTables,
        fileName,
      });
      return;
    }

    if (items && items.length > 0) {
      const headers = ["Wilayah / RT", ...items.map((item) => item.label)];
      const rows = [
        ...rts.map((rt) => {
          const rtStats = statsByRt[rt.key] || {};
          const indicatorValues = items.map((item) => item.getValue(rtStats) ?? 0);
          return [rt.label, ...indicatorValues];
        }),
        (() => {
          const totalDesaStats = statsByRt["all"] || currentStats || {};
          const totalDesaValues = items.map((item) => item.getValue(totalDesaStats) ?? 0);
          return ["Total Desa (Buong Baru)", ...totalDesaValues];
        })(),
      ];

      exportCardToExcel({
        cardTitle,
        headers,
        rows,
        fileName,
      });
    }
  };

  return (
    <button
      onClick={handleDownload}
      type="button"
      title={`Unduh Excel: ${cardTitle}`}
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#cc785c] hover:text-[#cc785c] bg-[#cc785c]/10 hover:bg-[#cc785c]/20 border border-[#cc785c]/30 rounded-lg transition-colors cursor-pointer shrink-0 ${className}`}
    >
      <Download className="w-3 h-3" />
      <span>{buttonText}</span>
    </button>
  );
}
