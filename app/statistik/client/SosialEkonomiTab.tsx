"use client";

import React from "react";

interface SosialEkonomiTabProps {
  stats: any;
}

/**
 * Komponen Client Tab Sosial Ekonomi Keluarga (Statistik 501, 502, 503, 505, 506, 507)
 * Menampilkan partisipasi sekolah, ijazah tertinggi, lapangan pekerjaan, kepemilikan rekening bank, disabilitas & penyakit kronis
 */
export default function SosialEkonomiTab({ stats }: SosialEkonomiTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Row 1: Partisipasi Sekolah (501) & Ijazah Tertinggi (502) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Partisipasi Sekolah (501) */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Partisipasi Sekolah Penduduk (501)
          </h3>
          <div className="space-y-2.5">
            {stats.partisipasiSekolah?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#3d3d3a]">{item.label}</span>
                  <span className="text-[#141413] font-bold">{item.value} Jiwa ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-[#efe9de] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#cc785c] h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Ijazah / Pendidikan Tertinggi (502) */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Pendidikan / Ijazah Tertinggi Diperoleh (502)
          </h3>
          <div className="space-y-2.5">
            {stats.ijazahTertinggi?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#3d3d3a]">{item.label}</span>
                  <span className="text-[#141413] font-bold">{item.value} Jiwa ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-[#efe9de] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Pekerjaan Utama (503) & Kepemilikan Rekening Bank (505) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Pekerjaan Utama Penduduk (503) */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Lapangan Pekerjaan Utama Penduduk (503)
          </h3>
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {stats.pekerjaanUtama?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#3d3d3a] truncate max-w-[240px]" title={item.label}>
                    {item.label}
                  </span>
                  <span className="text-[#141413] font-bold">{item.value} Jiwa ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-[#efe9de] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Kepemilikan Rekening Bank / Tabungan (505) */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Kepemilikan Rekening Bank &amp; Akun Keuangan (505)
          </h3>
          <div className="space-y-2.5">
            {stats.kepemilikanRekening?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#3d3d3a]">{item.label}</span>
                  <span className="text-[#141413] font-bold">{item.value} Jiwa ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-[#efe9de] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#cc785c] h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Rekapitulasi Disabilitas (506) & Penyakit Kronis / Menahun (507) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Rekapitulasi Disabilitas (506) */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Rekapitulasi Penyandang Disabilitas (506_a - 506_f)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.rekapDisabilitas?.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-[#e6dfd8] space-y-1 shadow-2xs">
                <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block truncate" title={item.label}>
                  {item.label}
                </span>
                <p className="text-lg font-extrabold text-[#141413]">
                  {item.value.toLocaleString("id-ID")} <span className="text-xs font-semibold text-[#6c6a64]">Jiwa</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Rekapitulasi Penyakit Kronis / Menahun (507) */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Rekapitulasi Penyakit Kronis / Menahun (507_a - 507_o)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {stats.rekapPenyakit?.map((item: any, idx: number) => (
              <div key={idx} className="p-2.5 bg-white rounded-lg border border-[#e6dfd8] space-y-0.5 shadow-2xs">
                <span className="text-[9px] text-[#6c6a64] font-bold uppercase tracking-wider block truncate" title={item.label}>
                  {item.label}
                </span>
                <p className="text-base font-extrabold text-[#cc785c]">
                  {item.value.toLocaleString("id-ID")} <span className="text-[10px] font-semibold text-[#6c6a64]">Kasus</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
