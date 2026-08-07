"use client";

import React from "react";
import CardDownloadButton from "@/components/CardDownloadButton";

interface SosialEkonomiTabProps {
  stats: any;
  statsByRt?: Record<string, any>;
}

/**
 * Komponen Client Tab Sosial Ekonomi Keluarga (Statistik 501, 502, 503, 505, 506, 507)
 * Menampilkan partisipasi sekolah, ijazah tertinggi, lapangan pekerjaan, kepemilikan rekening bank, disabilitas & penyakit kronis
 */
export default function SosialEkonomiTab({ stats, statsByRt }: SosialEkonomiTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Row 1: Partisipasi Sekolah & Ijazah Tertinggi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Partisipasi Sekolah */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Partisipasi Sekolah Penduduk
            </h3>
            <CardDownloadButton
              cardTitle="Partisipasi Sekolah Penduduk"
              statsByRt={statsByRt}
              currentStats={stats}
              items={(stats.partisipasiSekolah || []).map((item: any) => ({
                label: item.label,
                getValue: (s: any) => {
                  const match = (s.partisipasiSekolah || []).find((x: any) => x.label === item.label);
                  return match ? match.value : 0;
                },
              }))}
            />
          </div>
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

        {/* Card 2: Ijazah / Pendidikan Tertinggi */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Pendidikan / Ijazah Tertinggi Diperoleh
            </h3>
            <CardDownloadButton
              cardTitle="Pendidikan dan Ijazah Tertinggi Penduduk"
              statsByRt={statsByRt}
              currentStats={stats}
              items={(stats.ijazahTertinggi || []).map((item: any) => ({
                label: item.label,
                getValue: (s: any) => {
                  const match = (s.ijazahTertinggi || []).find((x: any) => x.label === item.label);
                  return match ? match.value : 0;
                },
              }))}
            />
          </div>
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

      {/* Row 2: Pekerjaan Utama & Kepemilikan Rekening Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Pekerjaan Utama Penduduk */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Lapangan Pekerjaan Utama Penduduk
            </h3>
            <CardDownloadButton
              cardTitle="Lapangan Pekerjaan Utama Penduduk"
              statsByRt={statsByRt}
              currentStats={stats}
              items={(stats.pekerjaanUtama || []).map((item: any) => ({
                label: item.label,
                getValue: (s: any) => {
                  const match = (s.pekerjaanUtama || []).find((x: any) => x.label === item.label);
                  return match ? match.value : 0;
                },
              }))}
            />
          </div>
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

        {/* Card 2: Kepemilikan Rekening Bank / Tabungan */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Kepemilikan Rekening Bank &amp; Akun Keuangan
            </h3>
            <CardDownloadButton
              cardTitle="Kepemilikan Rekening Bank Penduduk"
              statsByRt={statsByRt}
              currentStats={stats}
              items={(stats.kepemilikanRekening || []).map((item: any) => ({
                label: item.label,
                getValue: (s: any) => {
                  const match = (s.kepemilikanRekening || []).find((x: any) => x.label === item.label);
                  return match ? match.value : 0;
                },
              }))}
            />
          </div>
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

      {/* Row 3: Rekapitulasi Disabilitas & Penyakit Kronis / Menahun */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Rekapitulasi Disabilitas */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Rekapitulasi Penyandang Disabilitas
            </h3>
            <CardDownloadButton
              cardTitle="Rekapitulasi Penyandang Disabilitas"
              statsByRt={statsByRt}
              currentStats={stats}
              items={(stats.rekapDisabilitas || []).map((item: any) => ({
                label: item.label,
                getValue: (s: any) => {
                  const match = (s.rekapDisabilitas || []).find((x: any) => x.label === item.label);
                  return match ? match.value : 0;
                },
              }))}
            />
          </div>
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

        {/* Card 2: Rekapitulasi Penyakit Kronis / Menahun */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Rekapitulasi Penyakit Kronis / Menahun
            </h3>
            <CardDownloadButton
              cardTitle="Rekapitulasi Penyakit Kronis Menahun"
              statsByRt={statsByRt}
              currentStats={stats}
              items={(stats.rekapPenyakit || []).map((item: any) => ({
                label: item.label,
                getValue: (s: any) => {
                  const match = (s.rekapPenyakit || []).find((x: any) => x.label === item.label);
                  return match ? match.value : 0;
                },
              }))}
            />
          </div>
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


