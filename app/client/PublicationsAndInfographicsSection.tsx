"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Eye, X, BookOpen, ExternalLink, Image as ImageIcon } from "lucide-react";

interface ItemDoc {
  id: string;
  category: string;
  title: string;
  year: string;
  filePath: string;
  coverImagePath: string;
}

const ALL_PUBLIKASI: ItemDoc[] = [
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
    id: "profil-desa-buong-baru-2026",
    category: "Profil Desa",
    title: "Profil Desa Buong Baru 2026",
    year: "2026",
    filePath: "/publikasi/PROFIL DESA BUONG BARU 2026.pdf",
    coverImagePath: "/publikasi/covers/PROFIL DESA BUONG BARU 2026.png",
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

const ALL_INFOGRAFIS: ItemDoc[] = [
  {
    id: "total-penduduk-2026",
    category: "Infografis Tematik",
    title: "Infografis Total Penduduk Desa",
    year: "2026",
    filePath: "/infografis/Total penduduk.png",
    coverImagePath: "/infografis/Total penduduk.png",
  },
  {
    id: "data-perumahan-2026",
    category: "Infografis Tematik",
    title: "Infografis Data Perumahan Desa",
    year: "2026",
    filePath: "/infografis/DATA PERUMAHAN DESA Buongbaru.png",
    coverImagePath: "/infografis/DATA PERUMAHAN DESA Buongbaru.png",
  },
  {
    id: "penangkapan-ikan-2026",
    category: "Infografis Tematik",
    title: "Infografis Penangkapan Ikan Desa",
    year: "2026",
    filePath: "/infografis/Penangkapan ikan.png",
    coverImagePath: "/infografis/Penangkapan ikan.png",
  },
];

/**
 * Komponen Section Publikasi & Infografis Desa Buong Baru
 * 
 * Kedua Sisi (Publikasi & Infografis) menggunakan Carousel 3D Otomatis 3 Detik yang Simetris
 */
export default function PublicationsAndInfographicsSection() {
  const [pubIndex, setPubIndex] = useState<number>(0);
  const [infoIndex, setInfoIndex] = useState<number>(0);
  const [previewDoc, setPreviewDoc] = useState<ItemDoc | null>(null);

  // Auto-play Rotasi Otomatis Publikasi (3 Detik)
  useEffect(() => {
    if (previewDoc) return;
    const interval = setInterval(() => {
      setPubIndex((prev) => (prev === ALL_PUBLIKASI.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [previewDoc]);

  // Auto-play Rotasi Otomatis Infografis (3 Detik)
  useEffect(() => {
    if (previewDoc) return;
    const interval = setInterval(() => {
      setInfoIndex((prev) => (prev === ALL_INFOGRAFIS.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [previewDoc]);

  const getVisibleItems = (list: ItemDoc[], activeIdx: number) => {
    const total = list.length;
    const prevIndex = (activeIdx - 1 + total) % total;
    const nextIndex = (activeIdx + 1) % total;
    return [
      { doc: list[prevIndex], pos: "left", realIndex: prevIndex },
      { doc: list[activeIdx], pos: "center", realIndex: activeIdx },
      { doc: list[nextIndex], pos: "right", realIndex: nextIndex },
    ];
  };

  const visiblePubs = getVisibleItems(ALL_PUBLIKASI, pubIndex);
  const visibleInfos = getVisibleItems(ALL_INFOGRAFIS, infoIndex);

  const activePub = ALL_PUBLIKASI[pubIndex];
  const activeInfo = ALL_INFOGRAFIS[infoIndex];

  return (
    <section 
      id="publikasi-infografis"
      aria-label="Section Publikasi dan Infografis Desa Buong Baru"
      className="relative overflow-hidden min-h-[calc(100dvh-64px)] flex flex-col justify-center py-8 sm:py-12 bg-[#faf9f5] border-b border-[#e6dfd8]"
    >
      {/* Background Motif Ukiran Batik Tidung Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-pattern-tidung" />
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d5cbc1_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      {/* ── Modal Pratinjau Document/Gambar ── */}
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
                    <span>Unduh File</span>
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

              {/* Viewer Iframe PDF / Gambar */}
              <div className="flex-1 bg-[#525659] relative flex items-center justify-center p-2 overflow-auto">
                {previewDoc.filePath.endsWith(".pdf") ? (
                  <iframe
                    src={`${previewDoc.filePath}#toolbar=1`}
                    className="w-full h-full border-none"
                    title={previewDoc.title}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewDoc.filePath}
                    alt={previewDoc.title}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid 2 Kolom Simetris Kiri & Kanan (Desktop 6:6) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-items-center">
          
          {/* ────── SISI KIRI: Carousel 3D Publikasi ────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex flex-col items-center space-y-4"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[#141413] text-center tracking-tight">
              Publikasi
            </h3>

            {/* Container Carousel 3D Publikasi */}
            <div className="relative w-full max-w-[420px] h-[320px] sm:h-[360px] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                {visiblePubs.map(({ doc, pos, realIndex }) => {
                  const isCenter = pos === "center";
                  const isLeft = pos === "left";

                  return (
                    <motion.div
                      key={doc.id}
                      onClick={() => setPubIndex(realIndex)}
                      className={`absolute w-[160px] sm:w-[190px] aspect-[9/16] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out border-2 ${
                        isCenter
                          ? "z-20 scale-100 opacity-100 border-emerald-700 shadow-2xl translate-x-0"
                          : isLeft
                          ? "z-10 scale-85 opacity-40 hover:opacity-75 border-[#e6dfd8] shadow-md -translate-x-[95px] sm:-translate-x-[120px]"
                          : "z-10 scale-85 opacity-40 hover:opacity-75 border-[#e6dfd8] shadow-md translate-x-[95px] sm:translate-x-[120px]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doc.coverImagePath}
                        alt={`Sampul ${doc.title}`}
                        className="w-full h-full object-cover object-top"
                      />

                      {/* Overlay Tombol Aksi Center */}
                      {isCenter && (
                        <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2 backdrop-blur-[2px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewDoc(doc);
                            }}
                            className="w-full py-2 px-2 bg-white hover:bg-emerald-50 text-[#141413] hover:text-emerald-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Pratinjau PDF</span>
                          </button>

                          <a
                            href={doc.filePath}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-2 px-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh PDF</span>
                          </a>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Judul & Indikator Posisi Publikasi */}
            <div className="text-center space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#141413] truncate max-w-[280px]">
                {activePub.title} ({activePub.year})
              </h4>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {ALL_PUBLIKASI.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPubIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === pubIndex
                        ? "w-6 bg-emerald-700"
                        : "w-2 bg-[#d5cbc1] hover:bg-[#b0a498]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ────── SISI KANAN: Carousel 3D Infografis ────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="w-full flex flex-col items-center space-y-4"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[#141413] text-center tracking-tight">
              Infografis
            </h3>

            {/* Container Carousel 3D Infografis */}
            <div className="relative w-full max-w-[420px] h-[320px] sm:h-[360px] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                {visibleInfos.map(({ doc, pos, realIndex }) => {
                  const isCenter = pos === "center";
                  const isLeft = pos === "left";

                  return (
                    <motion.div
                      key={doc.id}
                      onClick={() => setInfoIndex(realIndex)}
                      className={`absolute w-[160px] sm:w-[190px] aspect-[9/16] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out border-2 ${
                        isCenter
                          ? "z-20 scale-100 opacity-100 border-[#cc785c] shadow-2xl translate-x-0"
                          : isLeft
                          ? "z-10 scale-85 opacity-40 hover:opacity-75 border-[#e6dfd8] shadow-md -translate-x-[95px] sm:-translate-x-[120px]"
                          : "z-10 scale-85 opacity-40 hover:opacity-75 border-[#e6dfd8] shadow-md translate-x-[95px] sm:translate-x-[120px]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doc.coverImagePath}
                        alt={`Sampul ${doc.title}`}
                        className="w-full h-full object-cover object-top"
                      />

                      {/* Overlay Tombol Aksi Center */}
                      {isCenter && (
                        <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2 backdrop-blur-[2px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewDoc(doc);
                            }}
                            className="w-full py-2 px-2 bg-white hover:bg-orange-50 text-[#141413] hover:text-[#cc785c] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-[#cc785c]" />
                            <span>Lihat Infografis</span>
                          </button>

                          <a
                            href={doc.filePath}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-2 px-2 bg-[#cc785c] hover:bg-[#b05f45] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh Gambar</span>
                          </a>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Judul & Indikator Posisi Infografis */}
            <div className="text-center space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#141413] truncate max-w-[280px]">
                {activeInfo.title} ({activeInfo.year})
              </h4>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {ALL_INFOGRAFIS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInfoIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === infoIndex
                        ? "w-6 bg-[#cc785c]"
                        : "w-2 bg-[#d5cbc1] hover:bg-[#b0a498]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}




