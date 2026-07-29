import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DataViewerClient from "./client/DataViewerClient";

/**
 * Halaman Data Desa Cantik (Descan) Buong Baru 2026
 * Server Component yang menampilkan Data Master, Data Perulangan, & Metadata
 */
export default function DataPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413]">
      <Navbar />
      <main id="main-content" className="flex-1 py-10">
        <DataViewerClient />
      </main>
      <Footer />
    </div>
  );
}
