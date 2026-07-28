"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Komponen Section Publikasi & Infografis Desa Buong Baru
 * 
 * Mengikuti Instruksi Spesifik User:
 * - Murni 100% gambar tanpa judul, tanpa deskripsi, tanpa badge, tanpa tombol atau elemen teks lain di dalam kode.
 * - Sisi Kiri: Gambar Depan Publikasi (Rasio 9:16 / Lebar 9 Tinggi 16) mengarah ke /publikasi
 * - Sisi Kanan: Gambar Depan Infografis (Rasio 9:16 / Lebar 9 Tinggi 16) mengarah ke /infografis
 * - Latar Belakang: Warm Canvas (#faf9f5) dengan dot pattern
 * - Tinggi: Full Viewport Height (min-h-[calc(100dvh-64px)])
 * - Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
 * 
 * @returns {JSX.Element} Section Murni Gambar Publikasi & Infografis
 */
export default function PublicationsAndInfographicsSection() {
  return (
    <section 
      id="publikasi-infografis"
      aria-label="Section Publikasi dan Infografis Desa Buong Baru"
      className="relative overflow-hidden min-h-[calc(100dvh-64px)] flex flex-col justify-center py-8 sm:py-12 bg-[#faf9f5] border-b border-[#e6dfd8]"
    >
      {/* Subtle Background Pattern Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#e6dfd8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid 2 Kolom: Sisi Kiri Publikasi • Sisi Kanan Infografis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 items-start justify-items-center max-w-3xl mx-auto">
          
          {/* SISI KIRI: Gambar Depan Publikasi (9:16) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[250px] flex flex-col items-center"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[#141413] text-center mb-3 tracking-tight">
              Publikasi
            </h3>
            <div className="relative w-full aspect-[9/16] group">
              {/* Soft bottom-right ambient drop shadow (looks like paper depth/lift) */}
              <div className="absolute inset-0 bg-neutral-950/15 blur-md rounded-xl translate-x-2.5 translate-y-2.5 -z-10 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
              
              <Link 
                href="/publikasi"
                className="block w-full h-full overflow-hidden rounded-xl border-2 border-[#e6dfd8] hover:border-[#cc785c] bg-white transition-all duration-300"
                aria-label="Akses Halaman Publikasi Data Desa"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/publikasi-portrait.png"
                  alt="Publikasi Desa Buong Baru"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
            </div>
          </motion.div>

          {/* SISI KANAN: Gambar Depan Infografis (9:16) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="w-full max-w-[250px] flex flex-col items-center"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[#141413] text-center mb-3 tracking-tight">
              Infografis
            </h3>
            <div className="relative w-full aspect-[9/16] group">
              {/* Soft bottom-right ambient drop shadow (looks like paper depth/lift) */}
              <div className="absolute inset-0 bg-neutral-950/15 blur-md rounded-xl translate-x-2.5 translate-y-2.5 -z-10 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />

              <Link 
                href="/infografis"
                className="block w-full h-full overflow-hidden rounded-xl border-2 border-[#e6dfd8] hover:border-[#cc785c] bg-white transition-all duration-300"
                aria-label="Akses Halaman Infografis Desa"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/infografis-portrait.png"
                  alt="Infografis Desa Buong Baru"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
