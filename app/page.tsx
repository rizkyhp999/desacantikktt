import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/app/client/HeroSection";
import SummaryStatsSection from "@/app/client/SummaryStatsSection";
import PublicationsAndInfographicsSection from "@/app/client/PublicationsAndInfographicsSection";
import CommunitySection from "@/app/client/CommunitySection";
import Footer from "@/components/Footer";

/**
 * Halaman Utama Desa Cantik Buong Baru 2026
 * Server Component yang membungkus Navbar, HeroSection, SummaryStatsSection, PublicationsAndInfographicsSection, CommunitySection, dan Footer
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <SummaryStatsSection />
        <PublicationsAndInfographicsSection />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
