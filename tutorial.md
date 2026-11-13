# 📖 Panduan Penggunaan PinTrack POS
**Sistem Kasir, Stok, dan Rekapitulasi Laba Otomatis Bazaar UMKM**

---

## ⚡ Alur Cepat Penggunaan
```text
1. Planning (Buat Event) ➔ 2. Kasir (Input Penjualan) ➔ 3. Rekap (Lihat Laba & Cetak PDF)
```

---

## 📌 4 Langkah Utama

### 1. Buat Event Baru (Menu Planning)
Digunakan sebelum bazaar dimulai untuk menentukan kuota stok awal.
1. Buka menu **Planning & Stok**.
2. Isi formulir:
   - **Nama Event & Lokasi**: Contoh: `Bazaar Kampus Fest`.
   - **Tanggal**: Tentukan tanggal mulai dan selesai.
   - **Stok Awal**: Masukkan jumlah Pin dan Gantungan Kunci (GK) yang dibawa.
   - **Harga Modal (HPP)**: Biaya modal per pcs (contoh: Pin Rp 1.500, GK Rp 1.800).
   - **Anggota / Peserta**: Ketik nama anggota panitia dipisahkan koma (contoh: `Farid, Budi, Siti`) untuk bagi hasil otomatis.
3. Klik **Simpan Rencana Event**.

---

### 2. Melayani Pembeli (Menu Kasir Counting)
Digunakan oleh kasir saat melayani transaksi di stan.
1. Buka menu **Kasir Counting**.
2. Pilih nama event aktif pada dropdown di bagian atas.
3. **Pilih Produk & Jumlah**:
   - **Cara Cepat (One-Touch)**: Cukup ketuk salah satu tombol paket hemat:
     - `1 Pin (4k)`
     - `3 Pin (10k ★)`
     - `1 GK (4k)`
     - `3 GK (10k ★)`
     - `2 Pin + 1 GK (10k)`
   - **Cara Manual**: Pilih tab *Pin / GK / Campuran*, lalu tekan tombol **+** atau **−** untuk mengatur jumlah.
4. Klik tombol besar oranye **Konfirmasi Pembayaran** (atau tekan tombol **Enter ↵** di keyboard).
5. Selesai! Stok langsung berkurang otomatis.

> [!TIP]
> **Salah Input?** Ketuk tombol merah **`Batalkan Transaksi Terakhir (Undo)`** di bawah tombol bayar. Stok akan langsung dikembalikan seperti semula.

---

### 3. Catat Pesanan Custom (Tab Pesanan Custom)
Gunakan tab ini jika ada pelanggan yang memesan desain foto/logo khusus (*Made-to-Order*).
1. Di halaman kasir, klik tab **Pesanan Custom**.
2. Masukkan data pelanggan:
   - Nama customer & nomor WhatsApp.
   - Jumlah pesanan & deskripsi desain (bisa sertakan link foto/Drive).
   - Kesepakatan harga & status bayar (*Lunas / DP / Belum Bayar*).
3. Klik **Simpan Pesanan Custom**.
4. *(Pesanan custom tidak memotong stok fisik booth karena diproduksi tersendiri).*

---

### 4. Lihat Laporan & Bagi Hasil (Menu Rekap Hasil)
Digunakan saat event selesai untuk mengecek keuntungan dan mencetak laporan.
1. Buka menu **Rekap Hasil**.
2. Pilih event yang ingin dilihat.
3. Sistem otomatis menampilkan:
   - **Ringkasan Penjualan**: Total Pin & GK terjual, jumlah pembeli, dan total omzet.
   - **Arus Stok**: Perbandingan stok awal vs sisa fisik.
   - **Laba Bersih**: Total omzet dikurangi total modal produksi.
   - **Bagi Hasil Peserta**: Keuntungan bersih dibagi rata ke seluruh anggota yang terdaftar.
4. **Cetak / Ekspor**:
   - Ketuk **`Buka & Download PDF`** untuk mendapatkan dokumen PDF resmi dari Google Drive.
   - Atau ketuk **`Cetak Langsung`** untuk cetak fisik via printer.

---

## 💰 Aturan Tarif Otomatis (Paket Bundel)
Sistem otomatis menghitung harga termurah bagi pelanggan:
- **1 pcs** = Rp 4.000
- **3 pcs (Bundel Hemat)** = **Rp 10.000** *(Hemat Rp 2.000)*
- Berlaku kelipatan dan bebas campur (misal: 2 Pin + 1 GK = tetap Rp 10.000).

---

## 💡 Catatan Tambahan
1. **Penyimpanan Cloud**: Seluruh data tersimpan otomatis di Google Spreadsheet secara real-time.
2. **Fleksibel**: Transaksi kasir tetap bisa dicatat kapan pun meskipun tanggal event di kalender sudah lewat.
3. **Auto-Sync**: Tab `RekapTemp` di spreadsheet akan selalu ter-update otomatis saat Anda membuka halaman Rekap Hasil.
