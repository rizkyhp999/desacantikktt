"use client";

import React from "react";
import { Anchor, Navigation, Fish, DollarSign, Table, Layers, Users, Wrench, PackageCheck, CheckCircle2, Building2 } from "lucide-react";

interface PenangkapanIkanTabProps {
  stats: any;
}

/**
 * Komponen Client Tab Usaha Penangkapan Perikanan
 * Menampilkan 12 KK Pelaku Usaha Penangkapan Perikanan (Responden 1 s.d. Responden 12)
 * dengan rincian keuangan (1007, 1008a, 1008b, 1009, 1010_c-e, 1010_f, 1011, 1013, 1014, 1015, 1016)
 * serta widget REKAPITULASI AGREGAT di bawah tabel untuk 1102 (Nama Kelompok), 1103 (Manfaat Kelompok), dan 1107 (Sarana & Prasarana).
 */
export default function PenangkapanIkanTab({ stats }: PenangkapanIkanTabProps) {
  const totalUsaha = stats.totalUsahaIkan1001 || 0;
  const totalTrip = stats.totalTrip1007 || 0;
  const totalVol = stats.totalVolume1008a || 0;
  const totalNilai = stats.totalNilai1008b || 0;
  const total1009 = stats.totalNilaiTangkapan1009 || 0;
  const total1015 = stats.totalPengeluaran1015 || 0;
  const total1016 = stats.totalPendapatan1016 || 0;
  const rincianList = stats.rincianTangkapanList || [];

  // Data Rekapitulasi Agregat 1102, 1103, 1107
  const rekap1102 = stats.rekap1102 || {
    "BETAYAU BAGU": 3,
    "KELOMPOK NELAYAN": 2,
    "BETAYAU SERUMPUN": 1,
    "NELAYAN TAKA": 1,
    "Tidak Tergabung": 5,
  };

  const rekap1103 = stats.rekap1103 || { a: 2, b: 1, c: 0, d: 1, e: 2, f: 1, g: 0 };

  const rekap1107 = stats.rekap1107 || {
    a: { total: 2, milikSendiri: 0, sewa: 0, milikBersama: 2 },
    b: { total: 7, milikSendiri: 7, sewa: 0, milikBersama: 0 },
    c: { total: 7, milikSendiri: 7, sewa: 0, milikBersama: 0 },
    d: { total: 7, milikSendiri: 7, sewa: 0, milikBersama: 0 },
    e: { total: 7, milikSendiri: 7, sewa: 0, milikBersama: 0 },
    f: { total: 7, milikSendiri: 7, sewa: 0, milikBersama: 0 },
    g: { total: 6, milikSendiri: 6, sewa: 0, milikBersama: 0 },
    h: { total: 6, milikSendiri: 6, sewa: 0, milikBersama: 0 },
    i: { total: 7, milikSendiri: 7, sewa: 0, milikBersama: 0 },
  };

  // Hitung total akumulasi per variabel keuangan untuk baris SUM (12 Responden)
  const sum1007 = rincianList.reduce((acc: number, r: any) => acc + (r.v1007 || 0), 0);
  const sum1008_a = rincianList.reduce((acc: number, r: any) => acc + (r.v1008_a || 0), 0);
  const sum1008_b = rincianList.reduce((acc: number, r: any) => acc + (r.v1008_b || 0), 0);
  const sum1009 = rincianList.reduce((acc: number, r: any) => acc + (r.v1009 || 0), 0);
  const sum1010_c = rincianList.reduce((acc: number, r: any) => acc + (r.v1010_c || 0), 0);
  const sum1010_d = rincianList.reduce((acc: number, r: any) => acc + (r.v1010_d || 0), 0);
  const sum1010_e = rincianList.reduce((acc: number, r: any) => acc + (r.v1010_e || 0), 0);
  const sum1010_f = rincianList.reduce((acc: number, r: any) => acc + (r.v1010_f || 0), 0);
  const sum1011 = rincianList.reduce((acc: number, r: any) => acc + (r.v1011 || 0), 0);
  const sum1013 = rincianList.reduce((acc: number, r: any) => acc + (r.v1013 || 0), 0);
  const sum1014 = rincianList.reduce((acc: number, r: any) => acc + (r.v1014 || 0), 0);
  const sum1015 = rincianList.reduce((acc: number, r: any) => acc + (r.v1015 || 0), 0);
  const sum1016 = rincianList.reduce((acc: number, r: any) => acc + (r.v1016 || 0), 0);

  // Label nama item 1103
  const listManfaat1103 = [
    { key: "a", name: "Akses Sarana Produksi Perikanan", count: rekap1103.a },
    { key: "b", name: "Penggunaan Alsintan / Mesin Bersama", count: rekap1103.b },
    { key: "c", name: "Penyuluhan, Pelatihan & Informasi", count: rekap1103.c },
    { key: "d", name: "Permodalan & Pembiayaan Perikanan", count: rekap1103.d },
    { key: "e", name: "Pemasaran Hasil Perikanan & Informasi Harga", count: rekap1103.e },
    { key: "f", name: "Pembangunan / Perbaikan Infrastruktur", count: rekap1103.f },
    { key: "g", name: "Manfaat Lainnya", count: rekap1103.g },
  ];

  // Label nama item 1107
  const listSarana1107 = [
    { key: "a", name: "Perahu / Kapal Tanpa Motor", data: rekap1107.a },
    { key: "b", name: "Perahu Motor Tempel", data: rekap1107.b },
    { key: "c", name: "Kapal Motor", data: rekap1107.c },
    { key: "d", name: "Alat Tangkap Perikanan (Jaring, Pukat, Bubu, Pancing)", data: rekap1107.d },
    { key: "e", name: "Mesin Penggerak Kapal", data: rekap1107.e },
    { key: "f", name: "Alat Bantu Penangkapan (GPS, Sonar, Lampu)", data: rekap1107.f },
    { key: "g", name: "Tempat Penyimpanan / Gudang", data: rekap1107.g },
    { key: "h", name: "Coolbox / Kotak Es Penyimpanan", data: rekap1107.h },
    { key: "i", name: "Sarana / Prasarana Transportasi Penunjang", data: rekap1107.i },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Header Information Banner ── */}
      <div className="p-4 bg-[#faf9f5] border border-[#e6dfd8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#141413]">
            Rekapitulasi Keuangan &amp; Kelembagaan Usaha Penangkapan Perikanan
          </h3>
          <p className="text-xs text-[#6c6a64] font-medium">
            Rincian lengkap 12 KK pelaku usaha penangkapan perikanan: rincian keuangan, keanggotaan kelompok, manfaat kelompok, serta penguasaan sarana &amp; prasarana perikanan.
          </p>
        </div>
      </div>

      {/* ── Summary Metric Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total RT Usaha Penangkapan Perikanan */}
        <div className="p-5 bg-white border border-[#e6dfd8] rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider">
              Usaha Perikanan Tangkap
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
              <Anchor className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#141413]">
            {totalUsaha.toLocaleString("id-ID")} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
          </p>
          <span className="text-xs font-bold text-emerald-700 block">
            Rumah Tangga Tangkap Perikanan
          </span>
        </div>

        {/* Card 2: Jumlah Trip Penangkapan */}
        <div className="p-5 bg-white border border-[#e6dfd8] rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider">
              Jumlah Trip Penangkapan
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#141413]">
            {totalTrip.toLocaleString("id-ID")} <span className="text-xs font-semibold text-[#6c6a64]">Trip/Thn</span>
          </p>
          <span className="text-xs font-bold text-blue-700 block">
            Total Frekuensi Trip Penangkapan
          </span>
        </div>

        {/* Card 3: Volume Hasil Tangkapan Perikanan */}
        <div className="p-5 bg-white border border-[#e6dfd8] rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider">
              Volume Tangkapan Ikan
            </span>
            <div className="p-2 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-100">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#141413]">
            {totalVol.toLocaleString("id-ID")} <span className="text-xs font-semibold text-[#6c6a64]">Kg</span>
          </p>
          <span className="text-xs font-bold text-cyan-700 block">
            {(totalVol / 1000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} Ton Produksi Perikanan/Tahun
          </span>
        </div>

        {/* Card 4: Nilai Tangkapan Perikanan / Omzet Total */}
        <div className="p-5 bg-white border border-[#e6dfd8] rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6c6a64] font-bold uppercase tracking-wider">
              Nilai Hasil Tangkapan
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#cc785c]">
            Rp {total1009.toLocaleString("id-ID")}
          </p>
          <span className="text-xs font-bold text-amber-700 block">
            Total Omzet Produksi Tangkapan Perikanan
          </span>
        </div>
      </div>

      {/* ── Tabel Utama Rincian Keuangan Per Responden ── */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <Table className="w-4 h-4 text-[#cc785c]" />
            Tabel Keuangan Usaha Penangkapan Perikanan (12 Responden)
          </h3>
          <span className="text-xs font-bold text-[#6c6a64]">
            {rincianList.length} Responden
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#e6dfd8] text-[#6c6a64] font-bold bg-[#efe9de]/70">
                <th className="py-3 px-3 text-center sticky left-0 bg-[#efe9de] z-10 shadow-2xs">No</th>
                <th className="py-3 px-3 sticky left-10 bg-[#efe9de] z-10 shadow-2xs">Responden</th>
                <th className="py-3 px-3 text-center bg-blue-50/80 text-blue-800">Trip / Thn</th>
                <th className="py-3 px-3 text-right bg-cyan-50/80 text-cyan-800">Tangkapan (Kg/Trip)</th>
                <th className="py-3 px-3 text-right bg-amber-50/80 text-[#cc785c]">Nilai (Rp/Trip)</th>
                <th className="py-3 px-3 text-right bg-amber-100/70 text-[#cc785c] font-extrabold">Nilai Tangkapan / Thn</th>
                <th className="py-3 px-3 text-right">Biaya BBM / Trip</th>
                <th className="py-3 px-3 text-right">Biaya Air / Trip</th>
                <th className="py-3 px-3 text-right">Biaya Umpan / Trip</th>
                <th className="py-3 px-3 text-right bg-amber-50/50">Total Biaya / Trip</th>
                <th className="py-3 px-3 text-right bg-rose-50/60 text-rose-700">Biaya Operasional / Thn</th>
                <th className="py-3 px-3 text-right">Biaya Jasa / Thn</th>
                <th className="py-3 px-3 text-right">Biaya Lainnya / Thn</th>
                <th className="py-3 px-3 text-right bg-rose-100/70 text-rose-800 font-extrabold">Total Pengeluaran / Thn</th>
                <th className="py-3 px-3 text-right bg-emerald-100/80 text-emerald-800 font-extrabold">Pendapatan Bersih / Thn</th>
              </tr>
            </thead>
            <tbody>
              {rincianList.map((row: any, idx: number) => {
                const trip = row.v1007 || 0;
                const volPerTrip = row.v1008_a || 0;
                const nilaiPerTrip = row.v1008_b || 0;
                const val1009 = row.v1009 || 0;
                const val1010_c = row.v1010_c || 0;
                const val1010_d = row.v1010_d || 0;
                const val1010_e = row.v1010_e || 0;
                const val1010_f = row.v1010_f || 0;
                const val1011 = row.v1011 || 0;
                const val1013 = row.v1013 || 0;
                const val1014 = row.v1014 || 0;
                const val1015 = row.v1015 || 0;
                const val1016 = row.v1016 || 0;

                return (
                  <tr key={idx} className="border-b border-[#f0eae4] last:border-b-0 hover:bg-[#efe9de]/40 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-[#6c6a64] sticky left-0 bg-white z-10">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-[#141413] sticky left-10 bg-white z-10">
                      {row.respondenLabel || `Responden ${idx + 1}`}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/30">
                      {trip.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-cyan-800 bg-cyan-50/30">
                      {volPerTrip.toLocaleString("id-ID")} Kg
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#cc785c] bg-amber-50/30">
                      Rp {nilaiPerTrip.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-[#cc785c] bg-amber-100/40">
                      Rp {val1009.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#141413]">
                      Rp {val1010_c.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#141413]">
                      Rp {val1010_d.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#141413]">
                      Rp {val1010_e.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#141413] bg-amber-50/20">
                      Rp {val1010_f.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-rose-700 bg-rose-50/30">
                      Rp {val1011.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#141413]">
                      Rp {val1013.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#141413]">
                      Rp {val1014.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-rose-800 bg-rose-100/40">
                      Rp {val1015.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-emerald-800 bg-emerald-100/40">
                      Rp {val1016.toLocaleString("id-ID")}
                    </td>
                  </tr>
                );
              })}
              {/* Baris Total Keseluruhan (SUM) */}
              <tr className="border-t-2 border-[#e6dfd8] bg-[#efe9de] font-extrabold text-xs">
                <td className="py-3 px-3 text-center sticky left-0 bg-[#efe9de] z-10" colSpan={2}>
                  TOTAL KESELURUHAN (SUM)
                </td>
                <td className="py-3 px-3 text-center text-blue-800">
                  {sum1007.toLocaleString("id-ID")} Trip
                </td>
                <td className="py-3 px-3 text-right text-cyan-800">
                  {sum1008_a.toLocaleString("id-ID")} Kg
                </td>
                <td className="py-3 px-3 text-right text-[#cc785c]">
                  Rp {sum1008_b.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right text-[#cc785c]">
                  Rp {sum1009.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right">
                  Rp {sum1010_c.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right">
                  Rp {sum1010_d.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right">
                  Rp {sum1010_e.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right">
                  Rp {sum1010_f.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right text-rose-700">
                  Rp {sum1011.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right">
                  Rp {sum1013.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right">
                  Rp {sum1014.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right text-rose-800">
                  Rp {sum1015.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-3 text-right text-emerald-800">
                  Rp {sum1016.toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── REKAPITULASI AGREGAT 1: KEANGGOTAAN KELOMPOK ── */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            Distribusi Keanggotaan Kelompok Nelayan / Perikanan
          </h3>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            7 KK (58,3%) Tergabung Kelompok
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(rekap1102).map(([namaKlp, count]: [string, any], idx: number) => {
            const isNone = namaKlp === "Tidak Tergabung";
            return (
              <div key={idx} className={`p-3.5 rounded-xl border space-y-1.5 ${isNone ? "bg-gray-50 border-gray-200" : "bg-white border-[#e6dfd8] shadow-2xs"}`}>
                <span className={`text-[10px] font-bold block truncate ${isNone ? "text-gray-500" : "text-[#cc785c]"}`} title={namaKlp}>
                  {namaKlp}
                </span>
                <p className="text-xl font-extrabold text-[#141413]">
                  {count} <span className="text-xs font-semibold text-[#6c6a64]">KK</span>
                </p>
                <span className="text-[10px] text-[#6c6a64] block font-medium">
                  {Math.round((count / 12) * 100)}% dari total KK
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── REKAPITULASI AGREGAT 2: MANFAAT KEANGGOTAAN KELOMPOK ── */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-blue-700" />
            Manfaat Keanggotaan Kelompok Yang Dirasakan Nelayan
          </h3>
          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
            7 KK Anggota Kelompok
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listManfaat1103.map((item, idx) => {
            const pct = Math.round((item.count / 7) * 100);
            return (
              <div key={item.key} className="p-4 bg-white rounded-xl border border-[#e6dfd8] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#141413] truncate" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-xs font-extrabold text-blue-700 shrink-0">
                    {item.count} KK
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] text-[#6c6a64] font-medium block">
                  Diterima oleh {pct}% anggota kelompok perikanan
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── REKAPITULASI AGREGAT 3: PENGUASAAN SARANA & PRASARANA PERIKANAN ── */}
      <div className="p-5 border border-[#e6dfd8] rounded-xl bg-[#faf9f5] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3">
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-4 h-4 text-purple-700" />
            Penguasaan &amp; Status Kepemilikan Sarana Prasarana Perikanan
          </h3>
          <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
            9 Kategori Sarana
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listSarana1107.map((item) => {
            const d = item.data || { total: 0, milikSendiri: 0, sewa: 0, milikBersama: 0 };
            return (
              <div key={item.key} className="p-4 bg-white rounded-xl border border-[#e6dfd8] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between gap-2 border-b border-[#f0eae4] pb-2">
                  <span className="text-xs font-bold text-[#141413] truncate" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-xs font-extrabold text-purple-800 px-2 py-0.5 bg-purple-50 rounded shrink-0">
                    {d.total} KK Menguasai
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6c6a64] pt-1">
                  <span>Milik Sendiri: <strong className="text-[#141413]">{d.milikSendiri} KK</strong></span>
                  <span>Milik Bersama: <strong className="text-[#141413]">{d.milikBersama} KK</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
