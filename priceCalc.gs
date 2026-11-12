// ============================================================
// priceCalc.gs — Kalkulasi Harga
// ============================================================

/**
 * Hitung total harga dengan aturan bundel
 * Pin + Gantungan Kunci dihitung sebagai TOTAL qty bersama
 *
 * Contoh:
 *   hitungHarga(2, 1) → 3 pcs → Rp 10.000
 *   hitungHarga(0, 7) → 7 pcs → Rp 24.000
 *   hitungHarga(3, 4) → 7 pcs → Rp 24.000
 *
 * @param {number} qtyPin - Jumlah pin
 * @param {number} qtyGk  - Jumlah gantungan kunci
 * @returns {Object} { totalHarga, detail }
 */
function hitungHarga(qtyPin, qtyGk) {
  qtyPin = Number(qtyPin) || 0;
  qtyGk  = Number(qtyGk)  || 0;

  var hargaSatuan = getSetting('harga_satuan'); // 4000
  var hargaBundel = getSetting('harga_bundel'); // 10000
  var minBundel   = getSetting('min_bundel');   // 3

  var totalQty     = qtyPin + qtyGk;
  var jumlahBundel = Math.floor(totalQty / minBundel);
  var sisaQty      = totalQty % minBundel;
  var totalHarga   = (jumlahBundel * hargaBundel) + (sisaQty * hargaSatuan);

  return {
    total_qty     : totalQty,
    jumlah_bundel : jumlahBundel,
    sisa_qty      : sisaQty,
    total_harga   : totalHarga,
    harga_satuan  : hargaSatuan,
    harga_bundel  : hargaBundel,
    min_bundel    : minBundel
  };
}

/**
 * Wrapper untuk dipanggil dari client (return JSON)
 */
function kalkulasiHarga(qtyPin, qtyGk) {
  var result = hitungHarga(qtyPin, qtyGk);
  return successResponse(result);
}
