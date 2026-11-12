// ============================================================
// config.gs — Konstanta & Konfigurasi Global PinTrack
// ============================================================

var SPREADSHEET_ID   = '1YAjzcIHOfkkBS9kvIazSqvg5bpz1ps9Ghjqu4JwGOa8'; // Ganti dengan ID Spreadsheet kamu
var SHEET_EVENTS     = 'Events';
var SHEET_TRANSAKSI  = 'Transaksi';
var SHEET_PESANAN_KHUSUS = 'PesananKhusus';
var SHEET_PENGATURAN = 'Pengaturan';
var SHEET_REKAP_TEMP = 'RekapTemp';

var DEFAULT_SETTINGS = {
  harga_satuan : 4000,
  harga_bundel : 10000,
  min_bundel   : 3,
  stok_warning : 10
};

// Header definisi setiap sheet
var HEADERS_EVENTS = [
  'event_id','nama_event','tanggal_mulai','tanggal_selesai',
  'lokasi','stok_awal_pin','stok_awal_gk',
  'stok_sisa_pin','stok_sisa_gk','status','catatan',
  'modal_pin','modal_gk','peserta','created_at'
];

var HEADERS_TRANSAKSI = [
  'transaksi_id','event_id','timestamp','jenis_produk',
  'qty_pin','qty_gk','total_qty','total_harga','catatan'
];

var HEADERS_PESANAN_KHUSUS = [
  'pesanan_id','event_id','timestamp','nama_customer','kontak_customer',
  'jenis_produk','qty_pin','qty_gk','total_qty','deskripsi_desain',
  'link_referensi','total_harga','status_pembayaran','nominal_dp',
  'status_pesanan','metode_pengambilan','catatan'
];

var HEADERS_PENGATURAN = ['key','value'];

var HEADERS_REKAP_TEMP = [
  'No','Waktu','Jenis Produk','Qty Pin','Qty GK','Total Qty','Total Harga'
];
