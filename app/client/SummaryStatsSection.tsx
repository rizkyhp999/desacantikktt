"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users, 
  Home, 
  MapPin, 
  Wheat, 
  Building2, 
  TrendingUp, 
  ArrowRight, 
  BarChart3,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Interface data kartu statistik ringkasan
 */
interface StatDetailItem {
  id: string;
  category: string;
  title: string;
  mainValue: string;
  unit: string;
  subDetail: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

/**
 * Daftar data indikator utama Desa Buong Baru 2026
 */
const summaryDataItems: StatDetailItem[] = [
  {
    id: "penduduk",
    category: "Kependudukan",
    title: "Jumlah Penduduk",
    mainValue: "1.842",
    unit: "Jiwa",
    subDetail: "940 Laki-laki • 902 Perempuan",
    badge: "+2.4% / tahun",
    icon: Users,
    accentColor: "text-[#cc785c] bg-[#cc785c]/10 border-[#cc785c]/20",
  },
  {
    id: "kk",
    category: "Demografi",
    title: "Kepala Keluarga",
    mainValue: "524",
    unit: "KK",
    subDetail: "Rata-rata 3,5 anggota / KK",
    badge: "100% Terdata",
    icon: Home,
    accentColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: "wilayah",
    category: "Geografis",
    title: "Luas Wilayah",
    mainValue: "45,2",
    unit: "km²",
    subDetail: "Terbagi dalam 5 RT & 2 RW",
    badge: "Batas Terpetakan",
    icon: MapPin,
    accentColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    id: "ekonomi",
    category: "Perekonomian",
    title: "Komoditas Khas",
    mainValue: "Sawit & Tani",
    unit: "",
    subDetail: "Sektor Perkebunan Utilitas Utama",
    badge: "Potensi Desa",
    icon: Wheat,
    accentColor: "text-[#cc785c] bg-[#efe9de] border-[#e6dfd8]",
  },
  {
    id: "fasilitas",
    category: "Infrastruktur",
    title: "Fasilitas Umum",
    mainValue: "12",
    unit: "Unit",
    subDetail: "6 Pendidikan • 4 Kesehatan • 2 Ibadah",
    badge: "Aktif Melayani",
    icon: Building2,
    accentColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
  },
  {
    id: "partisipasi",
    category: "Kualitas Data",
    title: "Partisipasi Data",
    mainValue: "98,5%",
    unit: "",
    subDetail: "Sensitivitas & Akurasi Terverifikasi",
    badge: "Sangat Baik",
    icon: TrendingUp,
    accentColor: "text-sky-700 bg-sky-50 border-sky-200",
  },
];

/**
 * Komponen Section Ringkasan Data Desa Buong Baru 2026
 * 
 * Mengikuti Spesifikasi Panduan Desain (design.md) & UI/UX Pro Max:
 * - Ditempatkan di bawah Hero Section
 * - Menyajikan Grid Kartu Indikator Data Utama Desa
 * - Dilengkapi Tombol Akses "Data Selengkapnya"
 * - Interaktif dengan animasi entrance & hover Framer Motion
 * 
 * @returns {JSX.Element} Section Ringkasan Data
 */
export default function SummaryStatsSection() {
  return (
    <section 
      id="statistik"
      aria-label="Section Ringkasan Data Desa Buong Baru"
      className="min-h-[calc(100dvh-64px)] flex flex-col justify-center py-8 sm:py-12 bg-white border-b border-[#e6dfd8] relative overflow-hidden"
    >
      {/* Subtle Background Dot Pattern Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#e6dfd8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Statistik Utama Desa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
              Ringkasan Data & Indikator Desa 2026
            </h2>
            <p className="text-sm sm:text-base text-[#6c6a64] font-normal leading-relaxed">
              Gambaran kualitatif dan kuantitatif indikator desa yang diperbarui berkala untuk mewujudkan tata kelola desa berbasis data presisi.
            </p>
          </div>

          {/* Tombol Data Selengkapnya (Desktop Position) */}
          <div className="hidden sm:block shrink-0">
            <Link href="/statistik">
              <Button
                size="lg"
                className="bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium shadow-xs h-11 px-5 rounded-lg text-sm flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Data Selengkapnya</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Grid Kartu Ringkasan Data (6 Items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {summaryDataItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -3 }}
                className="bg-[#efe9de]/60 hover:bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-5 transition-all shadow-2xs hover:shadow-xs hover:border-[#cc785c]/40 flex flex-col justify-between"
              >
                {/* Upper Card Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.accentColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2.5 rounded-lg border ${item.accentColor} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#6c6a64]">{item.title}</h3>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-bold text-[#141413] tracking-tight">
                          {item.mainValue}
                        </span>
                        {item.unit && (
                          <span className="text-xs font-medium text-[#6c6a64]">{item.unit}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Detail Info */}
                <div className="pt-3 border-t border-[#e6dfd8] flex items-center justify-between text-xs text-[#6c6a64]">
                  <div className="flex items-center gap-1.5 truncate">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.subDetail}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tombol Data Selengkapnya (Mobile Position) */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/statistik">
            <Button
              size="lg"
              className="w-full bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium shadow-xs h-12 px-5 rounded-lg text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Data Selengkapnya</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
