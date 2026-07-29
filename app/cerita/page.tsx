import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CeritaView from "./client/CeritaView";

export const metadata: Metadata = {
  title: "Cerita Kami | Desa Cinta Statistik (Descan) Buong Baru",
  description:
    "Catatan perjalanan dan dokumentasi foto kegiatan kader Desa Cinta Statistik Buong Baru bersama BPS Kabupaten Tana Tidung dan Mahasiswa KKN dalam melakukan pendataan presisi 100% dari rumah ke rumah.",
};

/**
 * Server Component Halaman Cerita Kami
 */
export default function CeritaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413]">
      <Navbar />
      <main id="main-content" className="flex-1 bg-white">
        <CeritaView />
      </main>
      <Footer />
    </div>
  );
}
