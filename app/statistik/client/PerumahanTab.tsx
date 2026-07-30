"use client";

import React from "react";
import CardDownloadButton from "@/components/CardDownloadButton";

interface PerumahanTabProps {
  stats: any;
  statsByRt?: Record<string, any>;
}

/**
 * Komponen Client Tab Perumahan & Pemukiman
 * Menampilkan statistik karakteristik fisik bangunan, tanah, kondisi atap/dinding/lantai, sanitasi, penerangan & aset
 * Tampilan Publik Bersih Tanpa Kode Variabel / Kode Angka Param
 */
export default function PerumahanTab({ stats, statsByRt }: PerumahanTabProps) {
  // Support both key aliases to prevent empty data rendering
  const luasLantaiList = stats.luasLantaiSummary || stats.luasLantaiTabel || [];
  const atapList = stats.jenisAtap || stats.bahanAtap || [];
  const dindingList = stats.jenisDinding || stats.bahanDinding || [];
  const lantaiList = stats.jenisLantai || stats.bahanLantai || [];
  const dayaListrikList = stats.dayaListrik || stats.dayaListrikDetail || [];

  const kondisiAtapList = stats.kondisiAtap || [];
  const kondisiDindingList = stats.kondisiDinding || [];
  const kondisiLantaiList = stats.kondisiLantai || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* A. Karakteristik & Kepemilikan Bangunan / Tanah (Row 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Kiri: Karakteristik Bangunan & Status Kepemilikan */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-5">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Karakteristik &amp; Status Bangunan Tempat Tinggal
            </h3>
            <CardDownloadButton
              cardTitle="Karakteristik dan Kepemilikan Bangunan Tempat Tinggal"
              statsByRt={statsByRt}
              currentStats={stats}
              items={[
                ...(stats.jenisBangunan || []).map((j: any) => ({
                  label: `Jenis: ${j.label}`,
                  getValue: (s: any) => (s.jenisBangunan || []).find((x: any) => x.label === j.label)?.value || 0,
                })),
                ...(stats.kepemilikanBangunan || []).map((k: any) => ({
                  label: `Kepemilikan: ${k.label}`,
                  getValue: (s: any) => (s.kepemilikanBangunan || []).find((x: any) => x.label === k.label)?.value || 0,
                })),
              ]}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Jenis Bangunan */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
                Jenis Bangunan:
              </span>
              <div className="space-y-1.5">
                {stats.jenisBangunan?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-[#3d3d3a] truncate max-w-[130px] font-medium" title={item.label}>
                      {item.label}
                    </span>
                    <span className="font-bold text-[#141413] shrink-0 ml-1">{item.value} KK</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Kepemilikan Bangunan */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
                Kepemilikan Bangunan:
              </span>
              <div className="space-y-1.5">
                {stats.kepemilikanBangunan?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-[#3d3d3a] truncate max-w-[130px] font-medium" title={item.label}>
                      {item.label}
                    </span>
                    <span className="font-bold text-[#cc785c] shrink-0 ml-1">{item.value} KK</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card Kanan: Bukti Kepemilikan Tanah */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Bukti Kepemilikan Tanah Bangunan
            </h3>
            <CardDownloadButton
              cardTitle="Bukti Kepemilikan Tanah Bangunan Tempat Tinggal"
              statsByRt={statsByRt}
              currentStats={stats}
              items={(stats.kepemilikanTanah || []).map((t: any) => ({
                label: t.label,
                getValue: (s: any) => (s.kepemilikanTanah || []).find((x: any) => x.label === t.label)?.value || 0,
              }))}
            />
          </div>
          <div className="space-y-2.5">
            {stats.kepemilikanTanah?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#3d3d3a] truncate max-w-[280px]" title={item.label}>
                    {item.label}
                  </span>
                  <span className="text-[#141413] font-bold">{item.value} KK</span>
                </div>
                <div className="w-full bg-[#efe9de] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${stats.totalKeluarga ? Math.round((item.value / stats.totalKeluarga) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* B. Tabel Luas Lantai Bangunan Tempat Tinggal (Row 2) */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
            Distribusi Luas Lantai Bangunan Tempat Tinggal
          </h3>
          <CardDownloadButton
            cardTitle="Distribusi Luas Lantai Bangunan Tempat Tinggal"
            statsByRt={statsByRt}
            currentStats={stats}
            items={luasLantaiList.map((row: any) => {
              const label = row.category || row.label;
              return {
                label,
                getValue: (s: any) => {
                  const list = s.luasLantaiSummary || s.luasLantaiTabel || [];
                  const match = list.find((x: any) => (x.category || x.label) === label);
                  return match ? (match.count ?? match.value ?? 0) : 0;
                },
              };
            })}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e6dfd8] text-[#6c6a64] font-bold">
                <th className="py-2 pb-3">Kategori Luas Lantai</th>
                <th className="py-2 pb-3 text-center">Jumlah Keluarga</th>
                <th className="py-2 pb-3 text-right">Persentase</th>
                <th className="py-2 pb-3 pl-6 w-1/3">Visualisasi Distribusi</th>
              </tr>
            </thead>
            <tbody>
              {luasLantaiList.map((row: any, idx: number) => {
                const category = row.category || row.label;
                const count = row.count ?? row.value ?? 0;
                const percentage = row.percentage ?? (stats.totalKeluarga ? Math.round((count / stats.totalKeluarga) * 100) : 0);
                return (
                  <tr key={idx} className="border-b border-[#f0eae4] last:border-b-0 hover:bg-[#efe9de]/50 transition-colors">
                    <td className="py-2.5 font-bold text-[#141413]">{category}</td>
                    <td className="py-2.5 text-center font-extrabold text-[#cc785c]">{count} KK</td>
                    <td className="py-2.5 text-right font-semibold text-[#6c6a64]">{percentage}%</td>
                    <td className="py-2.5 pl-6">
                      <div className="w-full bg-[#efe9de] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#cc785c] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* C. Material & Kondisi Fisik Bangunan: Atap, Dinding & Lantai (Row 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Jenis & Kondisi Atap Terluas */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Atap: Bahan &amp; Kondisi Fisik
            </h3>
            <CardDownloadButton
              cardTitle="Atap: Jenis Bahan dan Kondisi Fisik"
              statsByRt={statsByRt}
              currentStats={stats}
              tables={[
                {
                  title: "Bahan Atap Terluas",
                  items: atapList.map((item: any) => ({
                    label: item.label,
                    getValue: (s: any) => {
                      const list = s.jenisAtap || s.bahanAtap || [];
                      return list.find((x: any) => x.label === item.label)?.value || 0;
                    },
                  })),
                },
                {
                  title: "Kondisi Fisik Atap",
                  items: kondisiAtapList.map((item: any) => ({
                    label: item.label,
                    getValue: (s: any) => (s.kondisiAtap || []).find((x: any) => x.label === item.label)?.value || 0,
                  })),
                },
              ]}
            />
          </div>
          
          {/* Bahan Atap */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
              Bahan Atap Terluas:
            </span>
            <div className="space-y-1">
              {atapList.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs py-0.5 border-b border-dashed border-[#e6dfd8] last:border-b-0">
                  <span className="text-[#3d3d3a] font-medium">{item.label}</span>
                  <span className="font-bold text-[#141413]">{item.value} KK</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kondisi Atap */}
          {kondisiAtapList.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#e6dfd8]">
              <span className="text-[10px] text-[#cc785c] font-bold uppercase tracking-wider block">
                Kondisi Fisik Atap:
              </span>
              <div className="space-y-1">
                {kondisiAtapList.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                    <span className="text-[#3d3d3a] font-semibold">{item.label}</span>
                    <span className="font-extrabold text-[#cc785c]">{item.value} KK</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Jenis & Kondisi Dinding Terluas */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Dinding: Bahan &amp; Kondisi Fisik
            </h3>
            <CardDownloadButton
              cardTitle="Dinding: Jenis Bahan dan Kondisi Fisik"
              statsByRt={statsByRt}
              currentStats={stats}
              tables={[
                {
                  title: "Bahan Dinding Terluas",
                  items: dindingList.map((item: any) => ({
                    label: item.label,
                    getValue: (s: any) => {
                      const list = s.jenisDinding || s.bahanDinding || [];
                      return list.find((x: any) => x.label === item.label)?.value || 0;
                    },
                  })),
                },
                {
                  title: "Kondisi Fisik Dinding",
                  items: kondisiDindingList.map((item: any) => ({
                    label: item.label,
                    getValue: (s: any) => (s.kondisiDinding || []).find((x: any) => x.label === item.label)?.value || 0,
                  })),
                },
              ]}
            />
          </div>
          
          {/* Bahan Dinding */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
              Bahan Dinding Terluas:
            </span>
            <div className="space-y-1">
              {dindingList.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs py-0.5 border-b border-dashed border-[#e6dfd8] last:border-b-0">
                  <span className="text-[#3d3d3a] font-medium">{item.label}</span>
                  <span className="font-bold text-[#141413]">{item.value} KK</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kondisi Dinding */}
          {kondisiDindingList.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#e6dfd8]">
              <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
                Kondisi Fisik Dinding:
              </span>
              <div className="space-y-1">
                {kondisiDindingList.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                    <span className="text-[#3d3d3a] font-semibold">{item.label}</span>
                    <span className="font-extrabold text-blue-800">{item.value} KK</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Jenis & Kondisi Lantai Terluas */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Lantai: Bahan &amp; Kondisi Fisik
            </h3>
            <CardDownloadButton
              cardTitle="Lantai: Jenis Bahan dan Kondisi Fisik"
              statsByRt={statsByRt}
              currentStats={stats}
              tables={[
                {
                  title: "Bahan Lantai Terluas",
                  items: lantaiList.map((item: any) => ({
                    label: item.label,
                    getValue: (s: any) => {
                      const list = s.jenisLantai || s.bahanLantai || [];
                      return list.find((x: any) => x.label === item.label)?.value || 0;
                    },
                  })),
                },
                {
                  title: "Kondisi Fisik Lantai",
                  items: kondisiLantaiList.map((item: any) => ({
                    label: item.label,
                    getValue: (s: any) => (s.kondisiLantai || []).find((x: any) => x.label === item.label)?.value || 0,
                  })),
                },
              ]}
            />
          </div>
          
          {/* Bahan Lantai */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
              Bahan Lantai Terluas:
            </span>
            <div className="space-y-1">
              {lantaiList.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs py-0.5 border-b border-dashed border-[#e6dfd8] last:border-b-0">
                  <span className="text-[#3d3d3a] font-medium">{item.label}</span>
                  <span className="font-bold text-[#141413]">{item.value} KK</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kondisi Lantai */}
          {kondisiLantaiList.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#e6dfd8]">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                Kondisi Fisik Lantai:
              </span>
              <div className="space-y-1">
                {kondisiLantaiList.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                    <span className="text-[#3d3d3a] font-semibold">{item.label}</span>
                    <span className="font-extrabold text-emerald-800">{item.value} KK</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* D. Sanitasi, MCK & Sumber Air Minum (Row 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Fasilitas BAB & Jenis Kloset */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Fasilitas Sanitasi &amp; Kloset
            </h3>
            <CardDownloadButton
              cardTitle="Fasilitas Tempat BAB dan Jenis Kloset"
              statsByRt={statsByRt}
              currentStats={stats}
              tables={[
                {
                  title: "Fasilitas Tempat BAB",
                  items: (stats.mckFasilitas || []).map((m: any) => ({
                    label: m.label,
                    getValue: (s: any) => (s.mckFasilitas || []).find((x: any) => x.label === m.label)?.value || 0,
                  })),
                },
                {
                  title: "Jenis Kloset",
                  items: (stats.jenisKloset || []).map((k: any) => ({
                    label: k.label,
                    getValue: (s: any) => (s.jenisKloset || []).find((x: any) => x.label === k.label)?.value || 0,
                  })),
                },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Fasilitas BAB */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
                Fasilitas Tempat BAB:
              </span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                {stats.mckFasilitas?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-0.5 border-b border-dotted border-[#f0eae4] last:border-b-0">
                    <span className="text-[#3d3d3a] truncate max-w-[130px] font-medium" title={item.label}>
                      {item.label}
                    </span>
                    <span className="font-bold text-[#141413] shrink-0 ml-1">{item.value} KK</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Jenis Kloset */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
                Jenis Kloset:
              </span>
              <div className="space-y-1.5">
                {stats.jenisKloset?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-0.5 border-b border-dotted border-[#f0eae4] last:border-b-0">
                    <span className="text-[#3d3d3a] truncate max-w-[130px] font-medium" title={item.label}>
                      {item.label}
                    </span>
                    <span className="font-bold text-[#cc785c] shrink-0 ml-1">{item.value} KK</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Pembuangan Tinja & Sumber Air Minum */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              Pembuangan Tinja &amp; Sumber Air Minum
            </h3>
            <CardDownloadButton
              cardTitle="Pembuangan Akhir Tinja dan Sumber Air Minum"
              statsByRt={statsByRt}
              currentStats={stats}
              tables={[
                {
                  title: "Pembuangan Akhir Tinja",
                  items: (stats.pembuanganTinja || []).map((p: any) => ({
                    label: p.label,
                    getValue: (s: any) => (s.pembuanganTinja || []).find((x: any) => x.label === p.label)?.value || 0,
                  })),
                },
                {
                  title: "Sumber Air Minum Utama",
                  items: (stats.sumberAirMinumLengkap || []).map((a: any) => ({
                    label: a.label,
                    getValue: (s: any) => (s.sumberAirMinumLengkap || []).find((x: any) => x.label === a.label)?.value || 0,
                  })),
                },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pembuangan Tinja */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
                Pembuangan Akhir Tinja:
              </span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                {stats.pembuanganTinja?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-0.5 border-b border-dotted border-[#f0eae4] last:border-b-0">
                    <span className="text-[#3d3d3a] truncate max-w-[130px] font-medium" title={item.label}>
                      {item.label}
                    </span>
                    <span className="font-bold text-[#141413] shrink-0 ml-1">{item.value} KK</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Sumber Air Minum */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
                Sumber Air Minum Utama:
              </span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                {stats.sumberAirMinumLengkap?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-0.5 border-b border-dotted border-[#f0eae4] last:border-b-0">
                    <span className="text-[#3d3d3a] truncate max-w-[130px] font-medium" title={item.label}>
                      {item.label}
                    </span>
                    <span className="font-bold text-emerald-700 shrink-0 ml-1">{item.value} KK</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E. Sumber Penerangan & Daya Listrik (Row 5) */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
            Sumber Penerangan &amp; Daya Listrik Terpasang
          </h3>
          <CardDownloadButton
            cardTitle="Sumber Penerangan dan Daya Listrik Terpasang"
            statsByRt={statsByRt}
            currentStats={stats}
            tables={[
              {
                title: "Sumber Penerangan Utama",
                items: (stats.sumberPenerangan || []).map((p: any) => ({
                  label: p.label,
                  getValue: (s: any) => (s.sumberPenerangan || []).find((x: any) => x.label === p.label)?.value || 0,
                })),
              },
              {
                title: "Daya Listrik Terpasang",
                items: dayaListrikList.map((d: any) => ({
                  label: d.label,
                  getValue: (s: any) => {
                    const list = s.dayaListrik || s.dayaListrikDetail || [];
                    return list.find((x: any) => x.label === d.label)?.value || 0;
                  },
                })),
              },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Sumber Penerangan */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
              Sumber Penerangan Utama:
            </span>
            <div className="space-y-2">
              {stats.sumberPenerangan?.map((item: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[#3d3d3a]">{item.label}</span>
                    <span className="text-[#141413] font-bold">{item.value} KK</span>
                  </div>
                  <div className="w-full bg-[#efe9de] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{ width: `${stats.totalKeluarga ? Math.round((item.value / stats.totalKeluarga) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daya Listrik Terpasang */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">
              Daya Listrik Terpasang:
            </span>
            <div className="space-y-2">
              {dayaListrikList.map((item: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[#3d3d3a]">{item.label}</span>
                    <span className="text-[#141413] font-bold">{item.value} KK</span>
                  </div>
                  <div className="w-full bg-[#efe9de] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full"
                      style={{ width: `${stats.totalKeluarga ? Math.round((item.value / stats.totalKeluarga) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
