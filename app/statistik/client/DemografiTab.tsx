"use client";

import React from "react";

interface DemografiTabProps {
  stats: any;
}

/**
 * Komponen Client Tab Demografi Rumah Tangga
 * Menampilkan komposisi jenis kelamin, status perkawinan, kelompok umur, agama, dan suku
 * Tampilan Publik Bersih Tanpa Kode Variabel / Kode Angka Param
 */
export default function DemografiTab({ stats }: DemografiTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Row 1: Komposisi Jenis Kelamin & Status Perkawinan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Komposisi Jenis Kelamin */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Komposisi Jenis Kelamin Penduduk
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#e6dfd8] space-y-1">
              <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">Laki-Laki</span>
              <p className="text-2xl font-extrabold text-[#141413]">{stats.pria?.toLocaleString("id-ID")} <span className="text-xs text-[#6c6a64]">Jiwa</span></p>
              <span className="text-xs font-bold text-[#cc785c]">{stats.priaPercentage}% Dari Total</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#e6dfd8] space-y-1">
              <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider block">Perempuan</span>
              <p className="text-2xl font-extrabold text-[#141413]">{stats.wanita?.toLocaleString("id-ID")} <span className="text-xs text-[#6c6a64]">Jiwa</span></p>
              <span className="text-xs font-bold text-emerald-700">{stats.wanitaPercentage}% Dari Total</span>
            </div>
          </div>
          <div className="w-full bg-[#efe9de] h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-[#cc785c] h-full" style={{ width: `${stats.priaPercentage}%` }} />
            <div className="bg-emerald-600 h-full" style={{ width: `${stats.wanitaPercentage}%` }} />
          </div>
        </div>

        {/* Card 2: Status Perkawinan */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Status Perkawinan Penduduk
          </h3>
          <div className="space-y-2.5">
            {stats.statusPerkawinan?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#3d3d3a]">{item.label}</span>
                  <span className="text-[#141413] font-bold">{item.value} Jiwa ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-[#efe9de] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Kelompok Umur & Agama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Distribusi Kelompok Umur */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Distribusi Kelompok Umur
          </h3>
          <div className="space-y-2.5">
            {stats.kelompokUmur?.map((item: any, idx: number) => (
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

        {/* Card 2: Agama yang Dianut */}
        <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
            Agama &amp; Kepercayaan yang Dianut
          </h3>
          <div className="space-y-2.5">
            {stats.agama?.map((item: any, idx: number) => (
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

      {/* Row 3: Latar Belakang Suku / Etnis */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
        <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-3">
          Komposisi Latar Belakang Suku / Etnis Penduduk
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {stats.sebaranSuku?.map((item: any, idx: number) => (
            <div key={idx} className="p-3.5 bg-white rounded-xl border border-[#e6dfd8] space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#141413] truncate max-w-[140px]" title={item.label}>
                  {item.label}
                </span>
                <span className="text-[10px] font-extrabold text-[#cc785c] bg-[#efe9de] px-1.5 py-0.5 rounded">
                  {item.percentage}%
                </span>
              </div>
              <p className="text-lg font-extrabold text-[#141413]">
                {item.value} <span className="text-xs font-normal text-[#6c6a64]">Jiwa</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
