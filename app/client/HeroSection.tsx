"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users, 
  Home as HomeIcon, 
  MapPin, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  FileSpreadsheet,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Interface data statistik ringkas untuk Hero Section
 */
interface StatCardItem {
  id: string;
  label: string;
  value: string;
  unit?: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

/**
 * Data ringkasan statistik Desa Buong Baru Tahun 2026
 */
const summaryStats: StatCardItem[] = [
  {
    id: "penduduk",
    label: "Total Penduduk",
    value: "1.842",
    unit: "Jiwa",
    change: "+2.4% thn ini",
    icon: Users,
    color: "text-[#cc785c] bg-[#cc785c]/10 border-[#cc785c]/20",
  },
  {
    id: "kk",
    label: "Kepala Keluarga",
    value: "524",
    unit: "KK",
    change: "100% Terdata",
    icon: HomeIcon,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: "luas",
    label: "Luas Wilayah",
    value: "45,2",
    unit: "km²",
    change: "5 RT / 2 RW",
    icon: MapPin,
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    id: "partisipasi",
    label: "Partisipasi Data",
    value: "98,5%",
    unit: "",
    change: "Sangat Tinggi",
    icon: TrendingUp,
    color: "text-sky-700 bg-sky-50 border-sky-200",
  },
];

/**
 * Komponen HeroSection Desa Cantik Buong Baru 2026
 * 
 * Mengikuti Aturan Kode AGENTS.md & UI/UX Pro Max:
 * - Ditempatkan di app/client/HeroSection.tsx sebagai Client Component
 * - Sisi Kiri: Judul "Desa Cantik Buong Baru 2026", narasi penjelasan, & tombol aksi
 * - Sisi Kanan: Ringkasan data statistik interaktif (Stat Cards)
 * - Tema Warm Canvas (#faf9f5) dengan aksen coral (#cc785c) & dark ink (#141413)
 * - Animasi responsif berbasis Framer Motion
 * 
 * @returns {JSX.Element} Hero Section Antarmuka
 */
export default function HeroSection() {
  return (
    <section 
      id="beranda"
      aria-label="Hero Utama Desa Cantik Buong Baru 2026"
      className="relative overflow-hidden min-h-[calc(100dvh-64px)] flex flex-col justify-center py-8 sm:py-12 bg-[#faf9f5] border-b border-[#e6dfd8]"
    >
      {/* Subtle Background Pattern Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#e6dfd8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* SISI KIRI: Informasi Utama Desa Cantik Buong Baru 2026 */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="lg:col-span-7 space-y-5"
          >
            {/* Badge Kategori */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Desa Cinta Statistik (Descan) • Tahun 2026</span>
            </div>

            {/* Judul Utama */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141413] leading-[1.15]">
              Desa Cantik <span className="text-[#cc785c]">Buong Baru</span> 2026
            </h1>

            {/* Penjelasan Ringkas */}
            <p className="text-base sm:text-lg text-[#3d3d3a] leading-relaxed font-normal">
              Portal data dan statistik terpadu Desa Buong Baru. Menyajikan data kependudukan, potensi desa, sosial ekonomi, dan infrastruktur secara akurat, transparan, serta dapat diakses secara akuntabel oleh seluruh masyarakat.
            </p>

            {/* Poin Keunggulan Data */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#141413]">
                <CheckCircle2 className="w-4 h-4 text-[#cc785c] shrink-0" />
                <span>Terintegrasi Standar Statistik BPS</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#141413]">
                <CheckCircle2 className="w-4 h-4 text-[#cc785c] shrink-0" />
                <span>Pembaruan Data Berkala 2026</span>
              </div>
            </div>

            {/* Tombol Aksi Utama */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/statistik">
                <Button 
                  size="lg"
                  className="bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium shadow-sm h-11 px-5 rounded-lg text-sm sm:text-base flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Jelajahi Data Statistik</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/publikasi">
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-[#faf9f5] hover:bg-[#efe9de] border-[#e6dfd8] text-[#141413] font-medium h-11 px-5 rounded-lg text-sm sm:text-base flex items-center gap-2 transition-colors active:scale-[0.98] cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#6c6a64]" />
                  <span>Unduh Publikasi Data</span>
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* SISI KANAN: Foto Bentuk Blob Organic Dengan Ornamen Garis Outline Offset */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center items-center relative py-4"
          >
            {/* Soft Ambient Glow Background */}
            <div 
              className="absolute w-full max-w-[380px] aspect-square bg-gradient-to-tr from-[#cc785c]/25 via-[#efe9de] to-emerald-200/25 opacity-70 blur-xl pointer-events-none"
              style={{ borderRadius: "46% 54% 65% 35% / 45% 35% 65% 55%" }}
            />

            {/* Blob Wrapper Container */}
            <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
              
              {/* Ornamen Garis Stroke Outline 1 (Offset Kiri-Atas seperti pada Gambar) */}
              <div 
                className="absolute -inset-2.5 sm:-inset-3.5 border-2 border-[#cc785c]/70 pointer-events-none transition-transform duration-500 scale-[1.03] -translate-x-2 -translate-y-2 z-0"
                style={{ borderRadius: "46% 54% 65% 35% / 45% 35% 65% 55%" }}
              />

              {/* Ornamen Garis Stroke Outline 2 (Sekunder Tipis) */}
              <div 
                className="absolute -inset-1.5 sm:-inset-2 border border-[#141413]/25 pointer-events-none transition-transform duration-500 scale-[1.01] -translate-x-1 -translate-y-1 z-0"
                style={{ borderRadius: "48% 52% 62% 38% / 43% 37% 63% 57%" }}
              />

              {/* Blob Utama Pembungkus Foto */}
              <div 
                className="relative z-10 w-full h-full overflow-hidden shadow-lg border-2 border-[#e6dfd8] transition-all duration-500 hover:scale-[1.02] bg-[#efe9de]"
                style={{ borderRadius: "46% 54% 65% 35% / 45% 35% 65% 55%" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/desa-buong-baru.png"
                  alt="Suasana Desa Buong Baru 2026"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
