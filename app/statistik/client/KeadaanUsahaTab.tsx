"use client";

import React from "react";
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  ShieldCheck, 
  PieChart, 
  HelpCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import CardDownloadButton from "@/components/CardDownloadButton";

interface KeadaanUsahaTabProps {
  stats: any;
  statsByRt?: Record<string, any>;
}

/**
 * Komponen Client Tab Keadaan Usaha Penangkapan Perikanan
 * Tampilan Publik Bersih Tanpa Kode Variabel / Kode Angka Param
 */
export default function KeadaanUsahaTab({ stats, statsByRt }: KeadaanUsahaTabProps) {
  const { 
    rekap1108 = {}, 
    rekap1109a = {}, 
    rekap1110 = {}, 
    rekap1111 = {}, 
    rekap1116 = {}, 
    rekap1117 = {}
  } = stats;

  // Labels Keadaan Ekonomi (1108)
  const labels1108: Record<string, { title: string; color: string }> = {
    "1": { title: "Sangat Meningkat", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
    "2": { title: "Meningkat", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
    "3": { title: "Sama Saja / Stagnan", color: "bg-amber-50 text-amber-900 border-amber-200" },
    "4": { title: "Menurun / Buruk", color: "bg-rose-50 text-rose-900 border-rose-200" },
    "5": { title: "Sangat Menurun", color: "bg-rose-50 text-rose-900 border-rose-200" }
  };

  // Labels Kecukupan Pendapatan (1109a)
  const labels1109a: Record<string, { title: string; color: string }> = {
    "1": { title: "Sangat Berlebih", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
    "2": { title: "Lebih dari Cukup", color: "bg-sky-50 text-sky-900 border-sky-200" },
    "3": { title: "Cukup Memenuhi", color: "bg-amber-50 text-amber-900 border-amber-200" },
    "4": { title: "Kurang Cukup", color: "bg-rose-50 text-rose-900 border-rose-200" },
    "5": { title: "Sangat Kurang", color: "bg-rose-50 text-rose-900 border-rose-200" }
  };

  // Labels Tren Keuntungan 3 Tahun (1117)
  const labels1117: Record<string, { title: string; color: string }> = {
    "4": { title: "Selalu Menguntungkan", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
    "3": { title: "Untung 2 dari 3 Tahun", color: "bg-teal-50 text-teal-900 border-teal-200" },
    "2": { title: "Untung 1 dari 3 Tahun", color: "bg-amber-50 text-amber-900 border-amber-200" },
    "1": { title: "Selalu Rugi", color: "bg-rose-50 text-rose-900 border-rose-200" }
  };

  // List Rincian Hambatan/Permasalahan (1111_a s/d 1111_r)
  const listHambatan1111 = [
    { key: "a", name: "Tingginya Harga Kebutuhan Hidup Keluarga", count: rekap1111?.a || 0 },
    { key: "b", name: "Berkurangnya Pemasukan / Anggota Kehilangan Pekerjaan", count: rekap1111?.b || 0 },
    { key: "c", name: "Penyakit Serius / Kecelakaan / Kematian Anggota", count: rekap1111?.c || 0 },
    { key: "d", name: "Perceraian", count: rekap1111?.d || 0 },
    { key: "e", name: "Konflik / Kekerasan", count: rekap1111?.e || 0 },
    { key: "g", name: "Lahan Pertanian Sempit", count: rekap1111?.g || 0 },
    { key: "h", name: "Lahan Pertanian Berkurang", count: rekap1111?.h || 0 },
    { key: "i", name: "Modal Usaha Kecil / Terbatas", count: rekap1111?.i || 0 },
    { key: "j", name: "Akses Bahan Input (Pakan/Bibit/Es) Sulit", count: rekap1111?.j || 0 },
    { key: "k", name: "Akses Kredit Pembiayaan Sulit", count: rekap1111?.k || 0 },
    { key: "l", name: "Akses Sarana Produksi Perikanan Sulit", count: rekap1111?.l || 0 },
    { key: "m", name: "Akses Infrastruktur (Air/Irigasi) Sulit", count: rekap1111?.m || 0 },
    { key: "n", name: "Kesulitan Memasarkan Hasil Pertanian/Perikanan", count: rekap1111?.n || 0 },
    { key: "o", name: "Faktor Alam (Cuaca Ekstrem/Bencana)", count: rekap1111?.o || 0 },
    { key: "p", name: "Serangan Hama / Penyakit", count: rekap1111?.p || 0 },
    { key: "q", name: "Pencurian Aset / Uang / Barangnya", count: rekap1111?.q || 0 },
    { key: "r", name: "Permasalahan Lainnya", count: rekap1111?.r || 0 }
  ];

  // List Sumber Pembiayaan Kredit & Asuransi (1116)
  const listKredit1116 = [
    { key: "a", name: "Memiliki Akses Kredit (Formal / Non-Formal)", count: rekap1116?.a || 0 },
    { key: "b", name: "Menggunakan Asuransi Nelayan / Usaha", count: rekap1116?.b || 0 },
    { key: "c", name: "Tidak Menggunakan Kredit Maupun Asuransi", count: rekap1116?.c || 0 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Header Information Banner ── */}
      <div className="p-4 bg-[#faf9f5] border border-[#e6dfd8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#141413]">
            Keadaan Usaha Penangkapan Perikanan
          </h3>
          <p className="text-xs text-[#6c6a64] font-medium">
            Evaluasi perkembangan ekonomi, kecukupan pendapatan, hambatan permasalahan, pembiayaan kredit, serta tren keuntungan usaha nelayan.
          </p>
        </div>
      </div>

      {/* ── Section Ekonomi & Pendapatan ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Keadaan Ekonomi Sekarang vs Setahun Lalu */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-white space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#f0eae4] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              Keadaan Ekonomi vs Setahun Lalu
            </h3>
            <CardDownloadButton
              cardTitle="Keadaan Ekonomi dibanding Setahun Lalu"
              statsByRt={statsByRt}
              currentStats={stats}
              items={Object.entries(labels1108).map(([code, meta]) => ({
                label: meta.title,
                getValue: (s: any) => s.rekap1108?.[code] || 0,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(labels1108).map(([code, meta]) => {
              const count = rekap1108[code] || 0;
              const pct = Math.round((count / 12) * 100);
              return (
                <div key={code} className={`p-3 rounded-xl border space-y-1 ${meta.color}`}>
                  <span className="text-[10px] font-bold block">{meta.title}</span>
                  <p className="text-xl font-extrabold text-[#141413]">
                    {count} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
                  </p>
                  <span className="text-[10px] font-semibold text-[#6c6a64] block">{pct}% dari 12 KK</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kecukupan Pendapatan Memenuhi Kebutuhan RT */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-white space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#f0eae4] pb-3 gap-2">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-700" />
              Kecukupan Pendapatan
            </h3>
            <CardDownloadButton
              cardTitle="Kecukupan Pendapatan Memenuhi Kebutuhan RT"
              statsByRt={statsByRt}
              currentStats={stats}
              items={Object.entries(labels1109a).map(([code, meta]) => ({
                label: meta.title,
                getValue: (s: any) => s.rekap1109a?.[code] || 0,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(labels1109a).map(([code, meta]) => {
              const count = rekap1109a[code] || 0;
              const pct = Math.round((count / 12) * 100);
              return (
                <div key={code} className={`p-3 rounded-xl border space-y-1 ${meta.color}`}>
                  <span className="text-[10px] font-bold block">{meta.title}</span>
                  <p className="text-xl font-extrabold text-[#141413]">
                    {count} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
                  </p>
                  <span className="text-[10px] font-semibold text-[#6c6a64] block">{pct}% dari 12 KK</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section Frekuensi Keuntungan 3 Tahun Terakhir ── */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-700" />
            Frekuensi Keuntungan Usaha Perikanan (3 Tahun Terakhir)
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
              100% Menguntungkan
            </span>
            <CardDownloadButton
              cardTitle="Frekuensi Keuntungan Usaha Perikanan (3 Tahun Terakhir)"
              statsByRt={statsByRt}
              currentStats={stats}
              items={Object.entries(labels1117).map(([code, meta]) => ({
                label: meta.title,
                getValue: (s: any) => s.rekap1117?.[code] || 0,
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(labels1117).map(([code, meta]) => {
            const count = rekap1117[code] || 0;
            const pct = Math.round((count / 12) * 100);
            return (
              <div key={code} className={`p-4 rounded-xl border space-y-1.5 ${meta.color}`}>
                <span className="text-xs font-bold block">{meta.title}</span>
                <p className="text-2xl font-extrabold text-[#141413]">
                  {count} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
                </p>
                <span className="text-[10px] font-semibold text-[#6c6a64] block">{pct}% dari total pelaku usaha</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section Rincian Hambatan & Permasalahan ── */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6dfd8] pb-3">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            Rincian Hambatan &amp; Permasalahan Usaha Perikanan
          </h3>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {listHambatan1111.filter(x => x.count > 0).length} Jenis Hambatan Teridentifikasi
            </span>
            <CardDownloadButton
              cardTitle="Rincian Hambatan dan Permasalahan Usaha Perikanan"
              statsByRt={statsByRt}
              currentStats={stats}
              items={listHambatan1111.map((item) => ({
                label: item.name,
                getValue: (s: any) => s.rekap1111?.[item.key] || 0,
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {listHambatan1111.map((item, idx) => {
            const isOccurred = item.count > 0;
            return (
              <div key={item.key} className={`p-3.5 rounded-xl border space-y-1.5 ${isOccurred ? "bg-amber-50 border-amber-300" : "bg-white border-[#e6dfd8]"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold ${isOccurred ? "text-amber-900" : "text-[#141413]"}`}>
                    Kategori #{idx + 1}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${isOccurred ? "bg-amber-200 text-amber-900" : "bg-gray-100 text-gray-600"}`}>
                    {item.count} KK
                  </span>
                </div>
                <p className="text-[11px] text-[#6c6a64] font-medium leading-tight">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section Pembiayaan Kredit & Asuransi ── */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Sumber Pembiayaan, Kredit &amp; Asuransi Usaha Perikanan
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Kredit &amp; Asuransi
            </span>
            <CardDownloadButton
              cardTitle="Sumber Pembiayaan Kredit dan Asuransi Nelayan"
              statsByRt={statsByRt}
              currentStats={stats}
              items={listKredit1116.map((item) => ({
                label: item.name,
                getValue: (s: any) => s.rekap1116?.[item.key] || 0,
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {listKredit1116.map((item, idx) => {
            const pct = Math.round((item.count / 12) * 100);
            return (
              <div key={item.key} className="p-4 bg-white rounded-xl border border-[#e6dfd8] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between gap-2 border-b border-[#f0eae4] pb-2">
                  <span className="text-xs font-bold text-[#141413]">
                    Fasilitas #{idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-800 px-2 py-0.5 bg-emerald-50 rounded">
                    {item.count} KK ({pct}%)
                  </span>
                </div>
                <p className="text-xs font-medium text-[#6c6a64]">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
