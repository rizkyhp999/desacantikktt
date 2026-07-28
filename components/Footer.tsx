"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Sparkles } from "lucide-react";

/**
 * Komponen Footer Desa Cantik Buong Baru 2026
 * 
 * Mengikuti Aturan Tema Terang (Pure Light Theme Only) & design.md:
 * - Latar Belakang: Surface Card (#efe9de) dengan pembatas atas Hairline Border (#e6dfd8)
 * - Teks Utama: Ink (#141413) & Muted Body (#6c6a64)
 * - Aksen Brand: Coral (#cc785c)
 * 
 * @returns {JSX.Element} Footer Antarmuka
 */
export default function Footer() {
  return (
    <footer 
      className="bg-[#efe9de] border-t border-[#e6dfd8] py-12 relative z-10"
      aria-label="Footer Portal Resmi Desa"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Kolom 1: Brand & Penjelasan (5/12 kolom) */}
          <div className="md:col-span-5 space-y-4">
            <Link 
              href="/"
              className="text-lg sm:text-xl font-bold tracking-tight inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c] rounded-md"
            >
              <span className="text-[#cc785c]">Desa Cantik</span>
              <span className="text-[#141413]">Buong Baru</span>
            </Link>
            <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed max-w-sm">
              Portal data dan statistik terpadu Desa Cinta Statistik (Descan) Buong Baru. Menyajikan transparansi indikator kependudukan, geografis, sosial, dan ekonomi untuk pembangunan desa yang mandiri.
            </p>
          </div>

          {/* Kolom 2: Navigasi Tautan Cepat (3/12 kolom) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141413] border-b border-[#e6dfd8] pb-1">
              Tautan Utama
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#6c6a64] font-medium">
              <li>
                <Link href="/" className="hover:text-[#cc785c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c] rounded">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-[#cc785c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c] rounded">
                  Profil Desa
                </Link>
              </li>
              <li>
                <Link href="/statistik" className="hover:text-[#cc785c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c] rounded">
                  Statistik
                </Link>
              </li>
              <li>
                <Link href="/publikasi" className="hover:text-[#cc785c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c] rounded">
                  Publikasi
                </Link>
              </li>
              <li>
                <Link href="/infografis" className="hover:text-[#cc785c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c] rounded">
                  Infografis
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Informasi Kontak (4/12 kolom) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141413] border-b border-[#e6dfd8] pb-1">
              Kontak Kantor Desa
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#6c6a64]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#cc785c] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Jl. Negara KM 12, Desa Buong Baru, Kecamatan Muara Komam, Kabupaten Paser, Kalimantan Timur 76253.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#cc785c] shrink-0" />
                <span>info@buongbaru.desa.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#cc785c] shrink-0" />
                <span>+62 811-5432-109</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Garis batas bawah & Hak Cipta */}
        <div className="mt-8 pt-6 border-t border-[#e6dfd8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-[#6c6a64] font-medium">
          <div>
            © 2026 Desa Cantik Buong Baru. Seluruh Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#cc785c]" />
            <span>Penyelenggaraan Portal Desa Cinta Statistik</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
