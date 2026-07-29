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
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413]">
      <Navbar />
      <main id="main-content" className="flex-1 py-10">
        <StatistikDashboard />
      </main>
      <Footer />
    </div>
  );
}
