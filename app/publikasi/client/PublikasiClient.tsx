"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Eye, X, BookOpen, ExternalLink } from "lucide-react";

interface PublikasiItem {
  id: string;
  category: "Buong Baru Dalam Angka" | "Potensi Desa" | "Profil Desa";
  title: string;
  year: string;
  filePath: string;
  coverImagePath: string;
}

const ALL_PUBLIKASI: PublikasiItem[] = [
  {
    id: "buong-baru-dalam-angka-2026",
    category: "Buong Baru Dalam Angka",
    title: "Buong Baru Dalam Angka 2026",
    year: "2026",
    filePath: "/publikasi/Buong Baru Dalam Angka 2026.pdf",
    coverImagePath: "/publikasi/covers/Buong Baru Dalam Angka 2026.png",
  },
  {
    id: "potensi-desa-buong-baru",
    category: "Potensi Desa",
    title: "Potensi Desa Buong Baru",
    year: "2026",
    filePath: "/publikasi/Potensi Desa Buong Baru.pdf",
    coverImagePath: "/publikasi/covers/Potensi Desa Buong Baru.png",
  },
  {
    id: "profil-desa-buong-baru-2025",
    category: "Profil Desa",
    title: "Profil Desa Buong Baru 2025",
    year: "2025",
    filePath: "/publikasi/PROFIL DESA BUONG BARU 2025.pdf",
    coverImagePath: "/publikasi/covers/PROFIL DESA BUONG BARU 2025.png",
  },
  {
    id: "profil-desa-buong-baru-2024",
    category: "Profil Desa",
    title: "Profil Desa Buong Baru 2024",
    year: "2024",
    filePath: "/publikasi/PROFIL DESA BUONG BARU 2024.pdf",
    coverImagePath: "/publikasi/covers/PROFIL DESA BUONG BARU 2024.png",
  },
  {
    id: "profil-desa-buong-baru-2023",
    category: "Profil Desa",
    title: "Profil Desa Buong Baru 2023",
    year: "2023",
    filePath: "/publikasi/PROFIL DESA BUONG BARU 2023.pdf",
    coverImagePath: "/publikasi/covers/PROFIL DESA BUONG BARU 2023.png",
  },
];

/**
 * Komponen Client Publikasi Desa Buong Baru
 * Tampilan sejajar 5 kolom yang simetris & rata atas untuk seluruh publikasi dokumen.
 */
export default function PublikasiClient() {
  const [previewDoc, setPreviewDoc] = useState<PublikasiItem | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* ── Modal Pratinjau Full PDF ── */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#e6dfd8] rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e6dfd8] bg-[#faf9f5]">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#141413] truncate">
                    {previewDoc.title} ({previewDoc.year})
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewDoc.filePath}
                    download
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh PDF</span>
                  </a>
                  <a
                    href={previewDoc.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-xs font-bold text-[#6c6a64] hover:text-[#141413] bg-[#efe9de] rounded-xl hover:bg-[#e8e0d2] transition-colors cursor-pointer"
                    title="Buka Tab Baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-2 text-xs font-bold text-[#6c6a64] hover:text-[#141413] bg-[#efe9de] rounded-xl hover:bg-[#e8e0d2] transition-colors cursor-pointer"
                    title="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Viewer Iframe PDF */}
              <div className="flex-1 bg-[#525659] relative">
                <iframe
                  src={`${previewDoc.filePath}#toolbar=1`}
                  className="w-full h-full border-none"
                  title={previewDoc.title}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Judul Halaman Utama ── */}
      <div className="border-b border-[#e6dfd8] pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141413]">
          Publikasi
        </h1>
      </div>

      {/* ── Grid Simetris Rata Atas 5 Kolom Publikasi ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
        {ALL_PUBLIKASI.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="group space-y-3 cursor-pointer"
            onClick={() => setPreviewDoc(doc)}
          >
            {/* Header Kategori Per Dokumen */}
            <div className="border-b-2 border-emerald-700 pb-1.5 min-h-[36px] flex items-end">
              <span className="text-xs font-bold text-[#141413] tracking-tight leading-tight">
                {doc.category}
              </span>
            </div>

            {/* Sampul Visual PDF */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#e6dfd8] shadow-md group-hover:shadow-2xl group-hover:-translate-y-1.5 transition-all duration-300 bg-white">
              {/* eslint-disable-next-html-element-suppress */}
              <img
                src={doc.coverImagePath}
                alt={`Sampul ${doc.title}`}
                className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2 backdrop-blur-[2px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewDoc(doc);
                  }}
                  className="w-full py-2 px-3 bg-white hover:bg-emerald-50 text-[#141413] hover:text-emerald-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Pratinjau</span>
                </button>
                <a
                  href={doc.filePath}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>
              </div>
            </div>

            {/* Judul & Tahun */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[#141413] group-hover:text-emerald-800 transition-colors leading-snug">
                {doc.title}
              </h3>
              <span className="inline-block text-[11px] font-semibold text-[#6c6a64]">
                Tahun {doc.year}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
