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
interface KeadaanUsahaTabProps {
  stats: any;
}

/**
 * Komponen Client Tab Keadaan Usaha Penangkapan Perikanan
 * Tampilan Publik Bersih Tanpa Kode Variabel / Kode Angka Param
 */
export default function KeadaanUsahaTab({ stats }: KeadaanUsahaTabProps) {
  const { 
    rekap1108, 
    rekap1109a, 
    rekap1110, 
    rekap1111, 
    rekap1116, 
    rekap1117 
  } = stats;

  // Labels Keadaan Ekonomi
  const labels1108: Record<string, { title: string; color: string }> = {
    "1": { title: "Meningkat / Lebih Baik", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
    "2": { title: "Sama Saja / Stagnan", color: "bg-amber-50 text-amber-900 border-amber-200" },
    "3": { title: "Menurun / Lebih Buruk", color: "bg-rose-50 text-rose-900 border-rose-200" }
  };

  // Labels Kecukupan Pendapatan
  const labels1109a: Record<string, { title: string; color: string }> = {
    "1": { title: "Sangat Cukup", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
    "2": { title: "Cukup Memenuhi", color: "bg-sky-50 text-sky-900 border-sky-200" },
    "3": { title: "Kurang Cukup", color: "bg-rose-50 text-rose-900 border-rose-200" }
  };

  // Labels Tren Keuntungan
  const labels1117: Record<string, { title: string; color: string }> = {
    "1": { title: "Selalu Menguntungkan", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
    "2": { title: "Sering Menguntungkan", color: "bg-teal-50 text-teal-900 border-teal-200" },
    "3": { title: "Kadang Menguntungkan", color: "bg-amber-50 text-amber-900 border-amber-200" },
    "4": { title: "Tidak Pernah Untung", color: "bg-rose-50 text-rose-900 border-rose-200" }
  };

  // List Rincian Hambatan/Permasalahan
  const listHambatan1111 = [
    { key: "a", name: "Kelangkaan / Mahal BBM Operasional Kapal", count: rekap1111.a || 0 },
    { key: "b", name: "Keterbatasan Modal Usaha Penangkapan", count: rekap1111.b || 0 },
    { key: "c", name: "Kesulitan Tempat Penjualan / Pemasaran Hasil", count: rekap1111.c || 0 },
    { key: "d", name: "Harga Jual Ikan Tangkapan Terlalu Murah", count: rekap1111.d || 0 },
    { key: "e", name: "Peralatan Alat Tangkap Rusak / Tidak Memadai", count: rekap1111.e || 0 },
    { key: "f", name: "Perahu / Mesin Motor Tempel Sering Rusak", count: rekap1111.f || 0 },
    { key: "g", name: "Lokasi Wilayah Tangkapan Terlalu Jauh", count: rekap1111.g || 0 },
    { key: "h", name: "Jumlah Hasil Tangkapan Ikan Menurun", count: rekap1111.h || 0 },
    { key: "i", name: "Kelangkaan Umpan & Bahan Es Batu", count: rekap1111.i || 0 },
    { key: "j", name: "Keterbatasan Tenaga Kerja / ABK Perahu", count: rekap1111.j || 0 },
    { key: "k", name: "Kondisi Cuaca Ekstrem / Gelombang Tinggi", count: rekap1111.k || 0 },
    { key: "l", name: "Pencemaran / Kerusakan Lingkungan Perairan", count: rekap1111.l || 0 },
    { key: "m", name: "Maraknya Operasi Alat Tangkap Ilegal (Setrum/Racun)", count: rekap1111.m || 0 },
    { key: "n", name: "Maraknya Pencurian / Konflik Wilayah Tangkap", count: rekap1111.n || 0 },
    { key: "o", name: "Kesulitan Mengakses Informasi Pasar & Pelabuhan", count: rekap1111.o || 0 },
    { key: "p", name: "Perizinan Operasional Kapal Sulit Ditentukan", count: rekap1111.p || 0 },
    { key: "q", name: "Kurangnya Fasilitas Cold Storage / Pabrik Es", count: rekap1111.q || 0 },
    { key: "r", name: "Masalah Lainnya Terkait Usaha Penangkapan", count: rekap1111.r || 0 }
  ];

  // List Sumber Pembiayaan Kredit & Asuransi
  const listKredit1116 = [
    { key: "a", name: "Mengajukan Pinjaman / Kredit Pembiayaan Usaha", count: rekap1116.a || 0 },
    { key: "b", name: "Menerima Fasilitas Bantuan Kredit Program Pemerintah", count: rekap1116.b || 0 },
    { key: "c", name: "Memiliki Perlindungan Asuransi Nelayan / Jiwa", count: rekap1116.c || 0 }
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
          <div className="flex items-center justify-between border-b border-[#f0eae4] pb-3">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              Keadaan Ekonomi Sekarang dibanding Setahun Lalu
            </h3>
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
          <div className="flex items-center justify-between border-b border-[#f0eae4] pb-3">
            <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-700" />
              Kecukupan Pendapatan Memenuhi Kebutuhan Rumah Tangga
            </h3>
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
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-700" />
            Frekuensi Keuntungan Usaha Perikanan (3 Tahun Terakhir)
          </h3>
          <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
            100% Menguntungkan
          </span>
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
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
            1 KK (8,3%) Mengalami Masalah Spesifik
          </span>
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
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Sumber Pembiayaan, Kredit &amp; Asuransi Usaha Perikanan
          </h3>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Kredit &amp; Asuransi
          </span>
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
