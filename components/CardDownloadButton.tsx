"use client";

import React from "react";
import { Download } from "lucide-react";
import { exportCardToExcel } from "@/lib/excelExport";

export interface CardDownloadButtonProps {
  cardTitle: string;
  /**
   * Data breakdown per kategori / baris.
   * Contoh: [
   *   { label: "Laki-Laki", getValue: (s) => s?.pria || 0 },
   *   { label: "Perempuan", getValue: (s) => s?.wanita || 0 }
   * ]
   */
  items: Array<{
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
}

export default function CardDownloadButton({
  cardTitle,
  items,
  statsByRt = {},
  currentStats,
  fileName,
  className = "",
}: CardDownloadButtonProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();

    const headers = [
      "Indikator / Kategori",
      "RT 001",
      "RT 002",
      "RT 003",
      "RT 004",
      "RT 005",
      "Total Desa (Buong Baru)",
    ];

    const rts = ["01", "02", "03", "04", "05"];

    const rows = items.map((item) => {
      const rtValues = rts.map((rtKey) => {
        const rtStats = statsByRt[rtKey];
        if (!rtStats) return 0;
        return item.getValue(rtStats) ?? 0;
      });

      // Total Desa dari statsByRt["all"] atau currentStats
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
  };

  return (
    <button
      onClick={handleDownload}
      type="button"
      title={`Unduh Excel Data RT 1-5: ${cardTitle}`}
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#cc785c] hover:text-white bg-[#cc785c]/10 hover:bg-[#cc785c] border border-[#cc785c]/30 rounded-lg transition-colors cursor-pointer shrink-0 ${className}`}
    >
      <Download className="w-3 h-3" />
      <span>Excel RT</span>
    </button>
  );
}
