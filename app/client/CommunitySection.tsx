"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Shield, User, GraduationCap, Star, ClipboardList, Database, BarChart3 } from "lucide-react";

// ─────────────────────────────────────────
// TIPE DATA
// ─────────────────────────────────────────

type MemberTier = "pembina" | "pimpinan" | "koordinator" | "anggota" | "mahasiswa";

interface MemberItem {
  no: number;
  name: string;
  kedudukan: string;
  jabatan: string;
  tier: MemberTier;
}

interface Bidang {
  label: string;
  color: string;
  headerBg: string;
  icon: React.ElementType;
  koordinator: MemberItem;
  anggota: MemberItem[];
}

// ─────────────────────────────────────────
// DATA LENGKAP
// ─────────────────────────────────────────

const PEMBINA_PIMPINAN: MemberItem[] = [
  { no: 1,  name: "Ishak",             kedudukan: "Pembina",                     jabatan: "Kepala Desa",     tier: "pembina"   },
  { no: 2,  name: "Sumiyati, SM",      kedudukan: "Ketua / Agen Statistik",      jabatan: "Sekretaris Desa", tier: "pimpinan"  },
  { no: 3,  name: "Mailin",            kedudukan: "Sekretaris / Agen Statistik", jabatan: "Kasi Pemerintahan", tier: "pimpinan" },
  { no: 4,  name: "Riadi, SP",         kedudukan: "Bendahara",                   jabatan: "Kaur Keuangan",   tier: "pimpinan"  },
];

const BIDANG_LIST: Bidang[] = [
  {
    label:    "Pengumpul Data",
    color:    "border-orange-200 text-orange-700",
    headerBg: "bg-orange-50 border-orange-200 text-orange-700",
    icon:     ClipboardList,
    koordinator: { no: 5,  name: "Desi Oktaviani, S.Pd",      kedudukan: "Koordinator Pengumpul Data", jabatan: "Karang Taruna",   tier: "koordinator" },
    anggota: [
      { no: 6,  name: "Husna H.M Lasindue, S.Kom", kedudukan: "Anggota Pengumpul Data", jabatan: "Kaur Perencanaan", tier: "anggota" },
      { no: 7,  name: "Dedy Iskandar",             kedudukan: "Anggota Pengumpul Data", jabatan: "Kasi Pelayanan",  tier: "anggota" },
      { no: 8,  name: "Nursyadiah",                kedudukan: "Anggota Pengumpul Data", jabatan: "Staf TU & Umum",  tier: "anggota" },
    ],
  },
  {
    label:    "Pengolahan Data",
    color:    "border-teal-200 text-teal-700",
    headerBg: "bg-teal-50 border-teal-200 text-teal-700",
    icon:     Database,
    koordinator: { no: 9,  name: "Ika Sunariyah, S.Pd",       kedudukan: "Koordinator Pengolahan Data", jabatan: "Kasi Kesejahteraan", tier: "koordinator" },
    anggota: [
      { no: 10, name: "Patriansyah",   kedudukan: "Anggota Pengolahan Data", jabatan: "Staf Kesejahteraan", tier: "anggota" },
      { no: 11, name: "Nurhalimah",    kedudukan: "Anggota Pengolahan Data", jabatan: "Staf Pelayanan",    tier: "anggota" },
      { no: 12, name: "Jamrun",        kedudukan: "Anggota Pengolahan Data", jabatan: "Ketua RT.004",       tier: "anggota" },
    ],
  },
  {
    label:    "Analisis & Diseminasi",
    color:    "border-violet-200 text-violet-700",
    headerBg: "bg-violet-50 border-violet-200 text-violet-700",
    icon:     BarChart3,
    koordinator: { no: 13, name: "Nurna Nengsih, S.Pd",         kedudukan: "Koordinator Analisis & Diseminasi", jabatan: "Kasi Pelayanan", tier: "koordinator" },
    anggota: [
      { no: 14, name: "Gusti Noviandi Ramadhani", kedudukan: "Anggota Analisis & Diseminasi", jabatan: "Linmas Desa",  tier: "anggota" },
      { no: 15, name: "Sartika",                  kedudukan: "Anggota Analisis & Diseminasi", jabatan: "Ketua RT.001", tier: "anggota" },
      { no: 16, name: "Alimin",                   kedudukan: "Anggota Analisis & Diseminasi", jabatan: "Ketua RT.002", tier: "anggota" },
      { no: 17, name: "Santo Hariyadi",            kedudukan: "Anggota Analisis & Diseminasi", jabatan: "Ketua RT.005", tier: "anggota" },
    ],
  },
];

const MAHASISWA_KKN: MemberItem[] = Array.from({ length: 13 }, (_, i) => ({
  no: 18 + i,
  name: `Mahasiswa KKN ${i + 1}`,
  kedudukan: "Mahasiswa KKN",
  jabatan: "Universitas",
  tier: "mahasiswa" as MemberTier,
}));

// ─────────────────────────────────────────
// SUB-KOMPONEN: PhotoFrame
// ─────────────────────────────────────────

/**
 * Frame foto bulat dengan fallback icon.
 *
 * @param no    - Nomor anggota untuk path gambar
 * @param name  - Nama untuk alt text
 * @param size  - Class Tailwind ukuran (w-* h-*)
 * @param icon  - Komponen icon fallback dari lucide-react
 */
function PhotoFrame({
  no,
  name,
  size,
  IconFallback,
  iconSize = "w-6 h-6",
}: {
  no: number;
  name: string;
  size: string;
  IconFallback: React.ElementType;
  iconSize?: string;
}) {
  return (
    <div
      className={`relative ${size} rounded-full overflow-hidden border-2 border-[#e6dfd8] bg-[#efe9de] flex items-center justify-center shrink-0 group-hover:border-[#cc785c]/50 transition-colors`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/members/member-${no}.png`}
        alt={name}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
        className="w-full h-full object-cover absolute inset-0 z-10"
      />
      <IconFallback className={`${iconSize} text-[#6c6a64] z-0`} />
    </div>
  );
}

// ─────────────────────────────────────────
// SUB-KOMPONEN: PembinaCard (ukuran paling besar)
// ─────────────────────────────────────────

function PembinaCard({ member }: { member: MemberItem }) {
  const isHead = member.tier === "pembina";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`
        bg-white border rounded-2xl p-5 flex flex-col items-center text-center gap-3
        hover:shadow-md transition-all duration-200 group cursor-default
        ${isHead ? "border-amber-200 shadow-sm" : "border-[#e6dfd8]"}
      `}
    >
      <PhotoFrame
        no={member.no}
        name={member.name}
        size={isHead ? "w-24 h-24" : "w-20 h-20"}
        IconFallback={isHead ? Shield : Star}
        iconSize={isHead ? "w-9 h-9" : "w-7 h-7"}
      />

      <span className={`text-[9px] font-bold uppercase tracking-wider border rounded-full px-2 py-0.5 ${isHead ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-[#efe9de] text-[#cc785c] border-[#e6dfd8]"}`}>
        {isHead ? "Pembina" : "Pimpinan Inti"}
      </span>

      <div>
        <h4 className="text-sm font-bold text-[#141413] leading-snug">{member.name}</h4>
        <p className="text-[10px] text-[#6c6a64] mt-0.5 leading-snug">{member.kedudukan}</p>
        <p className="text-[10px] text-[#cc785c] font-semibold mt-1">{member.jabatan}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// SUB-KOMPONEN: BidangSection
// Kiri: Koordinator — Kanan: Grid Anggota
// ─────────────────────────────────────────

/**
 * Layout satu bidang: koordinator di kiri, anggota di kanan.
 *
 * @param bidang - Data bidang (koordinator + anggota)
 * @param delay  - Delay animasi
 */
function BidangSection({ bidang, delay = 0 }: { bidang: Bidang; delay?: number }) {
  const BidangIcon = bidang.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="bg-white border border-[#e6dfd8] rounded-2xl overflow-hidden shadow-2xs hover:shadow-sm transition-shadow"
    >
      {/* Header Bidang */}
      <div className={`flex items-center gap-2 px-5 py-3 border-b ${bidang.headerBg}`}>
        <BidangIcon className="w-4 h-4 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider">Bidang {bidang.label}</span>
        <span className="ml-auto text-[10px] font-bold opacity-60">
          {1 + bidang.anggota.length} Personel
        </span>
      </div>

      {/* Body: Koordinator (kiri) + Anggota (kanan) */}
      <div className="flex flex-col sm:flex-row gap-0">
        {/* ── Kiri: Koordinator ── */}
        <div className="sm:w-52 shrink-0 flex flex-col items-center justify-center text-center p-5 border-b sm:border-b-0 sm:border-r border-[#e6dfd8] bg-[#faf9f5] gap-3 group">
          <PhotoFrame
            no={bidang.koordinator.no}
            name={bidang.koordinator.name}
            size="w-20 h-20"
            IconFallback={User}
            iconSize="w-7 h-7"
          />
          <span className={`text-[9px] font-bold uppercase tracking-wider border rounded-full px-2 py-0.5 ${bidang.headerBg}`}>
            Koordinator
          </span>
          <div>
            <h4 className="text-xs font-bold text-[#141413] leading-snug">{bidang.koordinator.name}</h4>
            <p className="text-[10px] text-[#6c6a64] mt-0.5 leading-snug">{bidang.koordinator.kedudukan}</p>
            <p className="text-[10px] text-[#cc785c] font-semibold mt-1">{bidang.koordinator.jabatan}</p>
          </div>
        </div>

        {/* ── Kanan: Grid Anggota ── */}
        <div className="flex-1 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] mb-3 px-1">Anggota</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {bidang.anggota.map((m) => (
              <div
                key={m.no}
                className="bg-[#faf9f5] border border-[#e6dfd8] hover:border-[#cc785c]/40 rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-all hover:shadow-xs group cursor-default"
              >
                <PhotoFrame
                  no={m.no}
                  name={m.name}
                  size="w-12 h-12"
                  IconFallback={User}
                  iconSize="w-5 h-5"
                />
                <div>
                  <h4 className="text-[10px] font-bold text-[#141413] leading-snug line-clamp-2">{m.name}</h4>
                  <p className="text-[9px] text-[#cc785c] font-semibold mt-0.5">{m.jabatan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────

/**
 * Section Anggota Komunitas Desa Cinta Statistik (Descan) Buong Baru
 *
 * Tata Letak:
 * 1. Pembina & Pimpinan Inti — grid kartu besar
 * 2. Bidang Pengumpul Data, Pengolahan, Analisis & Diseminasi
 *    → tiap bidang: Koordinator (kiri besar) + Anggota (kanan grid)
 * 3. Mahasiswa KKN — grid kartu standar
 */
export default function CommunitySection() {
  return (
    <section
      id="komunitas"
      aria-label="Section Komunitas Desa Cinta Statistik"
      className="relative overflow-hidden py-16 sm:py-20 bg-[#faf9f5] border-b border-[#e6dfd8]"
    >
      {/* Dot background */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#e6dfd8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Sinergi &amp; Kolaborasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
            Komunitas Desa Cinta Statistik (Descan)
          </h2>
          <p className="text-sm sm:text-base text-[#6c6a64] leading-relaxed max-w-2xl">
            Kader statistik desa yang bekerja bersama dalam pengumpulan, pengolahan, analisis, dan diseminasi data untuk mewujudkan desa yang mandiri dan berbasis data.
          </p>
        </motion.div>

        {/* ── 1. Pembina & Pimpinan Inti ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
            <Shield className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Pembina &amp; Pimpinan Inti</span>
            <span className="ml-auto text-[10px] font-bold opacity-60">{PEMBINA_PIMPINAN.length} Personel</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PEMBINA_PIMPINAN.map((m, i) => (
              <motion.div
                key={m.no}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07, ease: "easeOut" }}
              >
                <PembinaCard member={m} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 2. Bidang-bidang (Koordinator kiri + Anggota kanan) ── */}
        <div className="space-y-5">
          {BIDANG_LIST.map((bidang, i) => (
            <BidangSection key={bidang.label} bidang={bidang} delay={i * 0.08} />
          ))}
        </div>

        {/* ── 3. Mahasiswa KKN ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Mahasiswa KKN</span>
            <span className="ml-auto text-[10px] font-bold opacity-60">{MAHASISWA_KKN.length} Mahasiswa</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {MAHASISWA_KKN.map((m, i) => (
              <motion.div
                key={m.no}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
                className="bg-white border border-blue-100 hover:border-blue-300 rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-all hover:shadow-xs group cursor-default"
              >
                <PhotoFrame
                  no={m.no}
                  name={m.name}
                  size="w-12 h-12"
                  IconFallback={GraduationCap}
                  iconSize="w-5 h-5"
                />
                <div>
                  <h4 className="text-[10px] font-bold text-[#141413] leading-snug">{m.name}</h4>
                  <p className="text-[9px] text-blue-500 font-semibold mt-0.5">{m.jabatan}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
