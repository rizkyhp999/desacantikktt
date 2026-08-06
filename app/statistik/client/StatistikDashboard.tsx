"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CardDownloadButton from "@/components/CardDownloadButton";
import PerumahanTab from "./PerumahanTab";
import DemografiTab from "./DemografiTab";
import SosialEkonomiTab from "./SosialEkonomiTab";
import PenangkapanIkanTab from "./PenangkapanIkanTab";
import KeadaanUsahaTab from "./KeadaanUsahaTab";
import BantuanSosialTab from "./BantuanSosialTab";
import PublikasiClient from "@/app/publikasi/client/PublikasiClient";
import {
  Users,
  GraduationCap,
  Briefcase,
  Sprout,
  Home,
  Anchor,
  Droplet,
  Flame,
  ChevronRight,
  TrendingUp,
  Map,
  Activity,
  Heart,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle2,
} from "lucide-react";

// ─────────────────────────────────────────
// DATA SIMULASI FALLBACK
// ─────────────────────────────────────────

const FALLBACK_STATS = {
  totalKeluarga: 524,
  totalPenduduk: 1842,
  alamatDomisiliPenduduk: [
    { label: "1 = Sesuai KK dan KTP", value: 1420, percentage: 77 },
    { label: "2 = Hanya sesuai KK", value: 310, percentage: 17 },
    { label: "3 = Hanya sesuai KTP", value: 18, percentage: 1 },
    { label: "4 = Tidak sesuai KK dan KTP", value: 44, percentage: 2 },
    { label: "Lainnya / Tidak Terdata", value: 50, percentage: 3 },
  ],
  alamatDomisiliKeluarga: [
    { label: "1 = Sesuai KK dan KTP", value: 460, percentage: 88 },
    { label: "2 = Hanya sesuai KK", value: 12, percentage: 2 },
    { label: "3 = Hanya sesuai KTP", value: 2, percentage: 0 },
    { label: "4 = Tidak sesuai KK dan KTP", value: 20, percentage: 4 },
    { label: "Lainnya / Tidak Terdata", value: 30, percentage: 6 },
  ],
  usiaProduktif: 67,
  luasLahanTotal: 175.3,
  pria: 968,
  wanita: 874,
  priaPercentage: 53,
  wanitaPercentage: 47,
  kelompokUmur: [
    { label: "Balita (0-4)", value: 142, percentage: 8 },
    { label: "Anak-anak (5-14)", value: 298, percentage: 16 },
    { label: "Remaja (15-24)", value: 345, percentage: 19 },
    { label: "Dewasa (25-59)", value: 890, percentage: 48 },
    { label: "Lansia (60+)", value: 167, percentage: 9 },
  ],
  agama: [
    { label: "Islam", value: 1680, percentage: 91 },
    { label: "Kristen Protestan", value: 110, percentage: 6 },
    { label: "Katolik", value: 52, percentage: 3 },
  ],
  ijazahTertinggi: [
    { label: "Tidak/Belum Sekolah", value: 320, percentage: 17 },
    { label: "SD / Sederajat", value: 480, percentage: 26 },
    { label: "SMP / Sederajat", value: 395, percentage: 21 },
    { label: "SMA / Sederajat", value: 520, percentage: 28 },
    { label: "Diploma (D1-D3)", value: 42, percentage: 2 },
    { label: "Sarjana / Pascasarjana (S1-S3)", value: 85, percentage: 6 },
  ],
  pekerjaanUtama: [
    { label: "Petani/Pekebun Sawit", value: 680, percentage: 45 },
    { label: "Karyawan Swasta", value: 240, percentage: 16 },
    { label: "Pedagang/Wirausaha", value: 155, percentage: 10 },
    { label: "Buruh Harian Lepas", value: 120, percentage: 8 },
    { label: "ASN / TNI / Polri", value: 48, percentage: 3 },
    { label: "Tidak Bekerja / IRT", value: 265, percentage: 18 },
  ],
  statusKedudukan: [
    { label: "Berusaha sendiri", value: 342 },
    { label: "Berusaha dibantu buruh", value: 68 },
    { label: "Buruh/karyawan/pegawai swasta", value: 412 },
    { label: "ASN/TNI/Polri/BUMN/BUMD/pejabat negara/kades", value: 89 },
    { label: "Pekerja bebas", value: 120 },
    { label: "Pekerja keluarga/tidak dibayar", value: 145 },
    { label: "Tidak tahu", value: 12 },
  ],
  luasLahanDikuasai: [
    { label: "Kebun Kelapa Sawit", value: 1245000, formatted: "124,5 Ha" },
    { label: "Tanaman Pangan Padi", value: 423000, formatted: "42,3 Ha" },
    { label: "Peternakan Sapi/Babi", value: 85000, formatted: "8,5 Ha" },
  ],
  sumberAirMinum: [
    { label: "Air Isi Ulang", percentage: 45 },
    { label: "Sumur Bor/Terlindung", percentage: 32 },
    { label: "Air Sungai/Permukaan", percentage: 12 },
    { label: "Air Hujan & Lainnya", percentage: 11 },
  ],
  sanitasiBab: [
    { label: "Fasilitas Sendiri (Septik Tank)", percentage: 78 },
    { label: "MCK Komunal / Bersama", percentage: 14 },
    { label: "Saluran Terbuka / Sungai", percentage: 8 },
  ],
  dayaListrik: [
    { label: "PLN 900 Watt", value: 280, percentage: 53 },
    { label: "PLN 1300 Watt", value: 164, percentage: 31 },
    { label: "PLN 450 Watt", value: 65, percentage: 13 },
    { label: "Non-PLN / Genset", value: 15, percentage: 3 },
  ],
  jenisBangunan: [
    { label: "Rumah tunggal", value: 180 },
    { label: "Rumah deret", value: 12 },
    { label: "Rumah susun", value: 0 },
    { label: "Apartemen", value: 0 },
    { label: "Lainnya", value: 6 }
  ],
  kepemilikanBangunan: [
    { label: "Milik sendiri", value: 172 },
    { label: "Kontrak/sewa", value: 10 },
    { label: "Bebas sewa", value: 12 },
    { label: "Dinas", value: 4 },
    { label: "Lainnya", value: 0 }
  ],
  kepemilikanTanah: [
    { label: "Sertifikat Hak Milik (SHM)", value: 145 },
    { label: "Sertifikat selain SHM (SHGB, SHSRS)", value: 8 },
    { label: "Surat bukti lainnya (Girik, Letter C, dll)", value: 35 },
    { label: "Tidak punya", value: 10 }
  ],
  luasLantaiTabel: [
    { label: "Kurang dari 20 m²", value: 15, percentage: 8 },
    { label: "20 - 49 m²", value: 45, percentage: 23 },
    { label: "50 - 99 m²", value: 98, percentage: 50 },
    { label: "100 - 149 m²", value: 30, percentage: 15 },
    { label: "150 m² atau lebih", value: 10, percentage: 5 }
  ],
  bahanLantai: [
    { label: "Keramik", value: 125 },
    { label: "Kayu/ papan", value: 45 },
    { label: "Semen/ bata merah", value: 28 }
  ],
  kondisiLantai: [
    { label: "Baik", value: 150 },
    { label: "Rusak ringan", value: 35 },
    { label: "Rusak sedang", value: 10 },
    { label: "Rusak berat", value: 3 }
  ],
  bahanDinding: [
    { label: "Tembok", value: 110 },
    { label: "Kayu/ papan/ gipsum/ GRC/ calciboard", value: 78 },
    { label: "Anyaman bambu", value: 10 }
  ],
  kondisiDinding: [
    { label: "Baik", value: 140 },
    { label: "Rusak ringan", value: 42 },
    { label: "Rusak sedang", value: 12 },
    { label: "Rusak berat", value: 4 }
  ],
  bahanAtap: [
    { label: "Seng", value: 165 },
    { label: "Beton", value: 12 },
    { label: "Asbes", value: 15 },
    { label: "Jerami/ ijuk/ daun-daunan/ rumbia", value: 6 }
  ],
  kondisiAtap: [
    { label: "Baik", value: 148 },
    { label: "Rusak ringan", value: 38 },
    { label: "Rusak sedang", value: 10 },
    { label: "Rusak berat", value: 2 }
  ],
  mckFasilitas: [
    { label: "Ada, digunakan satu rumah", value: 165 },
    { label: "Ada, digunakan beberapa rumah", value: 20 },
    { label: "Ada, di MCK komunal", value: 5 },
    { label: "Tidak ada", value: 4 }
  ],
  jenisKloset: [
    { label: "Leher angsa", value: 178 },
    { label: "Plengseran dengan tutup", value: 10 },
    { label: "Cemplung / cubluk", value: 6 }
  ],
  pembuanganTinja: [
    { label: "Tangki septik", value: 172 },
    { label: "Lubang tanah", value: 15 },
    { label: "Kolam/sungai/laut", value: 7 }
  ],
  sumberAirMinumLengkap: [
    { label: "Air isi ulang", value: 95 },
    { label: "Sumur bor/ pompa", value: 65 },
    { label: "Air kemasan bermerek", value: 22 },
    { label: "Air permukaan/ sungai", value: 12 }
  ],
  sumberPenerangan: [
    { label: "Listrik PLN dengan meteran", value: 185 },
    { label: "Listrik PLN tanpa meteran", value: 5 },
    { label: "Listrik non-PLN", value: 4 }
  ],
  dayaListrikDetail: [
    { label: "450 watt / 2 Ampere", value: 65 },
    { label: "900 watt / 4 Ampere", value: 105 },
    { label: "1300 watt / 6 Ampere", value: 20 },
    { label: "2200 watt / 8 Ampere", value: 4 }
  ],
  kepemilikanAset314: [
    { label: "Tabung Gas 3 kg (314a)", value: 340 },
    { label: "Tabung Gas ≥ 5,5 kg (314b)", value: 45 },
    { label: "Lemari Es / Kulkas (314c)", value: 162 },
    { label: "Pendingin Ruangan / AC (314d)", value: 18 },
    { label: "Komputer / Laptop / Tablet (314f)", value: 85 },
    { label: "Sepeda Motor (314g.1)", value: 280 },
    { label: "Mobil (314h.1)", value: 42 }
  ],
  statusPerkawinan: [
    { label: "Belum kawin", value: 351, percentage: 55 },
    { label: "Kawin/nikah", value: 262, percentage: 41 },
    { label: "Cerai mati", value: 15, percentage: 2 },
    { label: "Cerai hidup", value: 9, percentage: 1 }
  ],
  sebaranSuku: [
    { label: "Suku Tidung", value: 332, percentage: 52 },
    { label: "Suku Bugis", value: 55, percentage: 9 },
    { label: "Suku Timur / NTT", value: 51, percentage: 8 },
    { label: "Suku Jawa", value: 41, percentage: 6 },
    { label: "Suku Bulungan", value: 32, percentage: 5 },
    { label: "Suku Dayak", value: 14, percentage: 2 },
    { label: "Arab / Keturunan", value: 12, percentage: 2 },
    { label: "Suku Lainnya", value: 106, percentage: 16 }
  ],
  partisipasiSekolah: [],
  kepemilikanRekening: [],
  rekapDisabilitas: [],
  rekapPenyakit: [],
  totalUsahaIkan1001: 12,
  totalTrip1007: 488,
  totalVolume1008a: 8962,
  totalNilai1008b: 612800000,
  totalNilaiTangkapan1009: 569643200,
  totalPengeluaran1015: 272648152,
  totalPendapatan1016: 296995048,
  totalPendapatan1017: 296995048,
  rincianTangkapanList: [],
  rekap1102: {
    "BETAYAU BAGU": 3,
    "KELOMPOK NELAYAN": 2,
    "BETAYAU SERUMPUN": 1,
    "NELAYAN TAKA": 1,
    "Tidak Tergabung": 5,
  },
};

const MANFAAT_KELOMPOK = [
  { label: "Akses Pupuk & Sarana Produksi", percentage: 88 },
  { label: "Penggunaan Alsintan Bersama", percentage: 76 },
  { label: "Pemasaran Hasil Pertanian", percentage: 64 },
  { label: "Permodalan/Kredit Usaha", percentage: 42 },
];

type TabId = "perumahan" | "demografi" | "sosial_ekonomi" | "penangkapan_ikan" | "keadaan_usaha_perikanan" | "bantuan_sosial_subsidi" | "publikasi";

/**
 * Komponen Client Dashboard Statistik Desa Buong Baru
 * Menyajikan visualisasi chart berbasis SVG/HTML yang dinamis dan terhubung dengan database
 */
export default function StatistikDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("perumahan");
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [statsByRt, setStatsByRt] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRt, setSelectedRt] = useState<string>("all");

  const fetchStatistik = async (rtVal: string = selectedRt, forceRefresh: boolean = false) => {
    setLoading(true);
    try {
      const url = `/api/data/statistik?rt=${rtVal}${forceRefresh ? "&refresh=true" : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.stats) {
        setStats(json.stats);
        setStatsByRt((prev) => ({ ...prev, [rtVal]: json.stats }));
      }
    } catch (err) {
      console.error("Gagal mengambil data statistik dinamis:", err);
    } finally {
      setLoading(false);
    }
  };

  // Prefetch data seluruh RT (all, 01, 02, 03, 04, 05) di background untuk Excel instant export
  useEffect(() => {
    const fetchAllRts = async () => {
      const rts = ["all", "01", "02", "03", "04", "05"];
      const results: Record<string, any> = {};
      await Promise.all(
        rts.map(async (rt) => {
          try {
            const res = await fetch(`/api/data/statistik?rt=${rt}&refresh=true`);
            const json = await res.json();
            if (json.success && json.stats) {
              results[rt] = json.stats;
            }
          } catch (e) {
            console.error(`Gagal prefetch RT ${rt}`, e);
          }
        })
      );
      setStatsByRt((prev) => ({ ...prev, ...results }));
    };

    fetchAllRts();
  }, []);

  useEffect(() => {
    fetchStatistik(selectedRt);
  }, [selectedRt]);

  const tabList = [
    { id: "perumahan", label: "Perumahan", icon: Home },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Header Dashboard ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6dfd8] pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>Infografis &amp; Data Kualitatif Desa</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sudah mengikuti GSBPM dan Pembinaan Desa Cantik oleh BPS Kabupaten Tana Tidung</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
            Dashboard Statistik Desa Buong Baru (Kondisi Juli 2026)
          </h1>
          <p className="text-sm text-[#6c6a64] max-w-3xl font-medium leading-relaxed">
            Visualisasi agregat indikator utama kependudukan, tingkat kesejahteraan, pemanfaatan lahan pertanian, serta fasilitas sanitasi lingkungan pemukiman. Data kependudukan mencakup seluruh warga dan keluarga yang berdomisili nyata di Desa Buong Baru (baik ber-KTP lokal maupun KTP luar).
          </p>
        </div>
        
        {/* Control Controls: Filter RT & Refresh (Berdampingan secara horizontal) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Dropdown Filter RT (Variabel 106_a) */}
          <div className="flex items-center gap-2 bg-white border border-[#e6dfd8] rounded-xl px-3.5 py-2 shadow-2xs">
            <Map className="w-4 h-4 text-[#cc785c] shrink-0" />
            <span className="text-xs font-bold text-[#141413] whitespace-nowrap">Wilayah RT:</span>
            <select
              value={selectedRt}
              onChange={(e) => setSelectedRt(e.target.value)}
              className="text-xs font-bold text-[#cc785c] bg-transparent outline-none cursor-pointer border-none focus:ring-0 pr-1"
            >
              <option value="all">Semua RT (Desa Buong Baru)</option>
              <option value="01">RT 001</option>
              <option value="02">RT 002</option>
              <option value="03">RT 003</option>
              <option value="04">RT 004</option>
              <option value="05">RT 005</option>
            </select>
          </div>

          {/* Tombol Refresh / Reload */}
          <button
            onClick={() => fetchStatistik(selectedRt, true)}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold bg-[#efe9de] text-[#141413] hover:bg-[#e8e0d2] border border-[#e6dfd8] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* ── Ringkasan Kunci (Stat Cards) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Penduduk */}
        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] text-[#6c6a64] uppercase font-bold tracking-wider">Total Penduduk</span>
            <div className="flex items-center gap-1.5">
              <CardDownloadButton
                cardTitle="Statistik Total Penduduk Berdasarkan Alamat Domisili"
                statsByRt={statsByRt}
                currentStats={stats}
                items={[
                  {
                    label: "1 = Sesuai KK dan KTP",
                    getValue: (s: any) => (s.alamatDomisiliPenduduk || []).find((x: any) => x.label.startsWith("1"))?.value || 0,
                  },
                  {
                    label: "2 = Hanya sesuai KK",
                    getValue: (s: any) => (s.alamatDomisiliPenduduk || []).find((x: any) => x.label.startsWith("2"))?.value || 0,
                  },
                  {
                    label: "3 = Hanya sesuai KTP",
                    getValue: (s: any) => (s.alamatDomisiliPenduduk || []).find((x: any) => x.label.startsWith("3"))?.value || 0,
                  },
                  {
                    label: "4 = Tidak sesuai KK dan KTP",
                    getValue: (s: any) => (s.alamatDomisiliPenduduk || []).find((x: any) => x.label.startsWith("4"))?.value || 0,
                  },
                  {
                    label: "Lainnya / Tidak Terdata",
                    getValue: (s: any) => (s.alamatDomisiliPenduduk || []).find((x: any) => x.label.includes("Lainnya"))?.value || 0,
                  },
                  {
                    label: "Total Penduduk",
                    getValue: (s: any) => s.totalPenduduk || 0,
                  },
                ]}
              />
              <div className="p-2 bg-[#cc785c]/10 rounded-lg text-[#cc785c]">
                <Users className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#141413]">
              {loading ? "..." : stats.totalPenduduk.toLocaleString("id-ID")}
            </p>
            <p className="text-[10px] text-[#6c6a64] font-semibold mt-1">Warga berdomisili nyata (KTP Desa / Luar)</p>
          </div>
        </div>

        {/* Card 2: Jumlah Keluarga (Hasil 204 kode 1) */}
        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] text-[#6c6a64] uppercase font-bold tracking-wider">Jumlah Keluarga</span>
            <div className="flex items-center gap-1.5">
              <CardDownloadButton
                cardTitle="Statistik Jumlah Keluarga Berdasarkan Alamat Domisili"
                statsByRt={statsByRt}
                currentStats={stats}
                items={[
                  {
                    label: "1 = Sesuai KK dan KTP",
                    getValue: (s: any) => (s.alamatDomisiliKeluarga || []).find((x: any) => x.label.startsWith("1"))?.value || 0,
                  },
                  {
                    label: "2 = Hanya sesuai KK",
                    getValue: (s: any) => (s.alamatDomisiliKeluarga || []).find((x: any) => x.label.startsWith("2"))?.value || 0,
                  },
                  {
                    label: "3 = Hanya sesuai KTP",
                    getValue: (s: any) => (s.alamatDomisiliKeluarga || []).find((x: any) => x.label.startsWith("3"))?.value || 0,
                  },
                  {
                    label: "4 = Tidak sesuai KK dan KTP",
                    getValue: (s: any) => (s.alamatDomisiliKeluarga || []).find((x: any) => x.label.startsWith("4"))?.value || 0,
                  },
                  {
                    label: "Lainnya / Tidak Terdata",
                    getValue: (s: any) => (s.alamatDomisiliKeluarga || []).find((x: any) => x.label.includes("Lainnya"))?.value || 0,
                  },
                  {
                    label: "Total Keluarga",
                    getValue: (s: any) => s.totalKeluarga || 0,
                  },
                ]}
              />
              <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700">
                <Home className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#141413]">
              {loading ? "..." : stats.totalKeluarga.toLocaleString("id-ID")}
            </p>
            <p className="text-[10px] text-[#6c6a64] font-semibold mt-1">Keluarga menetap aktif (KTP Desa / Luar)</p>
          </div>
        </div>

        {/* Card 3: Usia Produktif */}
        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6c6a64] uppercase font-bold tracking-wider">Usia Produktif</span>
            <div className="p-2 bg-cyan-50 border border-cyan-100 rounded-lg text-cyan-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#141413]">
              {loading ? "..." : `${stats.usiaProduktif}%`}
            </p>
            <p className="text-[10px] text-[#6c6a64] font-semibold mt-1">Rentang umur 15-59 tahun</p>
          </div>
        </div>

        {/* Card 4: Status Kedudukan */}
        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-1.5">
            <span className="text-[10px] text-[#6c6a64] uppercase font-bold tracking-wider">Status Kedudukan</span>
            <div className="p-1.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-700">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="space-y-1 flex-1 overflow-y-auto max-h-[140px] pr-1 scrollbar-thin">
            {stats.statusKedudukan?.map((status, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px] sm:text-xs py-0.5 border-b border-dotted border-[#f0eae4] last:border-b-0">
                <span className="font-semibold text-[#3d3d3a] truncate max-w-[150px]" title={status.label}>
                  {status.label}
                </span>
                <span className="font-bold text-[#cc785c] shrink-0 ml-2">
                  {status.value} <span className="text-[9px] text-[#6c6a64] font-normal">Jiwa</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Switcher Menu ── */}
      <div className="flex overflow-x-auto p-1 rounded-xl bg-[#efe9de] border border-[#e6dfd8] gap-1.5">
        {[
          { id: "perumahan", label: "Perumahan & Pemukiman", icon: Home },
          { id: "demografi", label: "Demografi Rumah Tangga", icon: Users },
          { id: "sosial_ekonomi", label: "Sosial Ekonomi Keluarga", icon: GraduationCap },
          { id: "penangkapan_ikan", label: "Usaha Penangkapan Perikanan", icon: Anchor },
          { id: "keadaan_usaha_perikanan", label: "Keadaan Usaha Perikanan", icon: Activity },
          { id: "bantuan_sosial_subsidi", label: "Bantuan Sosial & Subsidi", icon: Heart },
          { id: "publikasi", label: "Publikasi & Dokumen", icon: GraduationCap },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? "bg-[#cc785c] text-white shadow-xs"
                  : "text-[#3d3d3a] hover:bg-[#e8e0d2] hover:text-[#141413]"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Area Dashboard Konten Tab ── */}
      <div className="bg-white border border-[#e6dfd8] rounded-2xl p-6 sm:p-8 shadow-xs min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-xs text-[#6c6a64]">
            <div className="w-8 h-8 border-2 border-[#cc785c] border-t-transparent rounded-full animate-spin" />
            <p className="font-bold">Mengalkulasi indikator statistik dari database...</p>
          </div>
        ) : (
          <>
            {/* ──────── TAB 1: PERUMAHAN & PEMUKIMAN ──────── */}
            {activeTab === "perumahan" && <PerumahanTab stats={stats} statsByRt={statsByRt} />}

            {/* ──────── TAB 2: DEMOGRAFI RUMAH TANGGA ──────── */}
            {activeTab === "demografi" && <DemografiTab stats={stats} statsByRt={statsByRt} />}

            {/* ──────── TAB 3: SOSIAL EKONOMI KELUARGA ──────── */}
            {activeTab === "sosial_ekonomi" && <SosialEkonomiTab stats={stats} statsByRt={statsByRt} />}

            {/* ──────── TAB 4: USAHA PENANGKAPAN PERIKANAN ──────── */}
            {activeTab === "penangkapan_ikan" && <PenangkapanIkanTab stats={stats} statsByRt={statsByRt} />}

            {/* ──────── TAB 5: KEADAAN USAHA PENANGKAPAN PERIKANAN ──────── */}
            {activeTab === "keadaan_usaha_perikanan" && <KeadaanUsahaTab stats={stats} statsByRt={statsByRt} />}

            {/* ──────── TAB 6: BANTUAN SOSIAL / SUBSIDI SETAHUN TERAKHIR ──────── */}
            {activeTab === "bantuan_sosial_subsidi" && <BantuanSosialTab stats={stats} statsByRt={statsByRt} />}

            {/* ──────── TAB 7: PUBLIKASI & DOKUMEN RESMI ──────── */}
            {activeTab === "publikasi" && <PublikasiClient />}
          </>
        )}

      </div>
    </div>
  );
}
