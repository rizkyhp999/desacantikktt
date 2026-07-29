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
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413]">
      <Navbar />
      <main id="main-content" className="flex-1 bg-white">
        <ProfilDetailView />
      </main>
      <Footer />
    </div>
  );
}
