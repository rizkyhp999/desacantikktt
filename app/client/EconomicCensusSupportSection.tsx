"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ExternalLink, Award, CheckCircle2, Building2 } from "lucide-react";

/**
 * Interface Props untuk EconomicCensusSupportSection
 */
interface EconomicCensusSupportSectionProps {
  /** Path foto/banner utama dukungan sensus ekonomi */
  photoUrl?: string;
  /** Path foto sekunder dukungan sensus ekonomi */
  secondaryPhotoUrl?: string;
  /** Tautan tujuan (bisa diubah sesuai kebutuhan) */
  linkUrl?: string;
  /** Judul banner/seksi */
  title?: string;
  /** Subtitle / deskripsi singkat */
  description?: string;
}

/**
 * EconomicCensusSupportSection Component
 * Komponen dukungan Desa Buong Baru terhadap Sensus Ekonomi BPS
 */
export default function EconomicCensusSupportSection({
  photoUrl = "/Changing_people_hand_poses_2K_202608140928.jpeg",
  secondaryPhotoUrl = "/DSC06806.JPG",
  linkUrl = "#",
  title = "Dukungan Penuh Desa Buong Baru Terhadap Sensus Ekonomi",
  description = "Pemerintah Desa Buong Baru bersama seluruh elemen masyarakat berkomitmen penuh mendukung pelaksanaan Sensus Ekonomi oleh Badan Pusat Statistik (BPS) demi terwujudnya pendataan ekonomi daerah yang akurat, transparan, dan berkelanjutan.",
}: EconomicCensusSupportSectionProps) {
  const [activePhoto, setActivePhoto] = React.useState(photoUrl);
  const secondaryPhoto = activePhoto === photoUrl ? secondaryPhotoUrl : photoUrl;

  return (
    <section className="py-16 md:py-24 bg-[#faf9f5] border-t border-[#e6dfd8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-white border border-[#e6dfd8] shadow-xs text-[#141413]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-8 lg:p-12 relative z-10">
            {/* Konten Teks */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Sensus Ekonomi BPS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141413] leading-tight">
                {title}
              </h2>

              <p className="text-[#6c6a64] text-sm sm:text-base leading-relaxed">
                {description}
              </p>

              {/* Point Keunggulan / Manfaat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-[#faf9f5] p-3.5 rounded-xl border border-[#e6dfd8]">
                  <CheckCircle2 className="w-5 h-5 text-[#cc785c] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#141413] font-medium">
                    Pemetaan Potensi Usaha Desa
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-[#faf9f5] p-3.5 rounded-xl border border-[#e6dfd8]">
                  <Building2 className="w-5 h-5 text-[#cc785c] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#141413] font-medium">
                    Dasar Kebijakan Ekonomi Tepat Sasaran
                  </span>
                </div>
              </div>

              {/* Tombol Tautan */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={linkUrl}
                  target={linkUrl.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#cc785c] hover:bg-[#b8664c] text-white font-medium text-sm transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>Informasi & Link Selengkapnya</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Container Foto Utama & Sekunder */}
            <div className="lg:col-span-5 relative space-y-3">
              {/* Bingkai Foto Utama */}
              <div className="relative group rounded-2xl overflow-hidden bg-[#faf9f5] border border-[#e6dfd8] shadow-sm aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] flex items-center justify-center">
                <img
                  src={activePhoto}
                  alt="Dukungan Sensus Ekonomi Desa Buong Baru Utama"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallbackEl = parent.querySelector(".photo-placeholder");
                      if (fallbackEl) fallbackEl.classList.remove("hidden");
                    }
                  }}
                />

                {/* Fallback Display */}
                <div className="photo-placeholder hidden flex-col items-center justify-center p-6 text-center text-[#6c6a64] space-y-3">
                  <Award className="w-12 h-12 text-[#cc785c]" />
                  <p className="text-xs sm:text-sm font-medium text-[#141413]">
                    [Foto Dokumentasi Sensus Ekonomi]
                  </p>
                </div>

                {/* Badge Overlay */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#e6dfd8] text-[11px] text-[#cc785c] font-semibold flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#cc785c] animate-pulse" />
                  Sensus Ekonomi
                </div>
              </div>

              {/* Thumbnails Foto Sekunder */}
              {secondaryPhotoUrl && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => setActivePhoto(photoUrl)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activePhoto === photoUrl
                        ? "border-[#cc785c] ring-2 ring-[#cc785c]/20 scale-105"
                        : "border-[#e6dfd8] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt="Thumbnail Utama"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <button
                    onClick={() => setActivePhoto(secondaryPhotoUrl)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activePhoto === secondaryPhotoUrl
                        ? "border-[#cc785c] ring-2 ring-[#cc785c]/20 scale-105"
                        : "border-[#e6dfd8] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={secondaryPhotoUrl}
                      alt="Thumbnail Sekunder"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <span className="text-[11px] text-[#6c6a64] font-medium ml-1">
                    Klik thumbnail untuk mengganti tampilan foto
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
