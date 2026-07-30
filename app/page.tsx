"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/app/client/HeroSection";
import SummaryStatsSection from "@/app/client/SummaryStatsSection";
import PublicationsAndInfographicsSection from "@/app/client/PublicationsAndInfographicsSection";
import CommunitySection from "@/app/client/CommunitySection";
import Footer from "@/components/Footer";

/**
 * Halaman Utama Desa Cantik Buong Baru 2026
 * Client Component dengan animasi Smooth Staggered Entrance berbasis Framer Motion
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <HeroSection />
          <SummaryStatsSection />
          <PublicationsAndInfographicsSection />
          <CommunitySection />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
