# VendorWise AHP

<strong>Sistem Pendukung Keputusan Pemilihan Pemasok Bahan Baku</strong>
<br />
Berbasis metode <em>Analytic Hierarchy Process</em> (AHP) — Saaty

  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2.4-black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7-2D3748" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-18-336791" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8" />

## Daftar Isi

- [Tentang](#tentang)
- [Fitur](#fitur)
- [Tumpukan Teknologi](#tumpukan-teknologi)
- [Prasyarat](#prasyarat)
- [Panduan Instalasi](#panduan-instalasi)
- [Arsitektur](#arsitektur)
- [Alur AHP](#alur-ahp)
- [Peran Pengguna](#peran-pengguna)
- [Skrip](#skrip)
- [API Documentation](#api-documentation)
- [Lanjutan](#lanjutan)

## Tentang

**VendorWise AHP** adalah aplikasi web berbasis Sistem Pendukung Keputusan (SPK) yang membantu proses pemilihan pemasok bahan baku menggunakan metode **Analytic Hierarchy Process (AHP)**.

Aplikasi ini memungkinkan pengguna untuk:

- Mendefinisikan kriteria penilaian (dengan hierarki bertingkat)
- Mendaftarkan pemasok yang akan dievaluasi
- Melakukan perbandingan berpasangan antar kriteria dan antar pemasok menggunakan skala Saaty 1–9
- Menghitung bobot prioritas, Consistency Ratio (CR), skor akhir, dan peringkat pemasok
- Menampilkan hasil dalam bentuk grafik dan tabel
- Mengekspor laporan ke PDF dan Excel

## Fitur

### Autentikasi & Manajemen Pengguna

| Fitur                      | Deskripsi                                         |
| -------------------------- | ------------------------------------------------- |
| Registrasi Akun            | Pendaftaran pengguna baru (nama, email, password) |
| Login / Logout             | Autentikasi menggunakan email dan password (JWT)  |
| Manajemen Profil           | Ubah nama, email, atau password                   |
| Manajemen Pengguna (Admin) | CRUD pengguna, reset password, ubah peran         |

### Manajemen Data Master

| Fitur                      | Deskripsi                                                           |
| -------------------------- | ------------------------------------------------------------------- |
| Kriteria (hierarki CRUD)   | Input nama, deskripsi, level hierarki (0 = utama, 1+ = subkriteria) |
| Visualisasi Pohon Kriteria | Tampilan parent-child bertingkat                                    |
| Pemasok (CRUD)             | Input nama, alamat, kontak, telepon, email                          |
| Tabel Pemasok              | Tabel dengan pencarian dan filter                                   |

### Perbandingan Berpasangan (AHP Input)

| Fitur                         | Deskripsi                                                   |
| ----------------------------- | ----------------------------------------------------------- |
| Matriks Perbandingan Kriteria | Form interaktif skala Saaty 1–9, hanya sisi atas (simetris) |
| Nilai Kebalikan Otomatis      | Nilai reciprocal 1/x tampil otomatis di sel simetris        |
| Simpan Draft Otomatis         | Setiap perubahan nilai langsung disimpan (debouce 800ms)    |
| Matriks Perbandingan Pemasok  | Per kriteria, isi perbandingan antar pemasok                |
| Navigasi per Kriteria         | Dropdown pilih kriteria untuk mengisi matriks pemasok       |
| Progress Bar                  | Indikator jumlah perbandingan yang sudah diisi              |

### Perhitungan AHP & Analisis Konsistensi

| Fitur                    | Deskripsi                                       |
| ------------------------ | ----------------------------------------------- |
| Bobot Prioritas Kriteria | Eigenvector dari matriks perbandingan           |
| Consistency Ratio (CR)   | λmax, CI, CR — dengan tabel RI Saaty n=1..15    |
| Bobot Prioritas Pemasok  | Eigenvector untuk setiap kriteria               |
| Skor Akhir Pemasok       | Weighted sum: Σ(bobot kriteria × bobot pemasok) |
| Peringkat Pemasok        | Urut dari skor tertinggi ke terendah            |

### Dashboard & Visualisasi

| Fitur                           | Deskripsi                                                       |
| ------------------------------- | --------------------------------------------------------------- |
| Horizontal Bar Chart (Kriteria) | Bobot prioritas kriteria                                        |
| Stacked Bar Chart (Pemasok)     | Bobot pemasok per kriteria                                      |
| Tabel Peringkat                 | Peringkat, nama pemasok, skor akhir, rincian per kriteria       |
| Peringatan Konsistensi          | Alert hijau/kuning jika CR > 0.1                                |
| Ekspor PDF                      | Laporan multi-page (bobot kriteria → bobot pemasok → peringkat) |
| Ekspor Excel                    | 3 sheet: Bobot Kriteria, Bobot Pemasok, Peringkat Akhir         |
| Riwayat Perhitungan             | Snapshot JSON otomatis setiap kali hitung AHP                   |

### REST API

| Endpoint                      | Method         | Deskripsi                                 |
| ----------------------------- | -------------- | ----------------------------------------- |
| `/api/criteria`               | GET/POST       | CRUD kriteria                             |
| `/api/criteria/[id]`          | GET/PUT/DELETE | Detail, update, hapus kriteria            |
| `/api/suppliers`              | GET/POST       | CRUD pemasok                              |
| `/api/suppliers/[id]`         | GET/PUT/DELETE | Detail, update, hapus pemasok             |
| `/api/comparisons/criteria`   | GET/POST       | Ambil/simpan matriks kriteria             |
| `/api/comparisons/supplier`   | GET/POST       | Ambil/simpan matriks pemasok per kriteria |
| `/api/ahp/calculate-criteria` | POST           | Hitung eigenvector & CR kriteria          |
| `/api/ahp/calculate-supplier` | POST           | Hitung eigenvector pemasok per kriteria   |
| `/api/ahp/final-score`        | GET            | Skor akhir & peringkat                    |

## Tumpukan Teknologi

### Frontend & Backend

| Teknologi            | Versi  | Keterangan            |
| -------------------- | ------ | --------------------- |
| Next.js              | 16.2.4 | App Router, Turbopack |
| TypeScript           | 5      | Strict mode           |
| Tailwind CSS         | 4      | Utility-first CSS     |
| shadcn/ui + Radix UI | -      | Komponen UI           |
| React                | 19.2.4 | -                     |

### Basis Data

| Teknologi  | Versi | Keterangan                    |
| ---------- | ----- | ----------------------------- |
| PostgreSQL | 18    | Database relasional           |
| Prisma     | 7.7.0 | ORM (query builder + migrasi) |

### Otentikasi

| Teknologi          | Keterangan                 |
| ------------------ | -------------------------- |
| Auth.js (NextAuth) | Credentials Provider + JWT |
| bcryptjs           | Hashing password           |

### Validasi

| Teknologi           | Keterangan               |
| ------------------- | ------------------------ |
| Zod                 | Validasi skema di server |
| React Hook Form     | Form client-side         |
| @hookform/resolvers | Integrasi Zod + RHF      |

### Chart & Ekspor

| Teknologi               | Keterangan                      |
| ----------------------- | ------------------------------- |
| Recharts                | Grafik bobot kriteria & pemasok |
| jsPDF + jspdf-autotable | Ekspor PDF multi-page           |
| SheetJS (xlsx)          | Ekspor Excel (3 sheet)          |

### Utilitas

bcryptjs, Lucide React, Sonner (toast), class-variance-authority, clsx, tailwind-merge

## Prasyarat

- **Node.js** ≥ 20.x
- **PostgreSQL** ≥ 16
- **npm**

## Panduan Instalasi

### 1. Clone repositori

```bash
git clone https://github.com/ReykaMR/vendorwise-ahp.git
cd vendorwise-ahp
```

### 2. Install dependensi

```bash
npm install
```

### 3. Konfigurasi lingkungan

Salin `.env.example` menjadi `.env` dan sesuaikan:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vendorwise_ahp?schema=public"
NEXTAUTH_SECRET="rahasia-random-minimal-32-karakter"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup database

```bash
# Push skema ke database (buat tabel)
npm run db:migrate

# (Opsional) Seed data awal
npm run db:seed

# Atau langsung setup + seed sekaligus
npm run db:setup
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Arsitektur

Aplikasi menggunakan **Layered Architecture** dengan pemisahan tanggung jawab yang ketat:

```
┌─────────────────────────────────────────────────────────────┐
│  UI Layer (Components)                                      │
│  ├── Server Components     — fetching data, rendering       │
│  └── Client Components    — interaktivitas, form, chart     │
├─────────────────────────────────────────────────────────────┤
│  Action Layer (Server Actions / Route Handlers)             │
│  ├── Server Actions        — mutate data dari form          │
│  └── API Routes           — REST endpoint untuk integrasi   │
├─────────────────────────────────────────────────────────────┤
│  Service Layer (Business Logic)                             │
│  ├── AHP Engine            — eigenvector, CR, final score   │
│  ├── Comparison Service    — matrix logic                   │
│  └── Domain Services       — criteria, supplier, user       │
├─────────────────────────────────────────────────────────────┤
│  Repository Layer (Data Access)                             │
│  └── Prisma queries        — akses database                 │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM → PostgreSQL                                    │
└─────────────────────────────────────────────────────────────┘
```

**Aturan:**

- Logika bisnis **hanya** di Service Layer
- Akses database **hanya** di Repository Layer
- Validasi input **wajib** menggunakan Zod sebelum operasi database
- Otorisasi **selalu** diverifikasi di server (tidak hanya client)

## Alur AHP

### Metode

Analytic Hierarchy Process (AHP) oleh Thomas L. Saaty.

### Langkah-langkah

1. **Definisi masalah** — tentukan kriteria dan alternatif (pemasok)
2. **Perbandingan berpasangan** — bangun matriks pairwise untuk kriteria dan pemasok (skala 1–9)
3. **Normalisasi matriks** — bagi setiap elemen dengan jumlah kolomnya
4. **Vektor eigen** — rata-rata baris dari matriks ternormalisasi
5. **λmaks** — rata-rata dari (Awᵢ / wᵢ)
6. **CI** — (λmaks − n) / (n − 1)
7. **CR** — CI / RI (RI dari tabel Saaty n=1..15)
8. **Validasi** — jika CR > 0.10, peringatkan inkonsistensi
9. **Bobot prioritas** — vektor eigen (dinormalisasi)
10. **Skor akhir** — Σ(bobot_kriteria × bobot_pemasok) untuk setiap pemasok
11. **Peringkat** — urutkan pemasok berdasarkan skor akhir (descending)

### Rute Aplikasi

```
Login → Dashboard → Kelola Kriteria → Kelola Pemasok
    → Perbandingan Kriteria → Perbandingan Pemasok
    → Hitung AHP → Lihat Hasil → Ekspor Laporan
```

## Peran Pengguna

| Peran     | Hak Akses                                                                            |
| --------- | ------------------------------------------------------------------------------------ |
| **ADMIN** | Kelola pengguna, kelola pemasok, kelola kriteria, lihat seluruh hasil, kelola sistem |
| **USER**  | Kelola profil sendiri, isi matriks perbandingan, hitung AHP, lihat hasil sendiri     |

## Skrip

| Perintah                 | Deskripsi                              |
| ------------------------ | -------------------------------------- |
| `npm run dev`            | Memulai development server (Turbopack) |
| `npm run build`          | Build production                       |
| `npm run start`          | Menjalankan production server          |
| `npm run lint`           | Menjalankan ESLint                     |
| `npx tsc --noEmit`       | Pemeriksaan tipe TypeScript            |
| `npx prisma generate`    | Membangkitkan Prisma Client            |
| `npx prisma migrate dev` | Membuat dan menerapkan migrasi         |
| `npx prisma studio`      | Membuka Prisma Studio (GUI database)   |
| `npm run db:migrate`     | Push skema ke database                 |
| `npm run db:seed`        | Seed data awal                         |
| `npm run db:setup`       | Setup database + seed                  |
| `npm run db:reset`       | Reset database + setup + seed          |
| `npm run db:truncate`    | Hapus semua data (kecuali user)        |

## API Documentation

Semua endpoint REST API memerlukan autentikasi (session cookie). Gunakan `AuthenticationError` untuk mengecek kegagalan auth.

### Response Format

```json
{
  "data": { ... },
  "error": "pesan error"
}
```

### Data Master

**Kriteria**

```
GET    /api/criteria           → { data: CriteriaTree[] }
POST   /api/criteria           → { data: Criteria }  (ADMIN only)
GET    /api/criteria/[id]      → { data: Criteria }
PUT    /api/criteria/[id]      → { data: Criteria }  (ADMIN only)
DELETE /api/criteria/[id]      → { data: { deleted: true } }  (ADMIN only)
```

**Pemasok**

```
GET    /api/suppliers          → { data: Supplier[] }
POST   /api/suppliers          → { data: Supplier }  (ADMIN only)
GET    /api/suppliers/[id]     → { data: Supplier }
PUT    /api/suppliers/[id]     → { data: Supplier }  (ADMIN only)
DELETE /api/suppliers/[id]     → { data: { deleted: true } }  (ADMIN only)
```

### Perbandingan

```
GET    /api/comparisons/criteria                 → { data: CriteriaMatrix }
POST   /api/comparisons/criteria                 → { data: CriteriaComparison }
GET    /api/comparisons/supplier?criteriaId=xxx  → { data: SupplierMatrix }
POST   /api/comparisons/supplier                 → { data: SupplierComparison }
```

### AHP

```
POST   /api/ahp/calculate-criteria      → { data: PriorityResult }
POST   /api/ahp/calculate-supplier      → { data: PriorityResult }
GET    /api/ahp/final-score             → { data: AHPResult }
```

## Lanjutan

### Peningkatan Mendatang

- Mode simulasi / multi-proyek
- Log audit
- Sistem notifikasi
- Impor data dari Excel
- Dukungan multi-bahasa
- Analitik dashboard lanjutan

### Dokumen Terkait

| Dokumen       | Deskripsi                                                |
| ------------- | -------------------------------------------------------- |
| `AGENTS.md`   | Aturan implementasi dan coding convention untuk AI agent |
| `AUDIT.md`    | Hasil audit implementasi fitur                           |
| `FEATURES.md` | Spesifikasi fitur lengkap dengan status                  |
| `PROJECT.md`  | Dokumentasi proyek lengkap                               |
| `TASK.md`     | Tugas pengembangan per sprint                            |
