# 📋 Product Requirements Document (PRD)
## Sistem Manajemen Penjualan Event — PinTrack

**Versi:** 1.1  
**Tanggal:** 11 November 2026  
**Author:** —  
**Status:** Approved / In Development

---

## 1. Latar Belakang & Tujuan

Penjual pin dan gantungan kunci sering mengikuti event besar (bazaar, festival, pameran) dengan volume transaksi tinggi. Tanpa sistem yang terstruktur, sulit untuk:
- Memantau stok secara real-time selama event
- Menghitung total penjualan dengan aturan harga diskon (3 pcs = Rp10.000)
- Merekap hasil akhir per event secara akurat
- Mencatat dan mengelola pesanan khusus/custom design dari pengunjung (pre-order desain custom) tanpa mengacaukan stok ready booth

**Tujuan Produk:**  
Membangun sistem berbasis **Google Apps Script + Google Spreadsheet** yang memudahkan pengelolaan penjualan pada setiap event — mulai dari perencanaan, pencatatan transaksi real-time (baik produk ready stock maupun pesanan custom design), hingga rekap akhir dalam bentuk PDF.

---

## 2. Pengguna (User)

| Persona | Deskripsi |
|---|---|
| **Penjual (Owner)** | Pengguna utama yang mengelola perencanaan, mencatat transaksi, dan melihat rekap |
| **Kasir / Asisten** | Pengguna yang melakukan input transaksi di halaman Counting selama event berlangsung |

---

## 3. Ruang Lingkup (Scope)

### ✅ In Scope
- Halaman Dashboard
- Halaman Planning (Perencanaan Event, input modal per produk & daftar peserta jualan)
- Halaman Counting:
  - Input Transaksi Reguler (Live Counter Stok Ready)
  - Form Pencatatan Pesanan Custom / Desain Berbeda (Pre-Order / Custom Request)
- Halaman Rekap Hasil (Perhitungan modal, keuntungan bersih, & pembagian hasil per peserta)
- Export PDF rekap & Print View langsung
- Database via Google Spreadsheet (Sheet Events, Transaksi, Pengaturan, PesananKhusus, RekapTemp)

### ❌ Out of Scope
- Sistem pembayaran digital / payment gateway otomatis
- Multi-user role management kompleks
- Notifikasi push otomatis
- Aplikasi mobile native (tetap menggunakan Web App responsif)

---

## 4. Fitur & Persyaratan Fungsional

### 4.1 Dashboard

**Tujuan:** Memberikan gambaran umum status semua event.

| ID | Requirement | Prioritas |
|---|---|---|
| F-01 | Menampilkan daftar event yang telah dibuat (aktif & selesai) | P1 |
| F-02 | Menampilkan ringkasan total pendapatan per event | P1 |
| F-03 | Menampilkan status stok sisa per event (pin & gantungan kunci) | P1 |
| F-04 | Shortcut/tombol cepat ke Planning, Counting, dan Rekap | P2 |
| F-05 | Indikator event yang sedang aktif / berlangsung | P2 |

---

### 4.2 Planning (Perencanaan Event)

**Tujuan:** Mendaftarkan event baru beserta rencana stok produk.

| ID | Requirement | Prioritas |
|---|---|---|
| F-06 | Form input nama event | P1 |
| F-07 | Form input tanggal mulai & tanggal selesai event | P1 |
| F-08 | Form input lokasi/tempat event | P1 |
| F-09 | Form input stok awal **Pin** yang disediakan | P1 |
| F-10 | Form input stok awal **Gantungan Kunci** yang disediakan | P1 |
| F-11 | Form input catatan/deskripsi event (opsional) | P3 |
| F-12 | Tombol simpan yang menyimpan data ke Spreadsheet | P1 |
| F-13 | Daftar event yang sudah direncanakan dapat diedit & dihapus | P2 |
| F-14 | Validasi: stok tidak boleh bernilai negatif atau kosong | P1 |
| F-14a | Form input harga modal per 1 pcs **Pin** (default 0) | P1 |
| F-14b | Form input harga modal per 1 pcs **Gantungan Kunci** (default 0) | P1 |
| F-14c | Form input daftar nama anggota / orang yang ikut berjualan (peserta) | P1 |

---

### 4.3 Counting (Input Transaksi Real-time & Pesanan Custom)

**Tujuan:** Mencatat setiap aktivitas penjualan selama event berlangsung, mencakup transaksi langsung (ready stock) dan pemesanan desain berbeda (custom order / pre-order).

Halaman Counting dibagi menjadi 2 tab / sub-menu kerja:
1. **Transaksi Reguler (Ready Stock):** Transaksi cepat produk yang tersedia di booth dengan pengurangan stok otomatis.
2. **Pesanan Custom (Desain Berbeda):** Formulir pemesanan khusus untuk pengunjung yang menginginkan desain di luar katalog ready stock.

---

#### 4.3.1 Transaksi Reguler (Ready Stock)

##### Aturan Harga:
> - **Harga satuan:** Rp 4.000 / pcs (berlaku untuk Pin & Gantungan Kunci)  
> - **Harga bundel:** Beli **3 pcs** = **Rp 10.000** (berlaku untuk kelipatan 3)  
> - **Mode campuran:** Pin + Gantungan Kunci **dihitung total qty** bersama untuk bundeling  
> - Contoh: 2 Pin + 1 GK = total 3 pcs = **Rp 10.000** ✅ (bukan Rp 8.000 + Rp 4.000)  
> - Contoh: 7 pcs (kombinasi apapun) = (2 × Rp10.000) + (1 × Rp4.000) = **Rp24.000**

| ID | Requirement | Prioritas |
|---|---|---|
| F-15 | Dropdown/selector pilih event yang sedang aktif | P1 |
| F-16 | Form input jenis produk (Pin / Gantungan Kunci / Campuran) | P1 |
| F-17 | Form input jumlah (qty) produk yang dibeli | P1 |
| F-18 | Kalkulasi otomatis total harga berdasarkan aturan harga | P1 |
| F-19 | Preview total harga sebelum transaksi dikonfirmasi | P1 |
| F-20 | Tombol "Konfirmasi Transaksi" untuk menyimpan ke Spreadsheet | P1 |
| F-21 | Tampilan **live counter stok sisa** (Pin & GK) yang otomatis berkurang setelah transaksi | P1 |
| F-22 | Peringatan jika stok mendekati habis (misal: < 10 pcs) | P2 |
| F-23 | Peringatan jika stok habis / transaksi melebihi stok | P1 |
| F-24 | Riwayat transaksi hari ini tampil di bawah form | P2 |
| F-25 | Tombol "Batalkan Transaksi Terakhir" (undo 1 transaksi) | P2 |
| F-26 | Mode campuran: qty Pin + GK **digabung** sebagai total qty untuk kalkulasi bundel | P1 |

##### Logika Kalkulasi Harga (Detail):
```
function hitungHarga(qty):
  bundel = floor(qty / 3)
  sisa   = qty mod 3
  total  = (bundel × 10.000) + (sisa × 4.000)
  return total
```

---

#### 4.3.2 Pesanan Custom / Desain Berbeda (Custom Order)

**Tujuan:** Memberikan kemudahan bagi kasir/penjual untuk mencatat pesanan khusus pengunjung yang membawa desain sendiri, foto wisuda/keluarga, logo komunitas, atau karakter anime yang tidak ada di etalase ready stock.

| ID | Requirement | Prioritas |
|---|---|---|
| F-26a | Tab / Switch mode di halaman Counting untuk membuka form "Pesanan Custom" | P1 |
| F-26b | Form input nama pemesan / customer (wajib) | P1 |
| F-26c | Form input nomor WhatsApp / kontak pemesan (wajib untuk konfirmasi hasil & kirim file) | P1 |
| F-26d | Form pilihan kategori produk custom (Pin / Gantungan Kunci / Keduanya) | P1 |
| F-26e | Form input jumlah pesanan (qty Pin dan/atau qty GK) | P1 |
| F-26f | Form input deskripsi / detail permintaan desain (misal: "Foto wisuda 2 orang background biru", "Logo komunitas X") | P1 |
| F-26g | Form input link referensi desain (URL Google Drive / media sosial / link gambar) | P2 |
| F-26h | Form input kesepakatan total harga (dapat mengikuti harga reguler atau harga custom khusus) | P1 |
| F-26i | Form pilihan status pembayaran (`Belum Bayar`, `DP (Uang Muka)`, `Lunas`) | P1 |
| F-26j | Form input nominal DP (jika memilih opsi DP) | P2 |
| F-26k | Form pilihan metode serah terima (`Ambil di Booth Sebelum Event Usai`, `Kirim via Kurir / Ekspedisi`, `COD`) | P1 |
| F-26l | Form input alamat pengiriman / catatan tambahan (opsional) | P2 |
| F-26m | Tombol "Simpan Pesanan Custom" untuk menyimpan data ke Sheet `PesananKhusus` | P1 |
| F-26n | **Pemisahan Stok:** Pesanan custom **tidak memotong stok ready booth** secara langsung karena diproduksi secara terpisah (made-to-order) | P1 |
| F-26o | Tabel daftar riwayat pesanan custom event aktif yang dapat dipantau langsung di bawah form | P1 |
| F-26p | Opsi update status progres pesanan (`Menunggu Desain`, `Diproses`, `Siap Diambil/Dikirim`, `Selesai`) | P2 |
| F-26q | Tombol cepat WhatsApp (`https://wa.me/...`) untuk menghubungi customer langsung dari tabel pesanan | P2 |

---

### 4.4 Rekap Hasil

**Tujuan:** Menampilkan ringkasan lengkap penjualan per event.

| ID | Requirement | Prioritas |
|---|---|---|
| F-27 | Selector pilih event untuk direkap | P1 |
| F-28 | Tampilkan total penjualan Pin (qty terjual & nominal) | P1 |
| F-29 | Tampilkan total penjualan Gantungan Kunci (qty terjual & nominal) | P1 |
| F-30 | Tampilkan total gabungan (Pin + GK) qty & nominal | P1 |
| F-31 | Tampilkan stok awal, stok terjual, dan stok sisa | P1 |
| F-32 | Tampilkan jumlah total transaksi (jumlah pembeli) | P1 |
| F-33 | Tampilkan pendapatan kotor (omzet) total event | P1 |
| F-34 | Tombol **Lihat & Download PDF** membuka halaman baru berisi rekap terformat (tetap dipertahankan, dilengkapi ringkasan modal, keuntungan bersih, dan tabel pembagian hasil) | P1 |
| F-35 | Riwayat semua transaksi dalam tabel (dapat di-scroll) | P2 |
| F-36 | Grafik/chart distribusi penjualan pin vs GK | P3 |
| F-36a | Tampilkan total modal berdasarkan harga modal per produk: `(qty_pin_terjual × modal_pin) + (qty_gk_terjual × modal_gk)` | P1 |
| F-36b | Tampilkan keuntungan bersih: `Pendapatan Kotor (Omzet) − Total Modal` | P1 |
| F-36c | Tampilkan pembagian hasil: `Keuntungan Bersih ÷ Jumlah Peserta Jualan` beserta tabel daftar nama & nominal yang diterima masing-masing | P1 |

#### Logika Kalkulasi Modal & Pembagian Hasil:
```
function hitungBagiHasil(qtyPinTerjual, qtyGkTerjual, omzet, modalPin, modalGk, daftarPeserta):
  totalModal = (qtyPinTerjual * modalPin) + (qtyGkTerjual * modalGk)
  keuntunganBersih = omzet - totalModal
  jumlahPeserta = daftarPeserta.length
  bagianPerOrang = jumlahPeserta > 0 ? floor(keuntunganBersih / jumlahPeserta) : 0
  return {
    totalModal,
    keuntunganBersih,
    jumlahPeserta,
    bagianPerOrang
  }
```

---

### 4.5 Halaman Tambahan: Pengaturan Harga

**Tujuan:** Fleksibilitas mengubah harga tanpa harus edit kode.

| ID | Requirement | Prioritas |
|---|---|---|
| F-37 | Form edit harga satuan (default: Rp 4.000) | P2 |
| F-38 | Form edit harga bundel dan jumlah minimum bundel (default: 3 pcs = Rp10.000) | P2 |

---

## 5. Persyaratan Non-Fungsional

| Kategori | Requirement |
|---|---|
| **Performa** | Halaman Counting harus merespons input dalam < 2 detik |
| **Ketersediaan** | Berjalan selama ada koneksi internet (Google Apps Script online) |
| **Pengguna** | Single-user (hanya 1 orang input transaksi pada satu waktu) |
| **Kemudahan Pakai** | UI sederhana, dapat dioperasikan dengan smartphone saat event |
| **Keamanan** | Akses terbatas melalui Google Account pemilik |
| **Skalabilitas** | Mendukung minimal 50 event dengan ratusan transaksi per event |
| **Portabilitas** | Data tersimpan di Google Sheets, dapat diakses dari device apapun |

---

## 6. User Flow Utama

```
[Sebelum Event]
Penjual → Buka Halaman Planning → Isi Form Event, Stok Awal, Modal per Pcs (Pin & GK), & Nama Peserta Jualan → Simpan

[Saat Event — Kasus 1: Transaksi Reguler (Ready Stock)]
Kasir → Buka Halaman Counting → Tab "Transaksi Reguler" → Pilih Event Aktif
      → Input jenis produk & qty → Lihat harga otomatis
      → Konfirmasi → Stok live booth berkurang → Transaksi tercatat di sheet Transaksi

[Saat Event — Kasus 2: Pesanan Desain Berbeda (Custom Order)]
Kasir → Buka Halaman Counting → Beralih ke Tab "Pesanan Custom"
      → Input Nama Customer, No. WhatsApp, Kategori Produk (Pin/GK), Qty, dan Rincian Desain
      → Masukkan Link Referensi Desain & Kesepakatan Harga
      → Pilih Status Bayar (DP / Lunas / Belum Bayar) & Metode Pengambilan (Booth / Kurir)
      → Klik "Simpan Pesanan Custom" → Data tersimpan ke sheet PesananKhusus (stok booth tidak terpotong)
      → Tim produksi/kasir dapat memantau status pesanan dan menghubungi WhatsApp customer via tombol cepat

[Setelah Event]
Penjual → Buka Halaman Rekap → Pilih Event
        → Lihat ringkasan omzet, total modal terpakai, keuntungan bersih, dan pembagian hasil per peserta
        → Klik Tombol "Lihat & Download PDF" atau "Cetak Langsung" → Dokumen PDF lengkap (termasuk pembagian hasil) siap cetak/simpan
```

---

## 7. Kriteria Penerimaan (Acceptance Criteria)

| Fitur | Kriteria |
|---|---|
| Kalkulasi harga | 3 pcs (apapun kombinasi Pin+GK) = Rp10.000 ✓, 7 pcs = Rp24.000 ✓, 2Pin+1GK = Rp10.000 ✓ |
| Stok real-time | Stok berkurang tepat sejumlah qty transaksi setelah konfirmasi transaksi reguler |
| Pesanan Custom | Form pesanan custom dapat menyimpan nama, kontak WhatsApp, qty, deskripsi desain, harga, status bayar, dan metode serah terima |
| Pemisahan Stok Custom | Transaksi pesanan custom TIDAK mengurangi stok sisa produk ready di booth |
| Follow-up WhatsApp | Tersedia tombol tautan langsung ke WhatsApp customer (`wa.me`) pada tabel pesanan custom |
| Update Status Pesanan | Kasir/owner dapat mengubah status pengerjaan pesanan custom (`Menunggu`, `Diproses`, `Siap`, `Selesai`) |
| Input Modal & Peserta | Form planning dapat menyimpan modal per pcs Pin, GK, serta multi-nama peserta jualan |
| Hitungan Modal & Untung | Total modal terhitung otomatis dari qty terjual × harga modal; Keuntungan Bersih = Omzet − Total Modal |
| Pembagian Hasil | Keuntungan bersih dibagi rata sesuai jumlah orang yang ikut berjualan (Keuntungan Bersih / Jumlah Peserta) |
| Export PDF & Cetak | Tombol PDF Google Sheets dan Cetak Langsung berfungsi; memuat ringkasan keuangan serta tabel pembagian hasil per peserta |
| Validasi stok | Tidak bisa transaksi reguler jika stok = 0 |
| Data persisten | Seluruh data (event, transaksi, pesanan custom) tersimpan permanen di Google Spreadsheet |

---

## 8. Timeline Estimasi

| Fase | Aktivitas | Estimasi |
|---|---|---|
| **Fase 1** | Setup Spreadsheet + struktur data + Apps Script boilerplate | 1–2 hari |
| **Fase 2** | Halaman Planning & Dashboard | 2–3 hari |
| **Fase 3** | Halaman Counting + logika harga + live stok | 3–4 hari |
| **Fase 4** | Halaman Rekap + Export PDF | 2–3 hari |
| **Fase 5** | Testing & Bugfix | 2 hari |
| **Total** | | **~10–14 hari** |
