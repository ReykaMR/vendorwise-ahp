# TASK.md

## Sprint 1 - Fondasi Proyek ✅

| Tugas                                                                                                                | Status |
| -------------------------------------------------------------------------------------------------------------------- | ------ |
| Setup dependensi & variabel lingkungan                                                                               | ✅     |
| Konfigurasi Prisma + PostgreSQL + migrasi                                                                            | ✅     |
| Generate Prisma Client                                                                                               | ✅     |
| Auth.js (Credentials, JWT, middleware, role guard)                                                                   | ✅     |
| Komponen UI: Button, Input, Card, Dialog, Table, Select, Label, Avatar, Alert, Sheet, Separator, Field, DropdownMenu | ✅     |
| Layout: Sidebar, Topbar, Footer, UserNav, MobileSidebar                                                              | ✅     |
| Dokumentasi: README, AGENTS.md, PROJECT.md, TASK.md, FEATURES.md                                                     | ✅     |

## Sprint 2 - Otentikasi & Admin Pengguna ✅

| Tugas                                                                               | Status |
| ----------------------------------------------------------------------------------- | ------ |
| Halaman Login - `/login`                                                            | ✅     |
| Halaman Register - `/register`                                                      | ✅     |
| Logout                                                                              | ✅     |
| Manajemen Profil - `/profile` (ubah nama/email/password)                            | ✅     |
| Server Actions: auth, profile                                                       | ✅     |
| CRUD Pengguna Admin - `/admin/users` (create, read, update, delete, reset password) | ✅     |
| Middleware proteksi rute                                                            | ✅     |

---

## Sprint 3 - Manajemen Data Master ✅

### Task 3.1 - Manajemen Pemasok ✅

- [x] Buat `services/supplier.service.ts`
- [x] Buat `repositories/supplier.repository.ts`
- [x] Buat `lib/validations/supplier.validation.ts`
- [x] Buat `app/actions/supplier.actions.ts`
- [x] Buat `app/(dashboard)/suppliers/page.tsx`
- [x] Buat `app/(dashboard)/suppliers/new/page.tsx`
- [x] Buat `app/(dashboard)/suppliers/[id]/edit/page.tsx`
- [x] Buat komponen: SupplierForm, SuppliersDataTable, DeleteSupplierDialog

### Task 3.2 - Service & Repository Layer (Arsitektur) ✅

- [x] Buat folder `services/`, `repositories/`
- [x] Pindahkan akses Prisma dari action ke repository pattern
- [x] Service/Repository untuk Pemasok
- [x] Service/Repository untuk Kriteria

### Task 3.3 - Manajemen Kriteria ✅

- [x] Buat `services/criteria.service.ts` & `repositories/criteria.repository.ts`
- [x] Buat `lib/validations/criteria.validation.ts`
- [x] Buat `app/actions/criteria.actions.ts`
- [x] Buat `app/(dashboard)/criteria/` (list, new, edit)
- [x] Buat komponen: CriteriaForm, CriteriaTree, DeleteCriteriaDialog

### Task 3.4 - Perbaikan Halaman Eksisting ✅

- [x] Landing page (`/`) - redesign hero, features, workflow, CTA
- [x] Dashboard (`/dashboard`) - real data counts, AHP status
- [x] Toast/Sonner - install `sonner`, buat komponen `Toaster`, pasang di root layout

---

## Sprint 4 - Perbandingan Berpasangan, Mesin AHP, Hasil & Laporan ✅

### Task 4.1 - Perbandingan Berpasangan Kriteria ✅

- [x] Buat `repositories/comparison.repository.ts` - Prisma access untuk CriteriaComparison & SupplierComparison
- [x] Buat `services/comparison.service.ts` - logika penyimpanan/pembacaan matriks
- [x] Buat `lib/validations/comparison.validation.ts` - Zod schemas untuk skala Saaty 1/9–9
- [x] Buat `app/actions/comparison.actions.ts` - server actions untuk save/load matriks
- [x] Buat `app/(dashboard)/comparison/criteria/page.tsx` - halaman input matriks
- [x] Buat komponen `CriteriaMatrix.tsx` - form matriks interaktif, upper triangle editable
- [x] Buat komponen `MatrixCell.tsx` - cell dropdown dengan 17 nilai Saaty + deskripsi
- [x] Simpan Draft Otomatis - auto-save per-cell dengan debounce 800ms + toast
- [x] Tampilkan Nilai Kebalikan - reciprocal 1/x otomatis di sel simetris + format `"1/N"`

### Task 4.2 - Perbandingan Berpasangan Pemasok ✅

- [x] Buat `app/(dashboard)/comparison/suppliers/page.tsx` - halaman input per kriteria
- [x] Buat komponen `SupplierMatrix.tsx` - matriks pemasok dengan navigasi dropdown
- [x] Buat komponen `CriteriaNavigator.tsx` - dropdown pilih kriteria
- [x] Simpan Draft Otomatis - sama seperti kriteria (800ms, per-cell key `"${criteriaId}:..."`)

### Task 4.3 - Mesin AHP ✅

- [x] Buat `lib/ahp/matrix.ts` - buildPairwiseMatrix, normalizeColumns, multiplyMatrixVector
- [x] Buat `lib/ahp/eigenvector.ts` - hitung eigenvector (rata-rata baris ternormalisasi)
- [x] Buat `lib/ahp/consistency.ts` - λmax, CI, CR, RI table n=1..15
- [x] Buat `lib/ahp/priority.ts` - hitung bobot prioritas dari matriks
- [x] Buat `lib/ahp/final-score.ts` - weighted sum: Σ(bobot_kriteria × bobot_pemasok)
- [x] Buat `services/ahp.service.ts` - orchestrator 3 langkah + getLastResults
- [x] Buat `app/actions/ahp.actions.ts` - server actions untuk trigger perhitungan
- [x] Buat logika peringatan jika CR > 0.1 (inkonsisten)

### Task 4.4 - Halaman Hasil & Visualisasi ✅

- [x] Install library chart (recharts)
- [x] Buat `app/(dashboard)/results/page.tsx` - halaman utama hasil
- [x] Buat komponen `ResultTable.tsx` - tabel peringkat (Rank, Nama Pemasok, Skor Akhir)
- [x] Buat komponen `CriteriaWeightChart.tsx` - horizontal bar chart bobot kriteria
- [x] Buat komponen `SupplierScoreChart.tsx` - stacked horizontal bar chart per kriteria
- [x] Buat komponen `ConsistencyAlert.tsx` - peringatan jika CR > 0.1 dengan saran revisi

### Task 4.5 - Ekspor Laporan ✅

- [x] Install library (jspdf + jspdf-autotable untuk PDF, xlsx untuk Excel)
- [x] Buat `lib/export/pdf.ts` - generate PDF laporan hasil (multi-page)
- [x] Buat `lib/export/excel.ts` - generate Excel laporan hasil (3 sheet)
- [x] Buat komponen `ExportButtons.tsx` - tombol export PDF & Excel di halaman hasil

### Task 4.6 - API Routes ✅

- [x] Buat `app/api/criteria/route.ts` - GET all, POST create
- [x] Buat `app/api/criteria/[id]/route.ts` - GET, PUT, DELETE
- [x] Buat `app/api/suppliers/route.ts` - GET all, POST create
- [x] Buat `app/api/suppliers/[id]/route.ts` - GET, PUT, DELETE
- [x] Buat `app/api/comparisons/criteria/route.ts` - GET matriks, POST simpan
- [x] Buat `app/api/comparisons/supplier/route.ts` - GET per kriteria, POST simpan
- [x] Buat `app/api/ahp/calculate-criteria/route.ts` - POST hitung eigenvector & CR
- [x] Buat `app/api/ahp/calculate-supplier/route.ts` - POST hitung eigenvector pemasok
- [x] Buat `app/api/ahp/final-score/route.ts` - GET skor akhir & peringkat

### Task 4.7 - Polish & Fitur Tambahan ✅

- [x] Buat halaman `/settings` - info akun
- [x] Notifikasi Inkonsistensi - `ConsistencyAlert.tsx` hijau/kuning
- [x] Validasi Input Real-time AHP - dropdown only 17 nilai Saaty, zod guard
- [x] Validation Progress - `ComparisonProgress.tsx` (X dari Y terisi)

> **Catatan**: Dark mode sempat diimplementasikan lalu dihapus sesuai permintaan.

---

# Kriteria Penerimaan Sprint 4

Sprint 4 selesai jika:

- [x] Input matriks perbandingan kriteria berfungsi - nilai 1–9, melihat kebalikan, auto-save
- [x] Input matriks perbandingan pemasok berfungsi - pilih kriteria, isi matriks, auto-save
- [x] Perhitungan AHP (eigenvector, CI, CR, bobot prioritas) benar
- [x] Skor akhir dan peringkat pemasok tergenerate
- [x] Halaman `/results` menampilkan tabel peringkat dan grafik
- [x] Ekspor PDF & Excel dapat diunduh
- [x] API Routes untuk data master dan AHP dapat diakses
- [x] Proyek build tanpa error (`npm run build`)
- [x] Tidak ada error TypeScript (`npx tsc --noEmit`)
- [x] Tidak ada error ESLint (`npm run lint`)

---

# Di Luar Cakupan (Future Sprint)

- Riwayat Perhitungan ✅ - sudah diimplementasikan
- Mode Simulasi / multi-proyek - butuh model baru
- Log audit
- Sistem notifikasi
- Impor Excel
- Dukungan multi-bahasa
- Analitik dashboard lanjutan
