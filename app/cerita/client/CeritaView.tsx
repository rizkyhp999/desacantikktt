"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  BookOpen, 
  MapPin, 
  Users, 
  Sparkles, 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  ClipboardCheck,
  Building2,
  Calendar,
  Compass,
  Award,
  Eye,
  Heart,
  ImageOff
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StoryPhoto {
  id: string;
  src: string;
  stage: string;
  title: string;
  desc: string;
  tag: string;
  hasPhoto?: boolean;
}

/**
 * Data Foto Tahap 1: Rapat Awal Desa Cantik (awal1 & awal2)
 */
const FOTO_RAPAT_AWAL: StoryPhoto[] = [
  {
    id: "awal1",
    src: "/foto-kegiatan/awal1.JPG",
    stage: "Tahap 01",
    tag: "Rapat Awal",
    title: "Rapat Awal Desa Cantik 1",
    desc: "Rapat koordinasi awal program Desa Cantik.",
    hasPhoto: true
  },
  {
    id: "awal2",
    src: "/foto-kegiatan/awal2.JPG",
    stage: "Tahap 01",
    tag: "Rapat Awal",
    title: "Rapat Awal Desa Cantik 2",
    desc: "Rapat koordinasi awal program Desa Cantik.",
    hasPhoto: true
  }
];

/**
 * Data Foto Tahap 2: Identifikasi Kebutuhan Data Desa
 */
const FOTO_IDENTIFIKASI: StoryPhoto[] = [
  {
    id: "identifikasi",
    src: "/foto-kegiatan/identifikasi.jpeg",
    stage: "Tahap 02",
    tag: "Identifikasi Data",
    title: "Identifikasi Data Desa",
    desc: "Kunjungan BPS Kabupaten Tana Tidung ke Desa Buong Baru untuk identifikasi potensi perikanan dan database desa.",
    hasPhoto: true
  }
];

/**
 * Data Foto Tahap 3: Pembinaan 1, 2, 3, dan 4
 */
const FOTO_PEMBINAAN: StoryPhoto[] = [
  {
    id: "pembinaan1",
    src: "/foto-kegiatan/pembinaan1.JPG",
    stage: "Tahap 03",
    tag: "Pembinaan",
    title: "Pembinaan 1",
    desc: "Kegiatan Pembinaan 1 oleh BPS Kabupaten Tana Tidung.",
    hasPhoto: true
  },
  {
    id: "pembinaan2",
    src: "/foto-kegiatan/pembinaan2.jpg",
    stage: "Tahap 03",
    tag: "Pembinaan",
    title: "Pembinaan 2",
    desc: "Kegiatan Pembinaan 2 oleh BPS Kabupaten Tana Tidung.",
    hasPhoto: true
  },
  {
    id: "pembinaan3",
    src: "/foto-kegiatan/pembinaan3.jpg",
    stage: "Tahap 03",
    tag: "Pembinaan",
    title: "Pembinaan 3",
    desc: "Kegiatan Pembinaan 3 oleh BPS Kabupaten Tana Tidung.",
    hasPhoto: true
  },
  {
    id: "pembinaan4",
    src: "",
    stage: "Tahap 03",
    tag: "Pembinaan",
    title: "Pembinaan 4",
    desc: "Kegiatan Pembinaan 4 (Foto belum tersedia).",
    hasPhoto: false
  }
];

/**
 * Data Foto Tahap 4: Pendataan Lapangan (18 Foto)
 */
const FOTO_PENDATAAN_LAPANGAN: StoryPhoto[] = Array.from({ length: 18 }, (_, i) => ({
  id: `lapangan-${i + 1}`,
  src: `/foto-kegiatan/${i + 1}.jpeg`,
  stage: "Tahap 04",
  tag: "Action Lapangan",
  title: `Dokumentasi Aksi Lapangan #${i + 1}`,
  desc: `Aksi pencacahan langsung dari rumah ke rumah (door-to-door) oleh Tim Komunitas Desa Cinta Statistik Buong Baru bersama Mahasiswa KKN UBT.`,

  hasPhoto: true
}));

/**
 * Gabungan foto yang memiliki file gambar untuk Lightbox Modal
 */
const ALL_PHOTOS: StoryPhoto[] = [
  ...FOTO_RAPAT_AWAL,
  ...FOTO_IDENTIFIKASI,
  ...FOTO_PEMBINAAN.filter((p) => p.hasPhoto),
  ...FOTO_PENDATAAN_LAPANGAN
];

/**
 * Client Component Tampilan Cerita Kami dengan GSAP & ScrollTrigger Animations
 */
export default function CeritaView() {
  const [selectedPhoto, setSelectedPhoto] = useState<StoryPhoto | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animasi Hero Banner Reveal
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 50, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
        );
      }

      // 2. Animasi Garis Timeline Vertikal
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: mainRef.current,
              start: "top 20%",
              end: "bottom 80%",
              scrub: 0.5
            }
          }
        );
      }

      // 3. Animasi Stagger Reveal Setiap Tahap Timeline
      const stages = gsap.utils.toArray<HTMLElement>(".timeline-stage");
      stages.forEach((stage) => {
        gsap.fromTo(
          stage,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stage,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // 4. Animasi Stagger Foto Card Galeri Lapangan
      const photoCards = gsap.utils.toArray<HTMLElement>(".gsap-photo-card");
      if (photoCards.length > 0) {
        gsap.fromTo(
          photoCards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".gsap-gallery-grid",
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = ALL_PHOTOS.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % ALL_PHOTOS.length;
    setSelectedPhoto(ALL_PHOTOS[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = ALL_PHOTOS.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length;
    setSelectedPhoto(ALL_PHOTOS[prevIndex]);
  };

  return (
    <div ref={mainRef} className="w-full bg-[#faf9f5] relative overflow-hidden py-10 sm:py-16">
      
      {/* Background Motif Ukiran Batik Tidung Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-pattern-tidung" />
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d5cbc1_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* ── HERO SECTION WITH GSAP REVEAL ── */}
        <div 
          ref={heroRef}
          className="relative bg-white border border-[#e6dfd8] rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xs space-y-4"
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#cc785c]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Catatan Perjalanan Kami • Desa Buong Baru
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141413] tracking-tight leading-snug">
              Cerita Kami: Statistik Presisi <span className="text-[#cc785c]">Desa Buong Baru</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#6c6a64] font-medium leading-relaxed">
              Selamat datang di rekam jejak perjalanan kami, Pemerintah Desa Buong Baru dan Komunitas Desa Cinta Statistik (Descan), dalam membangun data presisi desa secara mandiri dengan pendampingan BPS Kabupaten Tana Tidung.
            </p>
          </div>
        </div>


        {/* ── TIMELINE JOURNEY GSAP ANIMATED ── */}
        <div className="relative space-y-20">
          
          {/* Connecting Vertical Line (GSAP Scrub Animated) */}
          <div className="absolute left-4 sm:left-1/2 top-10 bottom-10 w-1 bg-[#e6dfd8] -translate-x-1/2 hidden sm:block">
            <div 
              ref={timelineLineRef}
              className="w-full h-full bg-[#cc785c] rounded-full origin-top"
            />
          </div>

          {/* ──────── TAHAP 1: RAPAT KOORDINASI AWAL ──────── */}
          <div className="timeline-stage grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#cc785c] text-white items-center justify-center font-bold text-xs shadow-md z-20">
              01
            </div>

            <div className="lg:col-span-5 space-y-3 bg-white p-6 sm:p-8 rounded-2xl border border-[#e6dfd8] shadow-2xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#efe9de] text-[#cc785c] text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Tahap 01 • Rapat Awal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141413]">
                Rapat Awal Desa Cantik
              </h2>
              <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
                Rapat koordinasi awal program Desa Cantik yang melibatkan 3 desa (Desa Buong Baru, Desa Sebawang, dan Desa Limbu Sedulun) bersama BPS Kabupaten Tana Tidung dan Dinas Sosial PMD Kabupaten Tana Tidung.
              </p>
            </div>

            <div className="lg:col-span-2 hidden lg:block" />

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FOTO_RAPAT_AWAL.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group bg-white border border-[#e6dfd8] hover:border-[#cc785c] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <div className="aspect-4/3 overflow-hidden bg-gray-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h4 className="text-xs font-bold text-[#141413]">{photo.title}</h4>
                    <p className="text-[11px] text-[#6c6a64] leading-tight">{photo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ──────── TAHAP 2: IDENTIFIKASI KEBUTUHAN DATA ──────── */}
          <div className="timeline-stage grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-700 text-white items-center justify-center font-bold text-xs shadow-md z-20">
              02
            </div>

            <div className="lg:col-span-5 order-2 lg:order-1">
              {FOTO_IDENTIFIKASI.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group bg-white border border-[#e6dfd8] hover:border-emerald-600 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <div className="aspect-16/9 overflow-hidden bg-gray-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-xs font-bold text-[#141413]">{photo.title}</h4>
                    <p className="text-xs text-[#6c6a64] leading-relaxed">{photo.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 hidden lg:block order-2" />

            <div className="lg:col-span-5 order-1 lg:order-3 space-y-3 bg-white p-6 sm:p-8 rounded-2xl border border-[#e6dfd8] shadow-2xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tahap 02 • Identifikasi Data</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141413]">
                Identifikasi Data Potensi Perikanan &amp; Database Desa
              </h2>
              <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
                Kunjungan BPS Kabupaten Tana Tidung ke Desa Buong Baru untuk identifikasi awal variabel data yang akan dikumpulkan, khususnya fokus pada potensi perikanan dan database baru desa.
              </p>
            </div>
          </div>

          {/* ──────── TAHAP 3: PEMBINAAN 1, 2, 3, DAN 4 ──────── */}
          <div className="timeline-stage grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-700 text-white items-center justify-center font-bold text-xs shadow-md z-20">
              03
            </div>

            <div className="lg:col-span-5 space-y-3 bg-white p-6 sm:p-8 rounded-2xl border border-[#e6dfd8] shadow-2xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Tahap 03 • Pembinaan Bertahap</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141413]">
                Rangkaian Pembinaan Statistik
              </h2>
              <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
                Kegiatan pembinaan bertahap (Pembinaan 1, Pembinaan 2, Pembinaan 3, dan Pembinaan 4) oleh BPS Kabupaten Tana Tidung untuk memperkuat kapasitas kader dan agen statistik desa.
              </p>
            </div>

            <div className="lg:col-span-2 hidden lg:block" />

            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-3">
              {FOTO_PEMBINAAN.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => photo.hasPhoto && setSelectedPhoto(photo)}
                  className={`group bg-white border border-[#e6dfd8] ${
                    photo.hasPhoto ? "hover:border-blue-600 cursor-pointer hover:-translate-y-1" : "opacity-75"
                  } rounded-2xl overflow-hidden shadow-2xs transition-all duration-300`}
                >
                  <div className="aspect-4/3 overflow-hidden bg-gray-100 relative flex items-center justify-center">
                    {photo.hasPhoto ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-[#a09e97] text-center space-y-1">
                        <ImageOff className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-semibold">Foto Belum Ada</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-0.5">
                    <h4 className="text-xs font-bold text-[#141413]">{photo.title}</h4>
                    <p className="text-[10px] text-[#6c6a64] line-clamp-1">{photo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ──────── TAHAP 4: PENDATAAN LAPANGAN (18 FOTO) ──────── */}
          <div className="timeline-stage space-y-8 pt-6 relative">
            <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 -top-4 w-12 h-12 rounded-full bg-[#cc785c] text-white items-center justify-center font-bold text-sm shadow-lg z-20 border-4 border-white">
              04
            </div>

            <div className="bg-white border border-[#e6dfd8] rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-[#e6dfd8] pb-4">
                <ClipboardCheck className="w-6 h-6 text-[#cc785c]" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413]">
                  Tahap 04: Pendataan Lapangan Rumah Tangga
                </h2>
              </div>

              <div className="prose max-w-none text-sm sm:text-base text-[#3d3d3a] leading-relaxed space-y-4">
                <p>
                  Setelah mengikuti pembekalan dari <strong>BPS Kabupaten Tana Tidung</strong>, kami dari Komunitas Desa Cinta Statistik (Descan) Buong Baru bersama <strong>12 Mahasiswa KKN UBT</strong> secara serentak <strong>turun langsung ke lapangan</strong>.
                </p>
                <p>
                  Membawa kuesioner dan instrumen sensus, kami menyusuri lorong pemukiman, mendatangi rumah demi rumah warga di 5 Rukun Tetangga (RT.001 s.d. RT.005), hingga kawasan bantaran sungai dan perkebunan sawit. Seluruh warga desa kami datangi secara langsung (<em>door-to-door</em>).
                </p>
                <p>
                  Melalui wawancara tatap muka yang hangat, kami mendata variabel kependudukan, pendidikan, perumahan, sanitasi MCK, potensi usaha nelayan, hingga bantuan sosial. Seluruh isian diverifikasi ulang di tempat (*clean check*) demi menjamin keakuratan master data Desa Buong Baru 100%.
                </p>
              </div>
            </div>

            {/* Galeri 18 Foto Lapangan dengan GSAP Stagger */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-bold text-[#141413]">
                    Galeri Foto Aksi Pendataan Lapangan Desa Buong Baru (18 Foto)
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Klik Foto Untuk Detail
                </span>
              </div>

              <div className="gsap-gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FOTO_PENDATAAN_LAPANGAN.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="gsap-photo-card group bg-white border border-[#e6dfd8] hover:border-[#cc785c] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                  >
                    <div className="aspect-4/3 overflow-hidden bg-[#efe9de] relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                        {photo.id.replace('lapangan-', 'Foto #')}
                      </div>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#141413] group-hover:text-[#cc785c] transition-colors leading-snug">
                          {photo.title}
                        </h4>
                        <p className="text-xs text-[#6c6a64] line-clamp-2 mt-1 leading-relaxed">
                          {photo.desc}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#f0eae4] flex items-center justify-between text-[10px] font-semibold text-[#cc785c]">
                        <span>Pendataan Lapangan</span>
                        <span>Lihat Foto →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── MODAL LIGHTBOX VIEW FOTO DETIL ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-[#e6dfd8] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-0 relative"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e6dfd8] bg-[#faf9f5]">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#cc785c]" />
                  <span className="text-xs font-bold text-[#141413] uppercase tracking-wider">
                    {selectedPhoto.stage} • {selectedPhoto.title}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#141413] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Image Preview */}
              <div className="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-h-[65vh] w-auto object-contain"
                />

                {/* Tombol Navigasi Kiri & Kanan Modal */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Caption & Description */}
              <div className="p-5 bg-white space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#efe9de] text-[#cc785c] text-[10px] font-bold uppercase">
                    {selectedPhoto.tag}
                  </span>
                  <h3 className="text-base font-bold text-[#141413]">
                    {selectedPhoto.title}
                  </h3>
                </div>
                <p className="text-xs text-[#6c6a64] leading-relaxed">
                  {selectedPhoto.desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
