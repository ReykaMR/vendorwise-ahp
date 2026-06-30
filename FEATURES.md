# FEATURES.md

# Spesifikasi Fitur VendorWise AHP

Dokumen ini menjelaskan seluruh fitur yang direncanakan dalam aplikasi VendorWise AHP.
Status implementasi dicantumkan di samping setiap fitur.

---

## 1. Autentikasi & Manajemen Pengguna

| Fitur                      | Status | Deskripsi                                                 | Aktor       |
| -------------------------- | ------ | --------------------------------------------------------- | ----------- |
| Registrasi Akun            | ✅     | Pendaftaran pengguna baru (nama, email, password).        | Semua       |
| Login / Logout             | ✅     | Autentikasi menggunakan email dan password (JWT/session). | Semua       |
| Manajemen Profil           | ✅     | Ubah nama, email, atau password.                          | User, Admin |
| Manajemen Pengguna (Admin) | ✅     | CRUD pengguna, reset password, ubah peran.                | Admin       |

---

## 2. Manajemen Data Master

| Fitur             | Status | Deskripsi                                                               | Aktor       |
| ----------------- | ------ | ----------------------------------------------------------------------- | ----------- |
| **Kriteria**      |        |                                                                         |             |
| Tambah Kriteria   | ✅     | Input nama, deskripsi, dan level hierarki (0 = utama, 1 = subkriteria). | User, Admin |
| Edit Kriteria     | ✅     | Ubah data kriteria.                                                     | User, Admin |
| Hapus Kriteria    | ✅     | Hapus kriteria (cascade ke perbandingan & prioritas).                   | User, Admin |
| Tampilan Hierarki | ✅     | Visualisasi pohon kriteria (parent‑child).                              | User, Admin |
| **Pemasok**       |        |                                                                         |             |
| Tambah Pemasok    | ✅     | Input nama, alamat, kontak, telepon, email.                             | User, Admin |
| Edit Pemasok      | ✅     | Ubah data pemasok.                                                      | User, Admin |
| Hapus Pemasok     | ✅     | Hapus pemasok (cascade ke perbandingan & prioritas).                    | User, Admin |
| Daftar Pemasok    | ✅     | Tabel dengan pencarian dan filter.                                      | User, Admin |

---

## 3. Proses Perbandingan Berpasangan (AHP Input)

| Fitur                              | Status | Deskripsi                                                                          | Aktor |
| ---------------------------------- | ------ | ---------------------------------------------------------------------------------- | ----- |
| Input Matriks Kriteria             | ✅     | Form interaktif dengan skala Saaty 1‑9, hanya satu sisi matriks (karena simetris). | User  |
| Simpan Draft Otomatis              | ✅     | Setiap perubahan nilai langsung disimpan ke database (tanpa tombol submit).        | User  |
| Tampilkan Nilai Kebalikan          | ✅     | Nilai kebalikan (1/x) otomatis muncul di sel simetris.                             | User  |
| Input Matriks Pemasok per Kriteria | ✅     | Untuk setiap kriteria, isi perbandingan antar pemasok.                             | User  |
| Navigasi per Kriteria              | ✅     | Pilih kriteria dari dropdown/tab untuk mengisi matriksnya.                         | User  |
| Simpan Otomatis (Pemasok)          | ✅     | Sama seperti kriteria.                                                             | User  |

---

## 4. Perhitungan AHP & Analisis Konsistensi

| Fitur                                       | Status | Deskripsi                                                                                   | Aktor                 |
| ------------------------------------------- | ------ | ------------------------------------------------------------------------------------------- | --------------------- |
| Hitung Bobot Prioritas Kriteria             | ✅     | Menghitung eigenvector dari matriks perbandingan kriteria, menghasilkan `CriteriaPriority`. | User (trigger manual) |
| Hitung Consistency Ratio (CR) Kriteria      | ✅     | Hitung λmax, CI, dan CR. Tampilkan status konsisten (CR < 0.1) atau tidak.                  | User                  |
| Hitung Bobot Prioritas Pemasok per Kriteria | ✅     | Hitung eigenvector untuk setiap matriks perbandingan pemasok.                               | User                  |
| Hitung Skor Akhir Pemasok                   | ✅     | Weighted sum: Σ (bobot kriteria × bobot pemasok pada kriteria tersebut).                    | User                  |
| Ranking Pemasok                             | ✅     | Urutkan pemasok dari skor tertinggi ke terendah.                                            | User                  |

---

## 5. Dashboard & Visualisasi Hasil

| Fitur                             | Status | Deskripsi                                                                | Aktor       |
| --------------------------------- | ------ | ------------------------------------------------------------------------ | ----------- |
| Grafik Bobot Kriteria             | ✅     | Horizontal bar chart bobot prioritas kriteria.                           | User, Admin |
| Grafik Bobot Pemasok per Kriteria | ✅     | Stacked horizontal bar chart bobot pemasok per kriteria.                 | User, Admin |
| Tabel Peringkat Akhir             | ✅     | Tabel dengan kolom: Peringkat, Nama Pemasok, Skor Akhir.                 | User, Admin |
| Ekspor Laporan                    | ✅     | Unduh hasil dalam format PDF (multi-page) / Excel (3 sheet).             | User, Admin |
| Riwayat Perhitungan               | ✅     | `CalculationHistory` model + snapshot JSON. Auto-save di `calculateAll`. | User        |

---

## 6. Fitur Tambahan

| Fitur                    | Status | Deskripsi                                                             | Aktor |
| ------------------------ | ------ | --------------------------------------------------------------------- | ----- |
| Validasi Input Real‑time | ✅     | Cegah nilai di luar skala Saaty 1/9–9, pastikan tidak ada sel kosong. | User  |
| Notifikasi Inkonsistensi | ✅     | Alert jika CR > 0.1 dengan saran revisi.                              | User  |
| Responsive Design        | ✅     | Semua halaman dapat diakses dengan baik di mobile/tablet.             | Semua |
| Dark Mode                | ❌     | Pernah diimplementasikan, lalu dihapus sesuai permintaan.             | Semua |
| Mode Simulasi            | ❌     | Belum ada model proyek/simulasi di Prisma.                            | Admin |

---

## 7. Integrasi Backend (API Routes)

| Endpoint (Contoh)             | Method         | Status | Deskripsi                                    |
| ----------------------------- | -------------- | ------ | -------------------------------------------- |
| `/api/auth/[...nextauth]`     | GET/POST       | ✅     | NextAuth.js untuk autentikasi                |
| `/api/criteria`               | GET/POST       | ✅     | CRUD kriteria                                |
| `/api/criteria/[id]`          | GET/PUT/DELETE | ✅     | Detail, update, hapus kriteria               |
| `/api/suppliers`              | GET/POST       | ✅     | CRUD pemasok                                 |
| `/api/suppliers/[id]`         | GET/PUT/DELETE | ✅     | Detail, update, hapus pemasok                |
| `/api/comparisons/criteria`   | GET/POST       | ✅     | Ambil/simpan matriks kriteria user           |
| `/api/comparisons/supplier`   | GET/POST       | ✅     | Ambil/simpan matriks pemasok per kriteria    |
| `/api/ahp/calculate-criteria` | POST           | ✅     | Hitung eigenvector & CR kriteria             |
| `/api/ahp/calculate-supplier` | POST           | ✅     | Hitung eigenvector pemasok per kriteria      |
| `/api/ahp/final-score`        | GET            | ✅     | Hitung dan kembalikan skor akhir & peringkat |

---

## 8. Halaman Frontend Utama (App Router)

| Route                   | Status | Komponen Halaman              | Fungsi                                   |
| ----------------------- | ------ | ----------------------------- | ---------------------------------------- |
| `/`                     | ✅     | Landing Page                  | Hero, benefit cards, cara kerja, CTA.    |
| `/dashboard`            | ✅     | Dashboard User                | Ringkasan: total data, status AHP.       |
| `/criteria`             | ✅     | Kelola Kriteria               | Tree view + tombol tambah.               |
| `/suppliers`            | ✅     | Kelola Pemasok                | Tabel pencarian + tombol tambah.         |
| `/profile`              | ✅     | Edit Profil                   | Ubah nama, email, password.              |
| `/settings`             | ✅     | Pengaturan                    | Informasi akun.                          |
| `/comparison/criteria`  | ✅     | Matriks Perbandingan Kriteria | Input matriks interaktif + auto-save.    |
| `/comparison/suppliers` | ✅     | Matriks Perbandingan Pemasok  | Pilih kriteria, isi matriks + auto-save. |
| `/results`              | ✅     | Hasil & Peringkat             | Grafik, tabel peringkat, tombol ekspor.  |
| `/admin/users`          | ✅     | Manajemen Pengguna            | CRUD pengguna (admin only).              |

---

> **Legenda Status**: ✅ = Selesai, 🔶 = Sebagian, ❌ = Belum
