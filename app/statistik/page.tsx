import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatistikDashboard from "./client/StatistikDashboard";

/**
 * Halaman Statistik Desa Cantik (Descan) Buong Baru 2026
 * Server Component yang memuat Dashboard Statistik
 */
export default function StatistikPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413] relative">
      <Navbar />
      <main id="main-content" className="flex-1 py-10 relative overflow-hidden">
        {/* Background Motif Ukiran Batik Tidung Accent */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-pattern-tidung" />
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d5cbc1_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        <div className="relative z-10">
          <StatistikDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
