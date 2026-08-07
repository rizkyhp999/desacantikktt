import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CeritaView from "./client/CeritaView";

export const metadata: Metadata = {
  title: "Cerita Kami | Desa Cinta Statistik (Descan) Buong Baru",
  description:
    "Catatan perjalanan dan dokumentasi foto kegiatan Komunitas Desa Cinta Statistik Buong Baru bersama BPS Kabupaten Tana Tidung dan Mahasiswa KKN dalam melakukan pendataan presisi 100% dari rumah ke rumah.",
};


/**
 * Server Component Halaman Cerita Kami
 */
export default function CeritaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413] relative">
      <Navbar />
      <main id="main-content" className="flex-1 relative overflow-hidden">
        {/* Background Motif Ukiran Batik Tidung Accent */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-pattern-tidung" />
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d5cbc1_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        <div className="relative z-10">
          <CeritaView />
        </div>
      </main>
      <Footer />
    </div>
  );
}
