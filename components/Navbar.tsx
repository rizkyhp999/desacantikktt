"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  BarChart3, 
  FileText, 
  PieChart, 
  Home, 
  Info,
  Sparkles,
  BookOpen
} from "lucide-react";

/**
 * Interface item navigasi navbar
 */
interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Daftar tautan navigasi utama Desa Cantik Buong Baru
 */
const navigation: NavItem[] = [
  { id: "beranda", name: "Beranda", href: "/", icon: Home },
  { id: "profil", name: "Profil Desa", href: "/profil", icon: Info },
  { id: "cerita", name: "Cerita Kami", href: "/cerita", icon: BookOpen },
  { id: "statistik", name: "Statistik", href: "/statistik", icon: BarChart3 },
  { id: "publikasi", name: "Publikasi", href: "/publikasi", icon: FileText },
  { id: "infografis", name: "Infografis", href: "/infografis", icon: PieChart },
];

/**
 * Komponen Navbar Utama Desa Cantik Buong Baru
 * 
 * Mengikuti Standar UI/UX Pro Max & Panduan Desain (design.md):
 * - Skip to content accessibility link untuk nav keyboard.
 * - Routing Next.js App Router dengan usePathname.
 * - Stagger animation menu mobile & micro-interactions dengan Framer Motion.
 * - WCAG 2.1 AA Compliance (Contrast >4.5:1, aria-current, focus-visible, touch target min 44px).
 * - Warm Canvas (#faf9f5) & Hairline Border (#e6dfd8) sesuai spesifikasi design.md.
 * 
 * @returns {JSX.Element} Header & Navigasi Antarmuka
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Auto-detect scroll position untuk gaya latar belakang navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menangani penutupan menu mobile dengan tombol Escape (WCAG Accessibility)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll saat menu mobile terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#e6dfd8] ${
        scrolled
          ? "bg-[#faf9f5]/92 backdrop-blur-md shadow-xs"
          : "bg-[#faf9f5]"
      }`}
    >
      {/* Skip link untuk aksesibilitas pengguna keyboard */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#cc785c] focus:text-white focus:rounded-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-[#141413] text-xs font-semibold"
      >
        Langsung ke Konten Utama
      </a>

      <nav
        aria-label="Navigasi Utama Desa"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
      >
        {/* Sisi Kiri: Brand Name Text Only */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold tracking-tight transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c] focus-visible:ring-offset-2 rounded-md py-1 px-1.5 flex items-center gap-1.5"
            aria-label="Beranda Desa Cantik Buong Baru"
          >
            <span className="text-[#cc785c]">Desa Cantik</span>
            <span className="text-[#141413]">Buong Baru</span>
          </Link>
        </div>

        {/* Sisi Tengah: Tautan Navigasi Desktop */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navigation.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c] ${
                  isActive
                    ? "text-[#141413] font-semibold bg-[#efe9de]/70"
                    : "text-[#3d3d3a] hover:text-[#141413] hover:bg-[#efe9de]/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#cc785c]" : "text-[#6c6a64]"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#cc785c] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Sisi Kanan: Tombol Toggle Menu Mobile */}
        <div className="flex md:hidden items-center">
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#141413] hover:bg-[#efe9de] active:bg-[#e8e0d2] rounded-lg transition-colors border border-[#e6dfd8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-drawer"
          >
            <motion.div
              initial={false}
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.15 }}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-[#141413]" />
              ) : (
                <Menu className="h-5 w-5 text-[#141413]" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </nav>

      {/* Drawer Menu Mobile (Framer Motion Staggered Animation) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 bg-black/25 backdrop-blur-xs z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Content Drawer */}
            <motion.div
              id="mobile-menu-drawer"
              initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 z-50 bg-[#faf9f5] border-b border-[#e6dfd8] shadow-lg md:hidden overflow-hidden origin-top"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.04,
                      delayChildren: 0.02,
                    },
                  },
                }}
                className="px-4 pt-3 pb-6 space-y-2"
              >
                {/* Header info pada mobile */}
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#6c6a64] border-b border-[#e6dfd8]/60 mb-1">
                  Navigasi Utama
                </div>

                {navigation.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, x: -8 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          setMobileMenuOpen(false);
                        }}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all min-h-[44px] ${
                          isActive
                            ? "bg-[#efe9de] text-[#cc785c] font-semibold"
                            : "text-[#3d3d3a] hover:text-[#141413] hover:bg-[#efe9de]/60 active:bg-[#efe9de]"
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${isActive ? "bg-[#cc785c] text-white" : "bg-[#efe9de] text-[#6c6a64]"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}




