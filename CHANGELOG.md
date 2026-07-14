# Changelog

Semua perubahan penting pada proyek **Jadwal Piket Kantor** akan dicatat di dokumen ini.

---

## [1.1.1] - 2026-07-07

### Perbaikan

#### 1. Label Offset Minggu Sekarang Relatif dari Hari Ini
* **Sebelumnya:** Label "+N Minggu" dihitung dari `START_DATE` (`2026-05-04`), sehingga menampilkan angka yang tidak intuitif (contoh: "+8 Minggu" saat melihat minggu lalu).
* **Sesudah:** Label sekarang dihitung relatif dari **minggu saat ini**, sehingga lebih aktual dan mudah dipahami:
  * Melihat minggu ini → **"Minggu Ini"**
  * Melihat minggu depan → **"+1 Minggu"**
  * Melihat minggu lalu → **"-1 Minggu"**
* **Catatan:** Logika rotasi piket (`absoluteWeekOffset`) **tidak berubah** — perubahan hanya pada label tampilan.

---

### Perubahan File
* `src/App.js`:
  * Menambahkan variabel `relativeWeekOffset` yang dihitung dari selisih minggu tampil dengan minggu hari ini.
  * Mengganti referensi label dari `absoluteWeekOffset` ke `relativeWeekOffset`.

---

## [1.1.0] - 2026-07-06

### Pembaruan & Perubahan

#### 1. Penyesuaian Anggota Piket (Staff Off-boarding & Penjadwalan Baru)
* **Anggota Keluar:** Arief, Adit, dan Sari telah dikeluarkan dari daftar piket.
* **Perubahan Struktur Hari & Kelompok (`PEOPLE_BY_DAY`):**
  * **Senin:** `['Aidil', 'Rivai', 'Saskia', 'Ayu']` (4 orang) - sebelumnya hari Jumat.
  * **Selasa:** `['Aldi', 'Suci', 'Agus']` (3 orang) - sebelumnya hari Senin minus **Arif**.
  * **Rabu:** `['Genta', 'Dita', 'Relli', 'Yoga']` (4 orang) - sebelumnya hari Selasa.
  * **Kamis:** `['Ihwan', 'Angel', 'Bobby']` (3 orang) - sebelumnya hari Rabu minus **Adit**.
  * **Jumat:** `['Reza', 'Dani', 'Hanifah', 'Nana']` (4 orang) - sebelumnya hari Kamis.

#### 2. Logika Perputaran Tugas (Rolling) Dinamis
* **Aturan Khusus Selasa & Kamis (3 Orang Piket):**
  * Tugas **Ngepel** ditiadakan (`-`).
  * Tiga tugas sisanya (**Nyapu 1**, **Nyapu 2**, **Cuci Piring**) di-rolling secara bergantian menggunakan modulo dinamis sejumlah anggota yang aktif pada hari tersebut (`% 3`).
* **Hari Lain (Senin, Rabu, Jumat):**
  * Tetap bergulir dengan 4 tugas penuh secara berputar (modulo `% 4`).

---

### Perubahan File
* `src/App.js`:
  * Memperbarui array `PEOPLE_BY_DAY`.
  * Memperbarui logika penentuan petugas (`assignedPerson`) agar mendukung pengecualian hari Selasa dan Kamis serta pembagian tugas yang adil tanpa ada slot kosong di antara tugas aktif.
