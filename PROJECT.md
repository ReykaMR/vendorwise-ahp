# PROJECT.md

# VendorWise AHP

## Gambaran Proyek

VendorWise AHP adalah aplikasi web berbasis Sistem Pendukung Keputusan (SPK) yang digunakan untuk membantu proses pemilihan pemasok bahan baku menggunakan metode **Analytic Hierarchy Process (AHP)**.

Aplikasi ini memungkinkan pengguna membandingkan beberapa pemasok berdasarkan sejumlah kriteria, menghitung bobot prioritas menggunakan metode AHP, lalu menghasilkan peringkat pemasok secara objektif.

---

# Tujuan Proyek

- Mengelola data pengguna, kriteria (hierarki), dan pemasok
- Melakukan perbandingan berpasangan (pairwise comparison) kriteria dan pemasok dengan skala Saaty 1–9
- Menghitung bobot prioritas eigenvector, Consistency Ratio (CR), skor akhir, dan peringkat
- Menampilkan hasil dalam bentuk tabel, grafik horizontal bar, dan stacked bar
- Mengekspor laporan ke PDF (multi-page) dan Excel (3 sheet)
- Menyediakan REST API untuk integrasi eksternal

---

# Tumpukan Teknologi

**Frontend & Backend**

- Next.js 16 (App Router, Turbopack)
- TypeScript (strict)
- Tailwind CSS 4
- shadcn/ui + Radix UI

**Basis Data**

- PostgreSQL 18
- Prisma 7 ORM

**Otentikasi**

- Auth.js (NextAuth) — Credentials Provider + JWT

**Validasi**

- Zod + React Hook Form + @hookform/resolvers

**Chart & Ekspor**

- Recharts
- jsPDF + jsPDF-AutoTable
- SheetJS (xlsx)

**Utilitas**

- bcryptjs, Lucide React, Sonner, class-variance-authority, clsx, tailwind-merge

---

# Peran Pengguna

## ADMIN

Hak akses: kelola pengguna, kelola pemasok, kelola kriteria, lihat seluruh hasil, kelola sistem.

## USER

Hak akses: kelola profil sendiri, isi matriks perbandingan AHP, hitung hasil, lihat hasil sendiri.

---

# Modul Utama

| Modul                                                    | Status |
| -------------------------------------------------------- | ------ |
| 1. Autentikasi (login, register, logout, profil)         | ✅     |
| 2. Manajemen Pengguna (Admin)                            | ✅     |
| 3. Manajemen Pemasok (CRUD)                              | ✅     |
| 4. Manajemen Kriteria (hierarki CRUD)                    | ✅     |
| 5. Perbandingan Berpasangan (kriteria & pemasok)         | ✅     |
| 6. Mesin AHP (eigenvector, CR, bobot, skor, ranking)     | ✅     |
| 7. Hasil & Visualisasi (tabel, bar chart, stacked chart) | ✅     |
| 8. Ekspor Laporan (PDF & Excel)                          | ✅     |
| 9. REST API (data master, comparisons, AHP)              | ✅     |

---

# Model Basis Data

Proyek ini menggunakan 10 model Prisma:

- `User` — Pengguna
- `Account`, `Session`, `VerificationToken` — NextAuth PrismaAdapter
- `Criteria` — Kriteria (self-referential hierarki)
- `Supplier` — Pemasok
- `CriteriaComparison` — Perbandingan berpasangan kriteria
- `SupplierComparison` — Perbandingan berpasangan pemasok per kriteria
- `CriteriaPriority` — Bobot prioritas kriteria hasil AHP
- `SupplierPriority` — Bobot prioritas pemasok hasil AHP per kriteria

`schema.prisma` adalah sumber kebenaran tunggal untuk struktur basis data.

---

# Alur Aplikasi

1. **Login** → 2. **Dashboard** → 3. **Kelola Kriteria** → 4. **Kelola Pemasok** → 5. **Perbandingan Kriteria** → 6. **Perbandingan Pemasok** → 7. **Hitung AHP** → 8. **Lihat Hasil** → 9. **Ekspor Laporan**

---

# Alur Kerja AHP

1. Bangun matriks perbandingan berpasangan
2. Normalisasi matriks (bagi setiap elemen dengan jumlah kolom)
3. Hitung vektor eigen (rata-rata baris ternormalisasi)
4. Hitung λmaks (rata-rata (Awᵢ / wᵢ))
5. Hitung CI = (λmaks − n) / (n − 1)
6. Hitung CR = CI / RI (RI dari tabel Saaty n=1..15)
7. Jika CR > 0.10 → peringatkan inkonsistensi
8. Bobot prioritas = vektor eigen
9. Skor akhir pemasok = Σ (bobot_kriteria × bobot_pemasok)
10. Urutkan pemasok berdasarkan skor akhir (descending)

---

# Halaman Utama

| Route                   | Akses      |
| ----------------------- | ---------- |
| `/`                     | Publik     |
| `/login`                | Publik     |
| `/register`             | Publik     |
| `/dashboard`            | User/Admin |
| `/profile`              | User/Admin |
| `/settings`             | User/Admin |
| `/criteria`             | User/Admin |
| `/suppliers`            | User/Admin |
| `/comparison/criteria`  | User/Admin |
| `/comparison/suppliers` | User/Admin |
| `/results`              | User/Admin |
| `/history`              | User/Admin |
| `/history/[id]`         | User/Admin |
| `/admin/users`          | Admin      |

---

# Struktur Proyek

```
UI (Component)
    ↓
Server Actions / Route Handlers
    ↓
Service Layer (business logic)
    ↓
Repository Layer (data access)
    ↓
Prisma ORM
    ↓
PostgreSQL
```

Logika bisnis **hanya** di Service Layer. Akses DB **hanya** di Repository Layer.

---

# Prioritas Pengembangan

1. ✅ Otentikasi
2. ✅ Layout dashboard
3. ✅ Manajemen pengguna (admin)
4. ✅ Manajemen pemasok
5. ✅ Manajemen kriteria
6. ✅ Perbandingan berpasangan
7. ✅ Mesin AHP
8. ✅ Hasil & visualisasi
9. ✅ Ekspor laporan
10. ✅ Riwayat Perhitungan

---

# Peningkatan Masa Depan

- Mode simulasi / multi-proyek (lanjutan)
- Mode simulasi / multi-proyek
- Log audit
- Sistem notifikasi
- Dukungan multi-bahasa
- Analitik dashboard lanjutan

---

# Referensi

- **Metode**: Analytic Hierarchy Process (AHP) — Saaty
- **Arsitektur**: Layered Architecture (UI → Action → Service → Repository → Prisma)
- **Framework**: Next.js App Router
- **ORM**: Prisma

Dokumen terkait:

- **AGENTS.md** — Aturan implementasi dan coding convention
- **FEATURES.md** — Spesifikasi fitur lengkap dengan status
- **TASK.md** — Tugas pengembangan per sprint
- **AUDIT.md** — Hasil audit implementasi fitur
