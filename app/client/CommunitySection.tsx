"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, User, GraduationCap, Star, ClipboardList, Database, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";

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
  photoUrl?: string;
}

interface Bidang {
  label: string;
  icon: React.ElementType;
  koordinator: MemberItem;
  anggota: MemberItem[];
}

// ─────────────────────────────────────────
// DATA LENGKAP
// ─────────────────────────────────────────

const PEMBINA_PIMPINAN: MemberItem[] = [
  { no: 1,  name: "Ishak",             kedudukan: "Pembina",                     jabatan: "Kepala Desa",     tier: "pembina",  photoUrl: "/foto/ishak.jpeg" },
  { no: 2,  name: "Sumiyati, SM",      kedudukan: "Ketua / Agen Statistik",      jabatan: "Sekretaris Desa", tier: "pimpinan", photoUrl: "/foto/sumiyati.png" },
  { no: 3,  name: "Mailin",            kedudukan: "Sekretaris / Agen Statistik", jabatan: "Kasi Pemerintahan", tier: "pimpinan", photoUrl: "/foto/mailin.png" },
  { no: 4,  name: "Riadi, SP",         kedudukan: "Bendahara",                   jabatan: "Kaur Keuangan",   tier: "pimpinan", photoUrl: "/foto/riadi.jpg" },
];

const BIDANG_LIST: Bidang[] = [
  {
    label:    "Pengumpul Data",
    icon:     ClipboardList,
    koordinator: { no: 5,  name: "Desi Oktaviani, S.Pd",      kedudukan: "Koordinator Pengumpul Data", jabatan: "Karang Taruna",   tier: "koordinator", photoUrl: "/foto/desi octaviani.jpeg" },
    anggota: [
      { no: 6,  name: "Husna H.M Lasindue, S.Kom", kedudukan: "Anggota Pengumpul Data", jabatan: "Kaur Perencanaan", tier: "anggota", photoUrl: "/foto/husna.png" },
      { no: 7,  name: "Dedy Iskandar",             kedudukan: "Anggota Pengumpul Data", jabatan: "Kasi Pelayanan",  tier: "anggota", photoUrl: "/foto/dedy iskandar.png" },
      { no: 8,  name: "Nursyadiah",                kedudukan: "Anggota Pengumpul Data", jabatan: "Staf TU & Umum",  tier: "anggota", photoUrl: "/foto/nursyadiah.jpeg" },
    ],
  },
  {
    label:    "Pengolahan Data",
    icon:     Database,
    koordinator: { no: 9,  name: "Ika Sunariyah, S.Pd",       kedudukan: "Koordinator Pengolahan Data", jabatan: "Kasi Kesejahteraan", tier: "koordinator", photoUrl: "/foto/ika.jpeg" },
    anggota: [
      { no: 10, name: "Patriansyah",   kedudukan: "Anggota Pengolahan Data", jabatan: "Staf Kesejahteraan", tier: "anggota", photoUrl: "/foto/patriansyah.png" },
      { no: 11, name: "Nurhalimah",    kedudukan: "Anggota Pengolahan Data", jabatan: "Staf Pelayanan",    tier: "anggota" },
      { no: 12, name: "Jamrun",        kedudukan: "Anggota Pengolahan Data", jabatan: "Ketua RT.004",       tier: "anggota" },
    ],
  },
  {
    label:    "Analisis & Diseminasi",
    icon:     BarChart3,
    koordinator: { no: 13, name: "Nurna Nengsih, S.Pd",         kedudukan: "Koordinator Analisis & Diseminasi", jabatan: "Kasi Pelayanan", tier: "koordinator", photoUrl: "/foto/nurna nengsih.png" },
    anggota: [
      { no: 14, name: "Gusti Noviandi Ramadhani", kedudukan: "Anggota Analisis & Diseminasi", jabatan: "Linmas Desa",  tier: "anggota" },
      { no: 15, name: "Sartika",                  kedudukan: "Anggota Analisis & Diseminasi", jabatan: "Ketua RT.001", tier: "anggota" },
      { no: 16, name: "Alimin",                   kedudukan: "Anggota Analisis & Diseminasi", jabatan: "Ketua RT.002", tier: "anggota" },
      { no: 17, name: "Santo Hariyadi",            kedudukan: "Anggota Analisis & Diseminasi", jabatan: "Ketua RT.005", tier: "anggota" },
    ],
  },
];

const MAHASISWA_LIST: { name: string; photoUrl?: string }[] = [
  { name: "Adhitya", photoUrl: "/foto/mahasiswa/aditya.jpeg" },
  { name: "Amin", photoUrl: "/foto/mahasiswa/amin.jpeg" },
  { name: "Chantika", photoUrl: "/foto/mahasiswa/chantika.jpeg" },
  { name: "Marlia", photoUrl: "/foto/mahasiswa/marlia.jpeg" },
  { name: "Nirmala", photoUrl: "/foto/mahasiswa/nirmala.jpeg" },
  { name: "Novan", photoUrl: "/foto/mahasiswa/novan.jpeg" },
  { name: "Rahmat Hidayat", photoUrl: "/foto/mahasiswa/rahmat hidayat.jpeg" },
  { name: "Tyas", photoUrl: "/foto/mahasiswa/tyas.jpeg" },
  { name: "Riska", photoUrl: "/foto/mahasiswa/riska.jpeg" },
  { name: "Ika" },
  { name: "Fitri" },
  { name: "Anni" },
  { name: "Muhammad" },
  { name: "Risa" },
];

const MAHASISWA_KKN: MemberItem[] = MAHASISWA_LIST.map((m, i) => ({
  no: 18 + i,
  name: m.name,
  kedudukan: "Mahasiswa KKN",
  jabatan: "Mahasiswa KKN",
  tier: "mahasiswa" as MemberTier,
  photoUrl: m.photoUrl,
}));

const SLIDES = [
  {
    id: 0,
    title: "Pembina & Pimpinan Inti",
    badge: "Struktur Utama",
    icon: Shield,
    count: PEMBINA_PIMPINAN.length,
  },
  {
    id: 1,
    title: "Bidang-Bidang Kerja",
    badge: "Tim Operasional",
    icon: ClipboardList,
    count: 12,
  },
  {
    id: 2,
    title: "Mahasiswa KKN",
    badge: "Mitra Akademik",
    icon: GraduationCap,
    count: MAHASISWA_KKN.length,
  },
];

// ─────────────────────────────────────────
// SUB-KOMPONEN: PhotoFrame
// ─────────────────────────────────────────

function PhotoFrame({
  no,
  name,
  photoUrl,
  size,
  IconFallback,
  iconSize = "w-6 h-6",
}: {
  no: number;
  name: string;
  photoUrl?: string;
  size: string;
  IconFallback: React.ElementType;
  iconSize?: string;
}) {
  const imgSrc = photoUrl || `/images/members/member-${no}.png`;
  return (
    <div
      className={`relative ${size} rounded-full overflow-hidden border-2 border-[#e6dfd8] bg-[#efe9de] flex items-center justify-center shrink-0 group-hover:border-[#cc785c] transition-colors`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
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
// SUB-KOMPONEN: PembinaCard
// ─────────────────────────────────────────

function PembinaCard({ member }: { member: MemberItem }) {
  const isHead = member.tier === "pembina";

  return (
    <div
      className={`
        bg-white border rounded-2xl p-5 flex flex-col items-center text-center gap-3
        hover:shadow-md transition-all duration-200 group cursor-default h-full
        ${isHead ? "border-[#cc785c]/40 bg-[#faf9f5]" : "border-[#e6dfd8]"}
      `}
    >
      <PhotoFrame
        no={member.no}
        name={member.name}
        photoUrl={member.photoUrl}
        size={isHead ? "w-24 h-24" : "w-20 h-20"}
        IconFallback={isHead ? Shield : Star}
        iconSize={isHead ? "w-9 h-9" : "w-7 h-7"}
      />

      <span className={`text-[9px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-0.5 ${isHead ? "bg-[#cc785c] text-white border-[#cc785c]" : "bg-[#efe9de] text-[#cc785c] border-[#e6dfd8]"}`}>
        {isHead ? "Pembina" : "Pimpinan Inti"}
      </span>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-[#141413] leading-snug">{member.name}</h4>
        <p className="text-[11px] text-[#6c6a64] leading-snug">{member.kedudukan}</p>
        <p className="text-[11px] text-[#cc785c] font-semibold">{member.jabatan}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SUB-KOMPONEN: BidangSection
// ─────────────────────────────────────────

function BidangSection({ bidang }: { bidang: Bidang }) {
  const BidangIcon = bidang.icon;

  return (
    <div className="bg-white border border-[#e6dfd8] rounded-2xl overflow-hidden shadow-2xs hover:shadow-sm transition-shadow">
      {/* Header Bidang */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e6dfd8] bg-[#efe9de] text-[#141413]">
        <BidangIcon className="w-4 h-4 text-[#cc785c] shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider">Bidang {bidang.label}</span>
        <span className="ml-auto text-[10px] font-bold text-[#6c6a64]">
          {1 + bidang.anggota.length} Personel
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Koordinator */}
        <div className="sm:w-56 shrink-0 flex flex-col items-center justify-center text-center p-5 border-b sm:border-b-0 sm:border-r border-[#e6dfd8] bg-[#faf9f5] gap-3 group">
          <PhotoFrame
            no={bidang.koordinator.no}
            name={bidang.koordinator.name}
            photoUrl={bidang.koordinator.photoUrl}
            size="w-20 h-20"
            IconFallback={User}
            iconSize="w-7 h-7"
          />
          <span className="text-[9px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-0.5 bg-[#f5f0e8] text-[#cc785c] border-[#e6dfd8]">
            Koordinator
          </span>
          <div>
            <h4 className="text-xs font-bold text-[#141413] leading-snug">{bidang.koordinator.name}</h4>
            <p className="text-[10px] text-[#6c6a64] mt-0.5 leading-snug">{bidang.koordinator.kedudukan}</p>
            <p className="text-[10px] text-[#cc785c] font-semibold mt-1">{bidang.koordinator.jabatan}</p>
          </div>
        </div>

        {/* Anggota */}
        <div className="flex-1 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] mb-3 px-1">Anggota Tim</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {bidang.anggota.map((m) => (
              <div
                key={m.no}
                className="bg-[#faf9f5] border border-[#e6dfd8] hover:border-[#cc785c]/40 rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-all hover:shadow-xs group cursor-default"
              >
                <PhotoFrame
                  no={m.no}
                  name={m.name}
                  photoUrl={m.photoUrl}
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
    </div>
  );
}

// ─────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────

export default function CommunitySection() {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section
      id="komunitas"
      aria-label="Section Komunitas Desa Cinta Statistik"
      className="relative overflow-hidden py-16 sm:py-20 bg-white border-b border-[#e6dfd8]"
    >
      {/* Background Motif Ukiran Batik Tidung Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-18 mix-blend-multiply bg-pattern-tidung" />
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d5cbc1_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Sinergi &amp; Kolaborasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
              Komunitas Desa Cinta Statistik (Descan)
            </h2>
            <p className="text-sm text-[#6c6a64] leading-relaxed max-w-2xl">
              Kader statistik desa yang bekerja bersama dalam pengumpulan, pengolahan, analisis, dan diseminasi data desa.
            </p>
          </div>

          {/* Tombol Navigasi Carousel */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handlePrev}
              aria-label="Slide Sebelumnya"
              className="p-2.5 rounded-full bg-white border border-[#e6dfd8] text-[#141413] hover:bg-[#efe9de] hover:border-[#cc785c]/40 transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-[#6c6a64] px-2">
              {activeSlide + 1} / {SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Slide Selanjutnya"
              className="p-2.5 rounded-full bg-white border border-[#e6dfd8] text-[#141413] hover:bg-[#efe9de] hover:border-[#cc785c]/40 transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls / Carousel Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SLIDES.map((slide) => {
            const SlideIcon = slide.icon;
            const isActive = activeSlide === slide.id;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(slide.id)}
                className={`
                  p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3
                  ${
                    isActive
                      ? "bg-[#cc785c] text-white border-[#a9583e] shadow-sm font-semibold"
                      : "bg-[#efe9de] text-[#141413] border-[#e6dfd8] hover:bg-[#e8e0d2]"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? "bg-white/20" : "bg-white/80 text-[#cc785c]"}`}>
                    <SlideIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-semibold ${isActive ? "opacity-90" : "text-[#6c6a64]"}`}>
                      {slide.badge}
                    </p>
                    <p className="text-sm font-bold">{slide.title}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-white text-[#cc785c] border border-[#e6dfd8]"}`}>
                  {slide.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Slide Content Area */}
        <div className="min-h-[380px] relative">
          <AnimatePresence mode="wait">
            {activeSlide === 0 && (
              <motion.div
                key="slide-pembina"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#efe9de] border border-[#e6dfd8] text-[#141413]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#cc785c]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Tampilan 1: Pembina &amp; Pimpinan Inti</span>
                  </div>
                  <span className="text-xs font-bold text-[#6c6a64]">{PEMBINA_PIMPINAN.length} Personel Utama</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PEMBINA_PIMPINAN.map((m) => (
                    <PembinaCard key={m.no} member={m} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeSlide === 1 && (
              <motion.div
                key="slide-bidang"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#efe9de] border border-[#e6dfd8] text-[#141413]">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-[#cc785c]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Tampilan 2: Bidang-Bidang Kerja</span>
                  </div>
                  <span className="text-xs font-bold text-[#6c6a64]">3 Bidang Kerja</span>
                </div>
                <div className="space-y-4">
                  {BIDANG_LIST.map((bidang) => (
                    <BidangSection key={bidang.label} bidang={bidang} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeSlide === 2 && (
              <motion.div
                key="slide-mahasiswa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#efe9de] border border-[#e6dfd8] text-[#141413]">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#cc785c]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Tampilan 3: Mahasiswa KKN</span>
                  </div>
                  <span className="text-xs font-bold text-[#6c6a64]">{MAHASISWA_KKN.length} Mahasiswa</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {MAHASISWA_KKN.map((m) => (
                    <div
                      key={m.no}
                      className="bg-white border border-[#e6dfd8] hover:border-[#cc785c]/40 rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-all hover:shadow-xs group cursor-default"
                    >
                      <PhotoFrame
                        no={m.no}
                        name={m.name}
                        photoUrl={m.photoUrl}
                        size="w-12 h-12"
                        IconFallback={GraduationCap}
                        iconSize="w-5 h-5"
                      />
                      <div>
                        <h4 className="text-[10px] font-bold text-[#141413] leading-snug">{m.name}</h4>
                        <p className="text-[9px] text-[#cc785c] font-semibold mt-0.5">{m.jabatan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
