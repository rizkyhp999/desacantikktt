"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Eye, X, Image as ImageIcon, ExternalLink } from "lucide-react";

interface InfografisItem {
  id: string;
  category: string;
  title: string;
  year: string;
  filePath: string;
  coverImagePath: string;
}

const ALL_INFOGRAFIS: InfografisItem[] = [
  {
    id: "total-penduduk-2026",
    category: "Demografi & Kependudukan",
    title: "Infografis Total Penduduk Desa",
    year: "2026",
    filePath: "/infografis/Total penduduk.png",
    coverImagePath: "/infografis/Total penduduk.png",
  },
  {
    id: "data-perumahan-2026",
    category: "Fasilitas & Pemukiman",
    title: "Infografis Data Perumahan Desa",
    year: "2026",
    filePath: "/infografis/DATA PERUMAHAN DESA Buongbaru.png",
    coverImagePath: "/infografis/DATA PERUMAHAN DESA Buongbaru.png",
  },
  {
    id: "penangkapan-ikan-2026",
    category: "Potensi & Perikanan",
    title: "Infografis Penangkapan Ikan Desa",
    year: "2026",
    filePath: "/infografis/Penangkapan ikan.png",
    coverImagePath: "/infografis/Penangkapan ikan.png",
  },
];

/**
 * Komponen Client Halaman Infografis Desa Buong Baru
 * Menampilkan katalog poster infografis tematik dalam bentuk grid responsif dengan fitur Modal Preview & Download
 */
export default function InfografisClient() {
  const [previewDoc, setPreviewDoc] = useState<InfografisItem | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* ── Modal Pratinjau Full Infografis ── */}
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
                  <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-[#cc785c] shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#141413] truncate">
                    {previewDoc.title} ({previewDoc.year})
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewDoc.filePath}
                    download
                    className="px-3.5 py-1.5 text-xs font-bold bg-[#cc785c] hover:bg-[#b05f45] text-white rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Gambar</span>
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

              {/* Viewer Gambar Full */}
              <div className="flex-1 bg-[#2a2a2a] relative flex items-center justify-center p-4 overflow-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewDoc.filePath}
                  alt={previewDoc.title}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Judul Halaman Utama ── */}
      <div className="border-b border-[#e6dfd8] pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141413]">
          Infografis Tematik
        </h1>
        <p className="text-sm text-[#6c6a64] mt-2 leading-relaxed">
          Visualisasi data statistik dan statistik sektoral Desa Buong Baru dalam format infografis poster interaktif.
        </p>
      </div>

      {/* ── Grid Infografis ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-start">
        {ALL_INFOGRAFIS.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="group space-y-3 cursor-pointer"
            onClick={() => setPreviewDoc(doc)}
          >
            {/* Header Kategori Per Dokumen */}
            <div className="border-b-2 border-[#cc785c] pb-1.5 min-h-[36px] flex items-end">
              <span className="text-xs font-bold text-[#141413] tracking-tight leading-tight">
                {doc.category}
              </span>
            </div>

            {/* Sampul Visual Gambar Infografis */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#e6dfd8] shadow-md group-hover:shadow-2xl group-hover:-translate-y-1.5 transition-all duration-300 bg-white flex items-center justify-center">
              {/* eslint-disable-next-html-element-suppress */}
              <img
                src={doc.coverImagePath}
                alt={`Infografis ${doc.title}`}
                className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2 backdrop-blur-[2px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewDoc(doc);
                  }}
                  className="w-full py-2 px-3 bg-white hover:bg-orange-50 text-[#141413] hover:text-[#cc785c] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-[#cc785c]" />
                  <span>Lihat Infografis</span>
                </button>
                <a
                  href={doc.filePath}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-2 px-3 bg-[#cc785c] hover:bg-[#b05f45] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Gambar</span>
                </a>
              </div>
            </div>

            {/* Judul & Tahun */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[#141413] group-hover:text-[#cc785c] transition-colors leading-snug">
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
