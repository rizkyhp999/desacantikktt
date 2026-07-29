import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnomalyViewerClient from "./client/AnomalyViewerClient";

/**
 * Halaman Analisis Deskriptif & Deteksi Anomali Data Desa
 */
export default function AnomaliPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413]">
      <Navbar />
      <main id="main-content" className="flex-1 py-10">
        <AnomalyViewerClient />
      </main>
      <Footer />
    </div>
  );
}
