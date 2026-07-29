"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  History, 
  MapPin, 
  Landmark, 
  TrendingUp, 
  Shield, 
  Sparkles, 
  Crown, 
  Compass, 
  TreePine, 
  Road, 
  Coins, 
  CheckCircle2, 
  Award,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TabId = "sejarah" | "pemimpin" | "geografis" | "ekonomi";

/**
 * Data 15 Periode Kepala Desa (Tabel I.I)
 */
const SEJARAH_PEMIMPIN = [
  { no: 1,  periode: "1900 – 1957", nama: "YAKI ABULAHAB", status: "Pangeran Temenggung / Pembakal / Kepala Kampung (Kesultanan Bulungan)" },
  { no: 2,  periode: "1958 – 1963", nama: "YAKI IDRIS", status: "Pembakal" },
  { no: 3,  periode: "1964 – 1969", nama: "HUSEN JEFRI", status: "Pembakal" },
  { no: 4,  periode: "1970 – 1975", nama: "YAKI SALEH", status: "Pembakal" },
  { no: 5,  periode: "1976 – 1999", nama: "SYAMSUDIN", status: "Kepala Kampung (23 Tahun Menjabat)" },
  { no: 6,  periode: "2000 – 2006", nama: "HANAPI. At", status: "Kepala Desa" },
  { no: 7,  periode: "2007 – 2012", nama: "SABRANSYAH MS", status: "Kepala Desa" },
  { no: 8,  periode: "2013 – 2014", nama: "ISHAK", status: "PJ. Kepala Desa" },
  { no: 9,  periode: "2015 – 2017", nama: "JAPARUDIN", status: "Kepala Desa" },
  { no: 10, periode: "2018 – 2019", nama: "DODI ISKANDAR", status: "PLH. Kepala Desa" },
  { no: 11, periode: "2019 – 2020", nama: "ISHAK", status: "PJ. Kepala Desa" },
  { no: 12, periode: "2020",        nama: "JAPARUDIN", status: "Kepala Desa" },
  { no: 13, periode: "2020",        nama: "DODI ISKANDAR", status: "PLH. Kepala Desa" },
  { no: 14, periode: "2021",        nama: "KASMIR GAFFAR HUNALO", status: "PJ. Kepala Desa" },
  { no: 15, periode: "2021 – Sekarang", nama: "ISHAK", status: "Kepala Desa Definitif" },
];

/**
 * Data Semboyan "IMAN TIDUNG"
 */
const MOTTO_IMAN_TIDUNG = [
  { letter: "I", title: "Idaman", desc: "IDAMAN Seluruh Masyarakat Desa" },
  { letter: "M", title: "Menarik", desc: "MENARIK Dengan Pesona Lingkungan Alam" },
  { letter: "A", title: "Aman", desc: "AMAN Dalam Persaudaraan Penuh Kekeluargaan" },
  { letter: "N", title: "Netral", desc: "NETRAL Dalam Mengemban Tugas Dan Amanah" },
  { letter: "T", title: "Tidak Membedakan", desc: "TIDAK Membedakan Dalam Bekerjasama Demi Kemajuan" },
  { letter: "I", title: "Ingin Membangun", desc: "INGIN Dalam Membangun Solidaritas Dan Adat Budaya" },
  { letter: "D", title: "Dalam Aspirasi", desc: "DALAM Menyampaikan Aspirasi Masyarakat" },
  { letter: "U", title: "Unggul SDM", desc: "UNGGUL Dengan Mengutamakan Kualitas SDM" },
  { letter: "N", title: "Nekat & Tanggungjawab", desc: "NEKAT Serta Bertanggungjawab Atas Hak Dan Kewajiban" },
  { letter: "G", title: "Guna Masyarakat", desc: "GUNA Kepentingan Luas Seluruh Masyarakat" },
];

/**
 * Data Keuangan APBDes 2023 - 2025 (Tabel I.III)
 */
const APBDES_DATA = [
  { tahun: "2023", dd: 820727000, add: 3611413982 },
  { tahun: "2024", dd: 828411250, add: 2807628779 },
  { tahun: "2025", dd: 1066658000, add: 3004672435 },
];

/**
 * Client Component Tampilan Profil Desa Buong Baru dengan GSAP & Framer Motion
 */
export default function ProfilDetailView() {
  const [activeTab, setActiveTab] = useState<TabId>("sejarah");
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animasi Hero Reveal GSAP
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }
        );
      }

      // 2. Animasi Cards GSAP Stagger Reveal
      const cards = gsap.utils.toArray<HTMLElement>(".gsap-reveal-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* ── Header Banner Profil dengan GSAP Reveal ── */}
      <div 
        ref={heroRef}
        className="relative bg-[#faf9f5] border border-[#e6dfd8] rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xs space-y-4"
      >
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <Landmark className="w-64 h-64 text-[#cc785c]" />
        </div>
        <div className="relative space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Gambaran Umum Kondisi &amp; Sejarah Desa</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sumber Data: Publikasi Profil Desa Buong Baru Tahun 2025</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#141413] tracking-tight leading-tight">
            Profil Desa Buong Baru
          </h1>
          <p className="text-sm sm:text-base text-[#6c6a64] font-medium leading-relaxed">
            Menelusuri sejarah peradaban rumpun Tidung Bulungan, rekam jejak kepemimpinan, batas wilayah geografis, hingga potensi ekonomi dan pengelolaan anggaran APBDes Desa Buong Baru.
          </p>
        </div>
      </div>

      {/* ── Tab Switcher Navigasi Interaktif ── */}
      <div className="flex overflow-x-auto p-1.5 rounded-2xl bg-[#efe9de] border border-[#e6dfd8] gap-2">
        {[
          { id: "sejarah", label: "Sejarah & Asal-Usul", icon: History },
          { id: "pemimpin", label: "Sejarah Kepemimpinan", icon: Crown },
          { id: "geografis", label: "Kondisi Geografis", icon: MapPin },
          { id: "ekonomi", label: "Keuangan & APBDes", icon: Coins },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? "bg-[#cc785c] text-white shadow-md scale-[1.02]"
                  : "text-[#3d3d3a] hover:bg-[#e8e0d2] hover:text-[#141413]"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Area Konten Tab Active dengan Framer Motion ── */}
      <div className="bg-white border border-[#e6dfd8] rounded-3xl p-6 sm:p-8 shadow-xs min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* ────── TAB 1: SEJARAH & ASAL-USUL DESA ────── */}
          {activeTab === "sejarah" && (
            <motion.div
              key="tab-sejarah"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#e6dfd8] pb-3">
                  <History className="w-5 h-5 text-[#cc785c]" />
                  <h2 className="text-xl font-bold text-[#141413]">
                    Sejarah Singkat &amp; Peradaban Desa Buong Baru
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Teks Narasi Sejarah (2 Kolom) */}
                  <div className="lg:col-span-2 space-y-4 text-xs sm:text-sm text-[#3d3d3a] leading-relaxed">
                    <p className="bg-[#faf9f5] p-5 rounded-2xl border border-[#e6dfd8] font-medium text-[#141413]">
                      Secara historis, masyarakat Desa Buong Baru yang konon lebih dikenal dengan <strong>Kampung Betayau</strong> berasal dari satu rumpun garis keturunan yang awal hidup berpindah-pindah (nomaden) sampai mendiami wilayah Sungai Betayau. Seiring perkembangan administrasi pemerintahan, kampung ini secara definitif dinamakan <strong>Desa Buong Baru</strong>.
                    </p>
                    <p>
                      Orang Betayau Desa Buong Baru merupakan bagian dari masyarakat Dayak / Pedalaman dari suku <strong>Tidung Bulungan</strong> yang terhimpun dalam satu rumpun garis keturunan dengan pola etnik, budaya, dan karakter yang sama.
                    </p>
                    <p>
                      Konon komunitas masyarakat Tidung Bulungan berada dalam wilayah kekuasaan yang diistilahkan sebagai <em>daerah penegakan</em> (wilayah mata pencaharian hidup sehari-hari), yang pada awalnya dikuasai oleh <strong>Yaki ABULAHAB</strong> (Pangeran Temenggung Kesultanan Bulungan). Pada tahun 1900, beliau tinggal bersama keluarga di Kampung Buwong sekitar Sungai Betayau, yang kemudian berpindah ke daerah hulu Sungai Betayau sebagai cikal bakal wilayah Desa Buong Baru hingga hari ini.
                    </p>
                    <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 text-emerald-900 shadow-2xs">
                      <span className="text-xs font-extrabold block uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Pencatatan Administrasi Resmi (1950)
                      </span>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed">
                        Catatan sejarah desa mencatat bahwa secara efektif Kampung Betayau resmi menjadi <strong>Desa Buong Baru pada tahun 1950</strong> di bawah pimpinan Pangeran Temenggung Yaki ABULAHAB sebagai pemimpin administrasi pertama.
                      </p>
                    </div>
                  </div>

                  {/* Highlight Motto IMAN TIDUNG (1 Kolom) */}
                  <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#e6dfd8] pb-3">
                      <Award className="w-5 h-5 text-[#cc785c]" />
                      <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
                        Motto Desa: IMAN TIDUNG
                      </h3>
                    </div>
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                      {MOTTO_IMAN_TIDUNG.map((m, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-xl border border-[#e6dfd8] flex items-start gap-2.5 hover:border-[#cc785c] transition-colors">
                          <span className="w-6 h-6 rounded-lg bg-[#cc785c] text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                            {m.letter}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#141413]">{m.title}</p>
                            <p className="text-[11px] text-[#6c6a64] font-medium leading-tight">{m.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────── TAB 2: SEJARAH KEPEMIMPINAN (TABEL I.I) ────── */}
          {activeTab === "pemimpin" && (
            <motion.div
              key="tab-pemimpin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6dfd8] pb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-[#141413]">
                    Tabel I.I: Silsilah Nama-Nama Kepala Desa (15 Periode)
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#6c6a64] bg-[#efe9de] px-3 py-1 rounded-full self-start sm:self-auto">
                  Tahun 1900 s.d. Sekarang
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#e6dfd8]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#e6dfd8] text-[#6c6a64] font-bold bg-[#efe9de]">
                      <th className="py-3.5 px-4 text-center w-12">No</th>
                      <th className="py-3.5 px-4 w-40">Periode Tahun</th>
                      <th className="py-3.5 px-4">Nama Kepala Desa / Pemimpin</th>
                      <th className="py-3.5 px-4">Keterangan / Sebutan Jabatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SEJARAH_PEMIMPIN.map((row) => {
                      const isCurrent = row.nama === "ISHAK" && row.periode.includes("Sekarang");
                      return (
                        <tr
                          key={row.no}
                          className={`border-b border-[#f0eae4] last:border-b-0 hover:bg-[#efe9de]/50 transition-colors ${
                            isCurrent ? "bg-amber-50/80 font-bold" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center font-bold text-[#6c6a64]">{row.no}</td>
                          <td className="py-3.5 px-4 font-extrabold text-[#cc785c]">{row.periode}</td>
                          <td className="py-3.5 px-4 font-bold text-[#141413] flex items-center gap-2">
                            {row.nama}
                            {isCurrent && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
                                Aktif Menjabat
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-[#6c6a64]">{row.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ────── TAB 3: KONDISI GEOGRAFIS DESA (TABEL I.II) ────── */}
          {activeTab === "geografis" && (
            <motion.div
              key="tab-geografis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6dfd8] pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-xl font-bold text-[#141413]">
                    Tabel I.II: Kondisi Geografis &amp; Tata Guna Lahan Desa Buong Baru
                  </h2>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-auto">
                  Luas ±29.002,79 Ha (290,03 Km²)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kartu 1: Wilayah & Batas Admin */}
                <div className="p-6 border border-[#e6dfd8] rounded-2xl bg-[#faf9f5] space-y-4 shadow-2xs">
                  <h3 className="text-xs sm:text-sm font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#cc785c]" />
                    Batas Wilayah Administratif
                  </h3>
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#e6dfd8]">
                      <span className="font-semibold text-[#6c6a64]">Sebelah Utara:</span>
                      <span className="font-bold text-[#141413]">Desa Seludau &amp; Sepala Dalung</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#e6dfd8]">
                      <span className="font-semibold text-[#6c6a64]">Sebelah Selatan:</span>
                      <span className="font-bold text-[#141413]">Kab. Bulungan (Desa Turung &amp; Sekatak Buji)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#e6dfd8]">
                      <span className="font-semibold text-[#6c6a64]">Sebelah Barat:</span>
                      <span className="font-bold text-[#141413]">Desa Bebakung, Maning &amp; Kujau</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#e6dfd8]">
                      <span className="font-semibold text-[#6c6a64]">Sebelah Timur:</span>
                      <span className="font-bold text-[#141413]">Desa Bebatu &amp; Bandan Bikis</span>
                    </div>
                  </div>
                </div>

                {/* Kartu 2: Pembagian Wilayah RT */}
                <div className="p-6 border border-[#e6dfd8] rounded-2xl bg-[#faf9f5] space-y-4 shadow-2xs">
                  <h3 className="text-xs sm:text-sm font-bold text-[#141413] uppercase tracking-wider border-b border-[#e6dfd8] pb-2 flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-blue-700" />
                    Pembagian Rukun Tetangga (5 RT)
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    {["RT.001", "RT.002", "RT.003", "RT.004", "RT.005"].map((rt) => (
                      <div key={rt} className="p-3 bg-white rounded-xl border border-[#e6dfd8] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-[#141413]">{rt}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#6c6a64] font-medium pt-2">
                    Lahan Pemukiman Penduduk: <strong>±100 Hektar</strong>
                  </p>
                </div>
              </div>

              {/* Grid 2: Lahan Pertanian & Infrastruktur Jalan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lahan Pertanian */}
                <div className="p-6 border border-[#e6dfd8] rounded-2xl bg-white space-y-3 shadow-2xs">
                  <h3 className="text-xs sm:text-sm font-bold text-[#141413] uppercase tracking-wider border-b border-[#f0eae4] pb-2 flex items-center gap-1.5">
                    <TreePine className="w-4 h-4 text-emerald-700" />
                    Penggunaan Lahan Pertanian &amp; Perkebunan
                  </h3>
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between py-1 border-b border-dashed border-[#f0eae4]">
                      <span className="text-[#6c6a64]">Lahan Sawah:</span>
                      <span className="font-bold text-[#141413]">1,42 Ha</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed border-[#f0eae4]">
                      <span className="text-[#6c6a64]">Lahan Ladang:</span>
                      <span className="font-bold text-[#141413]">3,06 Ha</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed border-[#f0eae4]">
                      <span className="text-[#6c6a64]">Lahan Perkebunan (Sawit/Dll):</span>
                      <span className="font-bold text-[#cc785c]">5.888,13 Ha</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#6c6a64]">Sungai &amp; Perairan:</span>
                      <span className="font-bold text-[#141413]">6,92 Ha</span>
                    </div>
                  </div>
                </div>

                {/* Panjang Jalan */}
                <div className="p-6 border border-[#e6dfd8] rounded-2xl bg-white space-y-3 shadow-2xs">
                  <h3 className="text-xs sm:text-sm font-bold text-[#141413] uppercase tracking-wider border-b border-[#f0eae4] pb-2 flex items-center gap-1.5">
                    <Road className="w-4 h-4 text-purple-700" />
                    Panjang Jalan Akses Desa
                  </h3>
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between py-1 border-b border-dashed border-[#f0eae4]">
                      <span className="text-[#6c6a64]">Panjang Jalan Desa:</span>
                      <span className="font-bold text-[#141413]">11.700,66 Meter</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed border-[#f0eae4]">
                      <span className="text-[#6c6a64]">Panjang Jalan Kabupaten:</span>
                      <span className="font-bold text-[#141413]">8.037,05 Meter</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#6c6a64]">Panjang Jalan Nasional:</span>
                      <span className="font-bold text-[#141413]">1.849,65 Meter</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────── TAB 4: KEUANGAN & APBDES 2023-2025 (TABEL I.III) ────── */}
          {activeTab === "ekonomi" && (
            <motion.div
              key="tab-ekonomi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6dfd8] pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-xl font-bold text-[#141413]">
                    Tabel I.III: Sumber Penerimaan Keuangan Desa (2023 - 2025)
                  </h2>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-auto">
                  Transfer DD &amp; ADD
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#e6dfd8]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#e6dfd8] text-[#6c6a64] font-bold bg-[#efe9de]">
                      <th className="py-3.5 px-4 w-12 text-center">No</th>
                      <th className="py-3.5 px-4">Sumber Penerimaan Desa</th>
                      <th className="py-3.5 px-4 text-right">Tahun 2023 (Rp)</th>
                      <th className="py-3.5 px-4 text-right">Tahun 2024 (Rp)</th>
                      <th className="py-3.5 px-4 text-right">Tahun 2025 (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#f0eae4] hover:bg-[#efe9de]/50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-[#6c6a64]">1</td>
                      <td className="py-3.5 px-4 font-bold text-[#141413]">Dana Desa (DD - APBN)</td>
                      <td className="py-3.5 px-4 text-right font-semibold">Rp 820.727.000</td>
                      <td className="py-3.5 px-4 text-right font-semibold">Rp 828.411.250</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-[#cc785c]">Rp 1.066.658.000</td>
                    </tr>
                    <tr className="border-b border-[#f0eae4] hover:bg-[#efe9de]/50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-[#6c6a64]">2</td>
                      <td className="py-3.5 px-4 font-bold text-[#141413]">Alokasi Dana Desa (ADD - APBD Tana Tidung)</td>
                      <td className="py-3.5 px-4 text-right font-semibold">Rp 3.611.413.982</td>
                      <td className="py-3.5 px-4 text-right font-semibold">Rp 2.807.628.779</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-800">Rp 3.004.672.435</td>
                    </tr>
                    <tr className="border-t-2 border-[#e6dfd8] bg-[#efe9de] font-extrabold">
                      <td className="py-3.5 px-4 text-center" colSpan={2}>TOTAL APBDES PER TAHUN</td>
                      <td className="py-3.5 px-4 text-right text-[#141413]">Rp 4.432.140.982</td>
                      <td className="py-3.5 px-4 text-right text-[#141413]">Rp 3.636.040.029</td>
                      <td className="py-3.5 px-4 text-right text-emerald-800">Rp 4.071.330.435</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Visual Card Perbandingan Penerimaan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {APBDES_DATA.map((item) => {
                  const total = item.dd + item.add;
                  return (
                    <div key={item.tahun} className="p-5 bg-[#faf9f5] border border-[#e6dfd8] rounded-2xl space-y-2 shadow-2xs hover:border-[#cc785c] transition-colors">
                      <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-1.5">
                        <span className="text-xs font-bold text-[#cc785c]">Tahun {item.tahun}</span>
                        <span className="text-[10px] font-bold text-[#6c6a64]">Total Anggaran</span>
                      </div>
                      <p className="text-xl font-extrabold text-[#141413]">
                        Rp {total.toLocaleString("id-ID")}
                      </p>
                      <div className="space-y-1 text-xs text-[#6c6a64] pt-1">
                        <div className="flex justify-between">
                          <span>DD APBN:</span>
                          <strong className="text-[#141413]">Rp {item.dd.toLocaleString("id-ID")}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>ADD Kab:</span>
                          <strong className="text-[#141413]">Rp {item.add.toLocaleString("id-ID")}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
