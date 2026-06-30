<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structures may differ from previous releases.

Before writing or modifying any Next.js code:

- Read the relevant documentation under `node_modules/next/dist/docs/` when necessary.
- Follow deprecation warnings.
- Prefer the latest stable APIs.
- Do not assume older Next.js patterns are still valid.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Identitas Proyek

**Nama Proyek**

VendorWise AHP

**Deskripsi**

Sistem Pendukung Keputusan (SPK) berbasis web untuk pemilihan pemasok bahan baku menggunakan metode Analytic Hierarchy Process (AHP).

---

# Tumpukan Teknologi

- Next.js 16 (App Router, Turbopack)
- TypeScript (strict)
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Prisma 7 ORM + PostgreSQL 18
- Auth.js (NextAuth) — Credentials + JWT
- Zod + React Hook Form + @hookform/resolvers
- bcryptjs
- Recharts
- jsPDF + jsPDF-AutoTable + SheetJS (xlsx)
- Lucide React
- Sonner (toast)
- class-variance-authority + clsx + tailwind-merge

---

# Prinsip Umum

Selalu:

- Tulis kode yang bersih, mudah dipelihara, dan siap produksi.
- Ikuti prinsip SOLID.
- Pisahkan logika bisnis dari antarmuka pengguna.
- Utamakan keterbacaan daripada implementasi yang terlalu pintar.
- Gunakan kembali kode yang sudah ada bila memungkinkan.

Jangan pernah:

- Menggunakan `any` kecuali benar-benar tidak dapat dihindari.
- Menduplikasi logika bisnis.
- Mengubah berkas yang tidak terkait.
- Menambahkan dependensi yang tidak perlu.

---

# Arsitektur Proyek

Gunakan lapisan-lapisan berikut secara konsisten:

- **UI** → Komponen React
- **Server Actions / Route Handlers**
- **Service Layer**
- **Repository Layer**
- **Prisma**
- **PostgreSQL**

Logika bisnis hanya boleh berada di dalam Service Layer.

Akses basis data hanya boleh berada di dalam Repository Layer.

Jangan pernah mengakses Prisma langsung dari halaman atau komponen UI.

---

# Konvensi Folder

Gunakan struktur folder berikut secara konsisten:

- `app/` — Halaman (App Router), Route Handlers, Server Actions
- `components/` — Komponen React UI
- `lib/` — Utilitas, validasi Zod, engine AHP, helper export
- `services/` — Lapisan logika bisnis
- `repositories/` — Lapisan akses data (Prisma)
- `types/` — Tipe TypeScript global (next-auth.d.ts)

Jangan membuat folder tingkat atas baru kecuali benar-benar diperlukan.

Folder `features/`, `hooks/`, `utils/` tidak digunakan — simpan logika di folder di atas.

---

# Aturan TypeScript

- Gunakan pengetikan ketat (strict typing).
- Gunakan `type` untuk bentuk objek.
- Gunakan `interface` hanya jika memerlukan perluasan (extension).
- Ekspor tipe eksplisit untuk modul yang digunakan kembali.
- Hindari type assertion yang tidak perlu.

---

# Aturan Validasi

Setiap masukan pengguna harus divalidasi menggunakan Zod.

Validasi harus terjadi sebelum operasi basis data.

Jangan pernah mengandalkan validasi sisi klien saja.

---

# Otentikasi & Otorisasi

Otentikasi:

- Auth.js (Penyedia Kredensial)

Otorisasi:

- Peran: `ADMIN`, `USER`

Selalu verifikasi izin di sisi server.

Jangan pernah mengandalkan otorisasi sisi klien.

---

# Aturan Basis Data

Skema Prisma adalah sumber kebenaran tunggal.

Model yang digunakan (11 model):

- User
- Account, Session, VerificationToken (NextAuth PrismaAdapter)
- Criteria (hierarki self-referential)
- Supplier
- CriteriaComparison, SupplierComparison
- CriteriaPriority, SupplierPriority
- CalculationHistory (riwayat perhitungan AHP)

Jika skema berubah:

1. Perbarui `schema.prisma`
2. Jalankan `npx prisma migrate dev`
3. Jalankan `npx prisma generate`

Jangan mengubah basis data secara manual kecuali benar-benar diminta.

---

# Aturan UI

Gunakan:

- shadcn/ui
- Radix UI

Pertahankan antarmuka yang konsisten di seluruh aplikasi.

Semua teks yang ditampilkan kepada pengguna harus menggunakan **Bahasa Indonesia**.

Kode sumber, variabel, dan komentar harus menggunakan **Bahasa Inggris**.

---

# Penanganan Kesalahan

Selalu:

- Tangani kesalahan yang diharapkan.
- Kembalikan pesan yang ramah pengguna.
- Cegah aplikasi mogok.

Jangan pernah menampilkan jejak tumpukan (stack trace) internal kepada pengguna.

---

# Aturan Keamanan

Selalu:

- Hash kata sandi menggunakan bcryptjs.
- Validasi semua masukan.
- Simpan rahasia di dalam `.env`.
- Lindungi rute yang memerlukan otentikasi.

Jangan pernah:

- Meng-commit `.env`
- Mencatat kata sandi
- Mencatat token
- Mencatat rahasia

---

# Aturan Kerja AI

Sebelum menghasilkan kode:

1. Baca berkas yang terkait dengan tugas.
2. Pertahankan arsitektur yang ada.
3. Gunakan kembali utilitas dan komponen yang sudah ada.
4. Ubah hanya yang diperlukan.
5. Hindari refaktor yang tidak perlu.

Jika persyaratan tidak jelas, mintalah klarifikasi alih-alih menebak.

---

# Gaya Penulisan Kode

Penamaan:

- Komponen → PascalCase
- Fungsi → camelCase
- Variabel → camelCase
- Konstanta → UPPER_SNAKE_CASE

Gunakan nama yang deskriptif.

Hindari singkatan kecuali sudah dipahami secara luas.

---

# Definisi Selesai

Sebuah tugas dianggap selesai hanya jika:

- Proyek berhasil dibangun.
- Tidak ada kesalahan TypeScript.
- Tidak ada kesalahan ESLint.
- Validasi diterapkan.
- Otorisasi diterapkan (jika diperlukan).
- Penanganan kesalahan diterapkan.
- Status memuat diterapkan.
- Fungsionalitas yang ada tidak rusak.

---

# Perintah

| Perintah                 | Deskripsi                      |
| ------------------------ | ------------------------------ |
| `npm run dev`            | Memulai server pengembangan    |
| `npm run build`          | Membangun aplikasi             |
| `npm run lint`           | Menjalankan ESLint             |
| `npx tsc --noEmit`       | Pemeriksaan tipe               |
| `npx prisma generate`    | Membangkitkan Prisma Client    |
| `npx prisma migrate dev` | Membuat dan menerapkan migrasi |
| `npx prisma studio`      | Membuka Prisma Studio          |

---

# Catatan

Dokumen ini mendefinisikan **aturan rekayasa tingkat proyek**.

Persyaratan bisnis, spesifikasi fitur, dan peta jalan pengembangan berada di `PROJECT.md`.

Tugas sprint saat ini berada di `TASK.md`.
