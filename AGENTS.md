<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

---

# Standar Kode (Code Standards)

## React & TypeScript (.tsx)

- **Jenis Komponen:** SETIAP file `.tsx` HARUS menggunakan React Functional Component (RFC).
- **Struktur:** Gunakan format `export default function ComponentName() {}`. Jangan gunakan Arrow Function (`const Component = () => {}`) untuk komponen utama.
- **Typing:** Gunakan TypeScript strict mode. Interface untuk props harus didefinisikan secara eksplisit.
- **Prioritas Komponen:** UTAMAKAN penggunaan komponen UI dari Shadcn yang sudah ada di `components/ui/`.
- **PENTING:** Setelah menginstall komponen Shadcn, MODIFIKASI styling-nya agar sesuai dengan gaya Modern Government (border radius sedang, warna formal, bayangan tipis).

## Struktur Folder (Folder Structure)

Proyek ini menggunakan Next.js v16.1.6 (App Router). Struktur folder berikut HARUS diikuti untuk menjaga konsistensi dan skalabilitas:

- `app/`: Direktori utama untuk routing, layout, dan halaman aplikasi.
- `app/(auth)/`: Route group untuk halaman autentikasi (login, register, dll).
- `app/api/`: API Routes (backend endpoints).
- `app/**/client/**`: Folder khusus untuk Client Components yang terkait dengan halaman tertentu (lihat aturan di bawah).
- `components/`: Komponen UI yang dapat digunakan kembali.
- `components/ui/`: Komponen dasar UI (button, input, card, dll) dari Shadcn UI.
- `lib/`: Fungsi utilitas, helpers, dan konfigurasi library pihak ketiga.
- `hooks/`: Custom React Hooks.
- `types/`: Definisi TypeScript interfaces dan types global.
- `styles/`: File CSS global dan module styles tambahan.
- `public/`: Aset statis (gambar, font, ikon).

---

# Aturan Panduan Desain Wajib (Mandatory Design Specification)

- **WAJIB IKUTI `design.md`:** SETIAP pengembangan UI/UX, tata letak, komponen, dan skema warna HARUS SELALU membaca dan mematuhi spesifikasi di [`design.md`](file:///e:/descan/design.md).
- **Pure Light Theme Only:** Aplikasi ini HARUS selalu menggunakan tema terang dengan latar belakang putih bersih (`#ffffff` / `bg-white`), teks dark slate (`#0f172a`), dan aksen hijau formal khas pemerintah (*Emerald*, *Teal*, *Cyan*).
- **Vektor SVG Only:** Selalu gunakan ikon SVG dari `lucide-react`. Dilarang menggunakan emoji sebagai ikon struktural antarmuka.

---

# Aturan Pengembangan Komprehensif (Wajib Dipatuhi)

## Aturan API (API Rules)

- **Wajib Gunakan API:** Selalu gunakan API (Server Actions atau Route Handlers) untuk setiap fungsionalitas backend.
- **Struktur API:** Jika API belum tersedia, wajib membuatnya di dalam direktori `app/api` (untuk Route Handlers) atau file `actions.ts` (untuk Server Actions) dengan struktur yang terorganisir.
- **Penamaan:** Ikuti konvensi penamaan yang konsisten (camelCase untuk fungsi, kebab-case untuk file/url).

## Aturan Client Component (Client Component Rules)

- **Lokasi Folder:** Untuk setiap file `page.tsx` yang memerlukan client component, buat folder `client` di lokasi yang sama dengan file `page.tsx` tersebut.
- **Isolasi:** Semua client component spesifik halaman tersebut HARUS ditempatkan di dalam folder `client` ini. Jangan menyebarnya di root folder halaman.

**Contoh:**

```text
app/
  dashboard/
    page.tsx (Server Component)
    client/ (Folder Client Components)
      UserForm.tsx (Client Component)
      StatsChart.tsx
      Default Component
```

- **Server First:** Secara default, semua file `page.tsx` HARUS diimplementasikan sebagai Server Component.
- **Pengecualian:** Hanya gunakan Client Component jika ada kebutuhan spesifik interaktivitas (hooks, event listeners) dan pisahkan ke dalam komponen terpisah di folder `client/`.

## Struktur Folder Client

Pastikan setiap client component memiliki struktur folder yang jelas dan terisolasi dalam folder `client` masing-masing untuk memudahkan maintenance dan debugging.

## Dokumentasi (Documentation)

- **Komentar Wajib:** Tambahkan komentar dokumentasi (JSDoc) pada setiap API dan client component yang dibuat.
- **Konten Komentar:** Jelaskan fungsi utama, parameter (props), return value, dan contoh penggunaan singkat.

---

# Pustaka UI (UI Library)

- **Shadcn UI:** Terinstall dan dikonfigurasi dengan tema maia.
- **Lokasi Komponen:** `components/ui/`
- **Cara Menambahkan:** Gunakan perintah `npx shadcn@latest add [nama-komponen]`.

---

# Prinsip Desain & Responsivitas (Design & Responsiveness)

- **Mobile First:** Selalu terapkan pendekatan _Mobile First_. Gunakan utility class Tailwind default untuk tampilan mobile, dan gunakan prefix breakpoint (`sm:`, `md:`, `lg:`, dll.) untuk menyesuaikan tampilan pada layar yang lebih besar.
- **Breakpoint Tailwind:** Wajib memanfaatkan breakpoint standar Tailwind CSS untuk memastikan konsistensi responsivitas di seluruh aplikasi. Hindari penggunaan media queries kustom kecuali jika benar-benar diperlukan untuk kasus spesifik.
- **Standar Padding Horizontal (PX):** Gunakan `px-4` (mobile), `sm:px-6` (tablet), dan `lg:px-8` (desktop) secara konsisten untuk semua container utama atau section halaman guna menjaga keselarasan visual (simetri).
- **Lebar Maksimal Konten:** Gunakan class `max-w-7xl mx-auto` untuk membungkus konten utama pada layar lebar agar konten tetap terpusat dan mudah dibaca.

---

# Animasi & State UI (Animations & UI States)

- **Animasi:** Wajib menggunakan `framer-motion` untuk semua interaksi animasi kompleks (misalnya transisi halaman, kemunculan elemen/pop-up, dan efek hover lanjutan) guna memberikan pengalaman pengguna yang dinamis dan premium.
- **Loading State:** Selalu gunakan komponen **Skeleton** (bisa dari Shadcn UI atau custom Tailwind) untuk menampilkan _loading state_ saat data sedang diambil atau diproses. Hindari penggunaan spinner biasa kecuali untuk tombol (button loading).

---

<!-- END:nextjs-agent-rules -->
