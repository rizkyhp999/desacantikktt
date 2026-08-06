"use client";

import React, { useState, useEffect } from "react";
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
  Anchor,
  HeartHandshake
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
 * Komponen Section Ringkasan Data Desa Buong Baru 2026
 * Terkoneksi secara dinamis dengan API /api/data/statistik (Database Real)
 */
export default function SummaryStatsSection() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/data/statistik");
        const json = await res.json();
        if (json.success && json.stats) {
          setStats(json.stats);
        }
      } catch (err) {
        console.error("Gagal mengambil ringkasan statistik:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const totalPenduduk = stats?.totalPenduduk || 579;
  const totalKeluarga = stats?.totalKeluarga || 188;
  const pria = stats?.pria || 312;
  const wanita = stats?.wanita || 267;
  const usiaProduktif = stats?.usiaProduktif || 69.4;
  const totalUsahaIkan = stats?.totalUsahaIkan1001 || 12;
  const totalVolIkan = stats?.totalVolume1008a || 8962;
  const totalBansos = stats?.totalPenerimaBansosDesa || 101;

  const summaryDataItems: StatDetailItem[] = [
    {
      id: "penduduk",
      category: "Kependudukan",
      title: "Jumlah Penduduk",
      mainValue: loading ? "..." : totalPenduduk.toLocaleString("id-ID"),
      unit: "Jiwa",
      subDetail: `${pria} Laki-laki • ${wanita} Perempuan`,
      badge: "Real-time DB",
      icon: Users,
      accentColor: "text-[#cc785c] bg-[#cc785c]/10 border-[#cc785c]/20",
    },
    {
      id: "kk",
      category: "Demografi",
      title: "Kepala Keluarga",
      mainValue: loading ? "..." : totalKeluarga.toLocaleString("id-ID"),
      unit: "KK",
      subDetail: `Rata-rata ${(totalPenduduk / totalKeluarga).toFixed(1)} anggota / KK`,
      badge: "100% Terdata",
      icon: Home,
      accentColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "perikanan",
      category: "Sektor Perikanan",
      title: "Usaha Tangkap Perikanan",
      mainValue: loading ? "..." : totalUsahaIkan.toLocaleString("id-ID"),
      unit: "KK",
      subDetail: `Produksi ${totalVolIkan.toLocaleString("id-ID")} Kg / Tahun`,
      badge: "Usaha Aktif",
      icon: Anchor,
      accentColor: "text-[#cc785c] bg-[#efe9de] border-[#e6dfd8]",
    },
    {
      id: "bansos",
      category: "Perlindungan Sosial",
      title: "Penerima Bansos / Subsidi",
      mainValue: loading ? "..." : totalBansos.toLocaleString("id-ID"),
      unit: "KK",
      subDetail: `${Math.round((totalBansos / totalKeluarga) * 100)}% KK Desa Tercover`,
      badge: "Tepat Sasaran",
      icon: HeartHandshake,
      accentColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    },
    {
      id: "produktif",
      category: "Demografi",
      title: "Usia Produktif (15-59)",
      mainValue: loading ? "..." : `${usiaProduktif}%`,
      unit: "",
      subDetail: "Mayoritas Tenaga Kerja Aktif",
      badge: "Bonus Demografi",
      icon: TrendingUp,
      accentColor: "text-sky-700 bg-sky-50 border-sky-200",
    },
    {
      id: "listrik",
      category: "Pemukiman",
      title: "Akses Listrik PLN",
      mainValue: "97%",
      unit: "Rumah",
      subDetail: "Terhubung Jaringan Listrik Mandiri/PLN",
      badge: "Fasilitas Utama",
      icon: Building2,
      accentColor: "text-amber-700 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <section 
      id="statistik"
      aria-label="Section Ringkasan Data Desa Buong Baru"
      className="min-h-[calc(100dvh-64px)] flex flex-col justify-center py-8 sm:py-12 bg-white border-b border-[#e6dfd8] relative overflow-hidden"
    >
      {/* Background Motif Ukiran Batik Tidung Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-18 mix-blend-multiply bg-pattern-tidung" />
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d5cbc1_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Statistik Utama Desa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
              Ringkasan Data &amp; Indikator Desa 2026
            </h2>
            <p className="text-sm sm:text-base text-[#6c6a64] font-normal leading-relaxed">
              Gambaran kualitatif dan kuantitatif indikator desa yang diperbarui secara otomatis dari database untuk mewujudkan tata kelola desa berbasis data presisi.
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

        {/* Grid Kartu Ringkasan Data (6 Items) dengan Efek Focus saat Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 group/stats">
          {summaryDataItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ scale: 1.03, zIndex: 10 }}
                className="bg-[#efe9de]/60 hover:bg-white border border-[#e6dfd8] rounded-xl p-5 transition-all duration-300 shadow-2xs hover:shadow-lg hover:border-[#cc785c] flex flex-col justify-between group-hover/stats:opacity-40 hover:!opacity-100 cursor-pointer"
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
