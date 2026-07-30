import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desa Cantik Desa Buong Baru",
  description: "Portal Statistik dan Informasi Desa Cantik Desa Buong Baru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        {/* Background Motif Ukiran Batik Tidung Global */}
        <div className="fixed inset-0 pointer-events-none opacity-18 mix-blend-multiply bg-pattern-tidung z-0" />
        <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d5cbc1_1.5px,transparent_1.5px)] [background-size:24px_24px] z-0" />
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
