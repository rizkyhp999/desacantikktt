"use client";

import React from "react";
import { Download } from "lucide-react";
import { exportCardToExcel } from "@/lib/excelExport";

export interface CardDownloadButtonProps {
  cardTitle: string;
  /**
   * Data breakdown per indikator / variabel.
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

    // 1. Kolom Header = "Wilayah / RT", diikuti oleh label setiap Indikator/Variabel
    const headers = [
      "Wilayah / RT",
      ...items.map((item) => item.label),
    ];

    // List RT dari RT 001 s/d RT 005
    const rts = [
      { key: "01", label: "RT 001" },
      { key: "02", label: "RT 002" },
      { key: "03", label: "RT 003" },
      { key: "04", label: "RT 004" },
      { key: "05", label: "RT 005" },
    ];

    // 2. Baris = RT 1 s/d RT 5, lalu Baris Terakhir = Total Desa
    const rows = [
      ...rts.map((rt) => {
        const rtStats = statsByRt[rt.key] || {};
        const indicatorValues = items.map((item) => item.getValue(rtStats) ?? 0);
        return [rt.label, ...indicatorValues];
      }),
      // Baris Total Desa (Buong Baru)
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
  };

  return (
    <button
      onClick={handleDownload}
      type="button"
      title={`Unduh Excel Data RT 1-5: ${cardTitle}`}
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#cc785c] hover:text-[#cc785c] bg-[#cc785c]/10 hover:bg-[#cc785c]/20 border border-[#cc785c]/30 rounded-lg transition-colors cursor-pointer shrink-0 ${className}`}
    >
      <Download className="w-3 h-3" />
      <span>Excel RT</span>
    </button>
  );
}
