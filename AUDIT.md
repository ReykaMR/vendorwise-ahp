# AUDIT.md

# Audit Implementasi Fitur — VendorWise AHP

> **Tanggal**: 30 Juni 2026
>
> **Status**: 48/50 ✅ Sudah — 0/50 🔶 Sebagian — 2/50 ❌ Belum

---

## 1. Autentikasi & Manajemen Pengguna

| #   | Fitur                    | Status | Catatan                                                                                                                                     |
| --- | ------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | Registrasi Akun          | ✅     | `app/(auth)/register/`, `auth.actions.ts` (registerUser), `user.service.ts` (create + bcrypt), `RegisterForm.tsx`, validasi Zod             |
| 1.2 | Login / Logout           | ✅     | `app/(auth)/login/`, `lib/auth/auth.ts` (Credentials JWT), `LoginForm.tsx`, `LogoutButton.tsx`                                              |
| 1.3 | Manajemen Profil         | ✅     | `app/(dashboard)/profile/`, `profile.actions.ts`, `ProfileForm.tsx`, `ChangePasswordForm.tsx`                                               |
| 1.4 | Manajemen Pengguna Admin | ✅     | `app/(dashboard)/admin/users/` (list/new/edit), `admin.actions.ts`, `UsersDataTable`, `UserForm`, `DeleteUserDialog`, `ResetPasswordDialog` |

## 2. Manajemen Data Master

| #   | Fitur                           | Status | Catatan                                                                                                                          |
| --- | ------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | Kriteria: Tambah                | ✅     | `criteria/new/`, `criteria.actions.ts` (createCriteria), `criteria.service.ts` (auto-level, duplicate check), `CriteriaForm.tsx` |
| 2.2 | Kriteria: Edit                  | ✅     | `criteria/[id]/edit/`, `criteria.actions.ts` (updateCriteria), level recalculation on parent change                              |
| 2.3 | Kriteria: Hapus                 | ✅     | `DeleteCriteriaDialog.tsx` (child count warning), cascade ke comparisons & priorities                                            |
| 2.4 | Kriteria: Tampilan Hierarki     | ✅     | `CriteriaTree.tsx` — recursive tree view dengan expand/collapse, level badges                                                    |
| 2.5 | Pemasok: Tambah                 | ✅     | `suppliers/new/`, `supplier.actions.ts` (createSupplier), `SupplierForm.tsx` (nama, alamat, kontak, telepon, email)              |
| 2.6 | Pemasok: Edit                   | ✅     | `suppliers/[id]/edit/`, `supplier.actions.ts` (updateSupplier)                                                                   |
| 2.7 | Pemasok: Hapus                  | ✅     | `DeleteSupplierDialog.tsx`                                                                                                       |
| 2.8 | Pemasok: Daftar + Search/Filter | ✅     | `SuppliersDataTable.tsx` — tabel dengan real-time search, dropdown actions                                                       |

## 3. Perbandingan Berpasangan (AHP Input)

| #   | Fitur                                | Status | Catatan                                                                                                                                                       |
| --- | ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | Input Matriks Kriteria               | ✅     | `CriteriaMatrix.tsx` — tabel interaktif dengan `<MatrixCell>` (dropdown Saaty 1/9–9). Diagonal readonly (nilai 1), upper triangle editable.                   |
| 3.2 | Simpan Draft Otomatis                | ✅     | Auto-save per-cell dengan debounce 800ms. `Map<string, Timer>` keyed `"rowId:colId"`, cleanup on unmount. Toast "Tersimpan" / "Gagal menyimpan".              |
| 3.3 | Tampilkan Nilai Kebalikan            | ✅     | Reciprocal otomatis di sel simetris (i > j). Format fraksi `"1/N"` untuk nilai < 1 via `formatValue()`.                                                       |
| 3.4 | Input Matriks Pemasok per Kriteria   | ✅     | `SupplierMatrix.tsx` — matriks per kriteria. Repository `findSupplierByUserAndCriteria` / `upsertSupplier`. Service `getSupplierMatrix` / `saveSupplierCell`. |
| 3.5 | Navigasi per Kriteria (dropdown/tab) | ✅     | `CriteriaNavigator.tsx` — dropdown pilih kriteria. Tabs antar halaman criteria/suppliers. `key={criteriaId}` remount.                                         |
| 3.6 | Simpan Otomatis (Pemasok)            | ✅     | Sama seperti kriteria: debounce 800ms, per-cell key `"${criteriaId}:${rowId}:${colId}"`, toast, cleanup.                                                      |

## 4. Perhitungan AHP & Analisis Konsistensi

| #   | Fitur                           | Status | Catatan                                                                                                                                       |
| --- | ------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | Hitung Bobot Prioritas Kriteria | ✅     | `lib/ahp/eigenvector.ts` (row-average of normalized columns). `priority.ts` orchestrator. `ahpService.calculateAll()` step 1 — persist ke DB. |
| 4.2 | Hitung Consistency Ratio (CR)   | ✅     | `lib/ahp/consistency.ts` — λmax, CI, CR. RI table n=1..15 (Saaty). `ConsistencyAlert.tsx` — hijau/kuning alert. Threshold CR < 0.1.           |
| 4.3 | Hitung Bobot Prioritas Pemasok  | ✅     | `ahpService.calculateAll()` step 2 — reuse engine untuk tiap kriteria. Persist via `priorityRepository.upsertSupplier`.                       |
| 4.4 | Hitung Skor Akhir Pemasok       | ✅     | `lib/ahp/final-score.ts` — weighted sum: Σ(bobot_kriteria × bobot_pemasok). `ahpService.calculateAll()` step 3.                               |
| 4.5 | Ranking Pemasok                 | ✅     | `final-score.ts` — sort descending by `totalScore`. `ResultTable.tsx` — Trophy/Medal/Award untuk 3 besar.                                     |

## 5. Dashboard & Visualisasi Hasil

| #   | Fitur                             | Status | Catatan                                                                                                                                                                       |
| --- | --------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1 | Grafik Bobot Kriteria             | ✅     | `CriteriaWeightChart.tsx` — recharts horizontal bar chart dengan persentase.                                                                                                  |
| 5.2 | Grafik Bobot Pemasok per Kriteria | ✅     | `SupplierScoreChart.tsx` — recharts stacked horizontal bar + legend per kriteria.                                                                                             |
| 5.3 | Tabel Peringkat Akhir             | ✅     | `ResultTable.tsx` — kolom Peringkat (ikon), Nama Pemasok, Skor Akhir. Highlight 3 besar.                                                                                      |
| 5.4 | Ekspor Laporan (PDF / Excel)      | ✅     | `lib/export/pdf.ts` (jspdf+autotable, multi-page, footer halaman). `lib/export/excel.ts` (xlsx, 3 sheets). `ExportButtons.tsx`.                                               |
| 5.5 | Riwayat Perhitungan               | ✅     | `CalculationHistory` model + migration. Auto-save snapshot saat `calculateAll`. Halaman `/history` (list) + `/history/[id]` (detail dengan chart & tabel). Sidebar "Riwayat". |

## 6. Fitur Tambahan

| #   | Fitur                    | Status | Catatan                                                                                       |
| --- | ------------------------ | ------ | --------------------------------------------------------------------------------------------- |
| 6.1 | Validasi Input Real-time | ✅     | react-hook-form + zodResolver di semua form master data.                                      |
| 6.2 | Notifikasi Inkonsistensi | ✅     | `ConsistencyAlert.tsx` — alert hijau (CR < 0.1) / kuning (CR ≥ 0.1) + saran revisi.           |
| 6.3 | Responsive Design        | ✅     | Layout grid breakpoints, sidebar desktop + mobile Sheet, tabel scroll horizontal.             |
| 6.4 | Dark Mode                | ❌     | Pernah diimplementasikan, kemudian dihapus sesuai permintaan. Kode dark mode sudah tidak ada. |
| 6.5 | Mode Simulasi            | ❌     | Tidak ada model proyek/simulasi di Prisma schema. Tidak ada di scope Sprint 4.                |

## 7. API Routes

| #   | Endpoint                      | Status | Catatan                                                         |
| --- | ----------------------------- | ------ | --------------------------------------------------------------- |
| 7.1 | `/api/auth/[...nextauth]`     | ✅     | `app/api/auth/[...nextauth]/route.ts` — NextAuth handler.       |
| 7.2 | `/api/criteria` (+ `[id]`)    | ✅     | GET/POST (list/create), GET/PUT/DELETE by ID. Zod + auth guard. |
| 7.3 | `/api/suppliers` (+ `[id]`)   | ✅     | GET/POST (list/create), GET/PUT/DELETE by ID.                   |
| 7.4 | `/api/comparisons/criteria`   | ✅     | GET (matrix), POST (save cell).                                 |
| 7.5 | `/api/comparisons/supplier`   | ✅     | GET (?criteriaId=), POST (save cell).                           |
| 7.6 | `/api/ahp/calculate-criteria` | ✅     | POST — hitung eigenvector & CR kriteria.                        |
| 7.7 | `/api/ahp/calculate-supplier` | ✅     | POST ({criteriaId}) — hitung eigenvector pemasok per kriteria.  |
| 7.8 | `/api/ahp/final-score`        | ✅     | GET — skor akhir & peringkat.                                   |

## 8. Halaman Frontend

| #   | Route                   | Status | Catatan                                               |
| --- | ----------------------- | ------ | ----------------------------------------------------- |
| 8.1 | `/` (Landing)           | ✅     | Hero, benefit cards, cara kerja, CTA, navbar, footer. |
| 8.2 | `/dashboard`            | ✅     | Ringkasan real counts dari DB, sambutan user.         |
| 8.3 | `/criteria`             | ✅     | Tree view hierarki + tombol tambah.                   |
| 8.4 | `/suppliers`            | ✅     | Tabel dengan search + tombol tambah.                  |
| 8.5 | `/profile`              | ✅     | Edit profil + ganti password.                         |
| 8.6 | `/admin/users`          | ✅     | Manajemen pengguna (admin only).                      |
| 8.7 | `/comparison/criteria`  | ✅     | Matriks interaktif perbandingan kriteria.             |
| 8.8 | `/comparison/suppliers` | ✅     | Matriks perbandingan pemasok per kriteria.            |
| 8.9 | `/results`              | ✅     | Grafik, tabel peringkat, tombol hitung + ekspor.      |

---

## Ringkasan

| Kategori                            | Total  | ✅ Sudah | ❌ Belum |
| ----------------------------------- | ------ | -------- | -------- |
| 1. Autentikasi & Manajemen Pengguna | 4      | 4        | 0        |
| 2. Manajemen Data Master            | 8      | 8        | 0        |
| 3. Perbandingan Berpasangan         | 6      | 6        | 0        |
| 4. Perhitungan AHP                  | 5      | 5        | 0        |
| 5. Dashboard & Visualisasi          | 5      | 5        | 0        |
| 6. Fitur Tambahan                   | 5      | 3        | 2        |
| 7. API Routes                       | 8      | 8        | 0        |
| 8. Halaman Frontend                 | 9      | 9        | 0        |
| **Total**                           | **50** | **48**   | **2**    |

---

## Prioritas Pengembangan Selanjutnya

Dari 2 item yang belum:

1. **6.5 — Mode Simulasi**: Memerlukan model proyek (`Project`/`Simulation`) di Prisma, plus UI untuk admin membuat dan mengelola beberapa proyek pemilihan.
2. **6.4 — Dark Mode**: Dihentikan secara sengaja. Dapat diimplementasikan kembali jika diminta.
