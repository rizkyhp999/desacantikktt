"use client";

import React from "react";
import { HeartHandshake, Gift, Award, Home, ShieldCheck, Info } from "lucide-react";
import CardDownloadButton from "@/components/CardDownloadButton";

interface BantuanSosialTabProps {
  stats: any;
  statsByRt?: Record<string, any>;
}

/**
 * Komponen Client Tab Bantuan Sosial / Subsidi Setahun Terakhir
 * Tampilan Publik Bersih Tanpa Kode Variabel / Kode Angka Param
 */
export default function BantuanSosialTab({ stats, statsByRt }: BantuanSosialTabProps) {
  const totalKeluarga = stats.totalKeluarga || 188;
  const totalPenerimaBansosDesa = stats.totalPenerimaBansosDesa || 101;
  const rekap1118 = stats.rekap1118 || {
    a: 37, b: 24, c: 24, d: 22, e: 2, f: 7, g: 4, h: 6, i: 2, j: 1, k: 54
  };

  // List Program Bansos / Subsidi Seluruh Desa
  const listBansos1118 = [
    { key: "a", name: "Program Keluarga Harapan (PKH)", count: rekap1118.a, category: "Perlindungan Sosial" },
    { key: "b", name: "Program Atensi Lansia", count: rekap1118.b, category: "Perlindungan Sosial" },
    { key: "c", name: "Bantuan Pangan Non Tunai (BPNT) / Sembako", count: rekap1118.c, category: "Pangan & Sembako" },
    { key: "d", name: "Bantuan Langsung Tunai (BLT) Dana Desa", count: rekap1118.d, category: "Bantuan Tunai Desa" },
    { key: "e", name: "Bantuan Bagi Pelaku Usaha Mikro (BPUM)", count: rekap1118.e, category: "Usaha Mikro" },
    { key: "f", name: "Program Bantuan Pupuk Subsidi", count: rekap1118.f, category: "Subsidi Pertanian" },
    { key: "g", name: "Program Bantuan Sarana / Peralatan Produksi", count: rekap1118.g, category: "Peralatan Produksi" },
    { key: "h", name: "Program Bantuan Bibit / Benih", count: rekap1118.h, category: "Pertanian / Perkebunan" },
    { key: "i", name: "Program Bantuan Pakan Perikanan / Ternak", count: rekap1118.i, category: "Peternakan / Perikanan" },
    { key: "j", name: "Program Bantuan Dari Swasta / CSR Company", count: rekap1118.j, category: "Corporate CSR" },
    { key: "k", name: "Bantuan Khusus Nelayan (Mesin Ketinting & Alat Tangkap)", count: rekap1118.k, category: "Khusus Nelayan" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Header Information Banner ── */}
      <div className="p-4 bg-[#faf9f5] border border-[#e6dfd8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#141413]">
            Penerimaan Bantuan Sosial &amp; Subsidi Seluruh Rumah Tangga Desa Buong Baru
          </h3>
          <p className="text-xs text-[#6c6a64] font-medium">
            Cakupan komprehensif seluruh {totalKeluarga} KK di Desa Buong Baru meliputi PKH, BPNT Sembako, BLT Dana Desa, Bantuan Alat Ketinting Nelayan, Bantuan Sarana Produksi, dan Subsidi Pupuk.
          </p>
        </div>
      </div>

      {/* ── Top Highlight Metric Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total KK Menerima Bantuan Sosial */}
        <div className="p-5 bg-white border border-[#e6dfd8] rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider">
              Total Menerima Bansos
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#141413]">
            {totalPenerimaBansosDesa} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
          </p>
          <span className="text-xs font-bold text-emerald-700 block">
            {Math.round((totalPenerimaBansosDesa / totalKeluarga) * 100)}% KK Desa Tercover Bantuan
          </span>
        </div>

        {/* Card 2: PKH Harapan */}
        <div className="p-5 bg-white border border-[#e6dfd8] rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider">
              Program Keluarga Harapan (PKH)
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#141413]">
            {rekap1118.a} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
          </p>
          <span className="text-xs font-bold text-blue-700 block">
            {Math.round((rekap1118.a / totalKeluarga) * 100)}% KK Penerima PKH Desa
          </span>
        </div>

        {/* Card 3: Bantuan Khusus Nelayan Ketinting */}
        <div className="p-5 bg-white border border-[#e6dfd8] rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider">
              Bantuan Mesin Ketinting
            </span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-100">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#141413]">
            {rekap1118.k} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
          </p>
          <span className="text-xs font-bold text-purple-700 block">
            {Math.round((rekap1118.k / totalKeluarga) * 100)}% KK Nelayan Penerima Ketinting
          </span>
        </div>

        {/* Card 4: BLT Dana Desa */}
        <div className="p-5 bg-white border border-[#e6dfd8] rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider">
              BLT Dana Desa
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#141413]">
            {rekap1118.d} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
          </p>
          <span className="text-xs font-bold text-amber-700 block">
            {Math.round((rekap1118.d / totalKeluarga) * 100)}% KK Penerima BLT Desa
          </span>
        </div>
      </div>

      {/* ── Detailed Grid All Social Aid Programs ── */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6dfd8] pb-3">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <Gift className="w-4 h-4 text-emerald-700" />
            Rincian Penerimaan Bantuan Sosial &amp; Subsidi per Program
          </h3>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              11 Skema Program Terdata
            </span>

            {/* Tombol 1: Excel RT di Kolom (RT 001 - RT 005 di atas) */}
            <CardDownloadButton
              cardTitle="Penerimaan Bantuan Sosial dan Subsidi per Program (RT di Kolom)"
              mode="rt_columns"
              buttonText="Excel (RT Kolom)"
              statsByRt={statsByRt}
              currentStats={stats}
              items={[
                { label: "Total Menerima Bansos", getValue: (s) => s.totalPenerimaBansosDesa || 0 },
                ...listBansos1118.map((b) => ({
                  label: b.name,
                  getValue: (s: any) => s.rekap1118?.[b.key] || 0,
                })),
              ]}
            />

            {/* Tombol 2: Excel RT di Baris (RT 001 - RT 005 di samping/baris) */}
            <CardDownloadButton
              cardTitle="Penerimaan Bantuan Sosial dan Subsidi per Program (RT di Baris)"
              mode="rt_rows"
              buttonText="Excel (RT Baris)"
              statsByRt={statsByRt}
              currentStats={stats}
              items={[
                { label: "Total Menerima Bansos", getValue: (s) => s.totalPenerimaBansosDesa || 0 },
                ...listBansos1118.map((b) => ({
                  label: b.name,
                  getValue: (s: any) => s.rekap1118?.[b.key] || 0,
                })),
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listBansos1118.map((item, idx) => {
            const isReceived = item.count > 0;
            const pct = Math.round((item.count / totalKeluarga) * 100);
            return (
              <div 
                key={item.key} 
                className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between transition-all ${
                  isReceived ? "bg-white border-[#e6dfd8] hover:border-[#cc785c] shadow-2xs" : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#efe9de] text-[#cc785c]">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold text-[#6c6a64]">Program #{idx + 1}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#141413] leading-snug pt-1">
                    {item.name}
                  </h4>
                </div>

                <div className="flex items-end justify-between border-t border-[#f0eae4] pt-2">
                  <div>
                    <span className="text-[10px] text-[#6c6a64] block font-medium">Penerima</span>
                    <p className="text-lg font-extrabold text-[#141413]">
                      {item.count} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                    {pct}% dari {totalKeluarga} KK
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
