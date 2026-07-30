import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfilDetailView from "./client/ProfilDetailView";

export const metadata: Metadata = {
  title: "Profil Desa Buong Baru | Desa Cinta Statistik (Descan)",
  description:
    "Gambaran umum kondisi, sejarah berdiri, silsilah kepemimpinan Kepala Desa 1900-sekarang, batas geografis, serta sumber penerimaan keuangan APBDes Desa Buong Baru.",
};

/**
 * Server Component Halaman Profil Desa Buong Baru
 */
export default function ProfilPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413] relative">
      <Navbar />
      <main id="main-content" className="flex-1 relative overflow-hidden">
        {/* Background Motif Ukiran Batik Tidung Accent */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-pattern-tidung" />
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d5cbc1_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        <div className="relative z-10">
          <ProfilDetailView />
        </div>
      </main>
      <Footer />
    </div>
  );
}
