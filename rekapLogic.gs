// ============================================================
// rekap.gs — Kalkulasi Rekap & Export PDF
// ============================================================

/**
 * Hitung rekap lengkap per event
 */
function getRekapEvent(eventId) {
  var event     = getEventById(eventId);
  if (!event) return errorResponse('Event tidak ditemukan');

  var transaksi = getTransaksiByEvent(eventId);

  var totalQtyPin  = 0;
  var totalQtyGk   = 0;
  var totalHarga   = 0;
  var jmlTransaksi = transaksi.length;

  transaksi.forEach(function(t) {
    totalQtyPin += Number(t.qty_pin) || 0;
    totalQtyGk  += Number(t.qty_gk) || 0;
    totalHarga  += Number(t.total_harga) || 0;
  });

  // Hitung modal & keuntungan
  var modalPin         = Number(event.modal_pin) || 0;
  var modalGk          = Number(event.modal_gk) || 0;
  var totalModal       = (totalQtyPin * modalPin) + (totalQtyGk * modalGk);
  var keuntunganBersih = totalHarga - totalModal;

  // Parse peserta secara aman
  var rawPeserta = event.peserta ? String(event.peserta) : '';
  var daftarPeserta = rawPeserta
    ? rawPeserta.split(',').map(function(s){ return s.trim(); }).filter(function(s){ return s !== ''; })
    : [];
  var bagianPerOrang = daftarPeserta.length > 0 ? Math.round(keuntunganBersih / daftarPeserta.length) : 0;

  return successResponse({
    event            : event,
    total_qty_pin    : totalQtyPin,
    total_qty_gk     : totalQtyGk,
    total_qty        : totalQtyPin + totalQtyGk,
    total_harga      : totalHarga,
    modal_pin        : modalPin,
    modal_gk         : modalGk,
    total_modal      : totalModal,
    keuntungan_bersih: keuntunganBersih,
    daftar_peserta   : daftarPeserta,
    bagian_per_orang : bagianPerOrang,
    jml_transaksi    : jmlTransaksi,
    stok_awal_pin    : event.stok_awal_pin,
    stok_awal_gk     : event.stok_awal_gk,
    stok_sisa_pin    : event.stok_sisa_pin,
    stok_sisa_gk     : event.stok_sisa_gk,
    transaksi        : transaksi
  });
}

/**
 * Generate data ke sheet RekapTemp lalu return URL PDF
 */
function generatePdfUrl(eventId) {
  var event     = getEventById(eventId);
  if (!event) return errorResponse('Event tidak ditemukan');

  var transaksi = getTransaksiByEvent(eventId);

  // Hitung rekap
  var totalQtyPin = 0, totalQtyGk = 0, totalHarga = 0;
  transaksi.forEach(function(t) {
    totalQtyPin += Number(t.qty_pin) || 0;
    totalQtyGk  += Number(t.qty_gk) || 0;
    totalHarga  += Number(t.total_harga) || 0;
  });

  // Hitung modal & keuntungan
  var modalPin         = Number(event.modal_pin) || 0;
  var modalGk          = Number(event.modal_gk) || 0;
  var totalModal       = (totalQtyPin * modalPin) + (totalQtyGk * modalGk);
  var keuntunganBersih = totalHarga - totalModal;
  var rawPeserta       = event.peserta ? String(event.peserta) : '';
  var daftarPeserta    = rawPeserta
    ? rawPeserta.split(',').map(function(s){ return s.trim(); }).filter(function(s){ return s !== ''; })
    : [];
  var bagianPerOrang   = daftarPeserta.length > 0 ? Math.round(keuntunganBersih / daftarPeserta.length) : 0;

  // Tulis ke sheet RekapTemp
  var ss    = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_REKAP_TEMP);
  if (!sheet) sheet = ss.insertSheet(SHEET_REKAP_TEMP);
  sheet.clear();

  // ── Header Rekap ─────────────────────────────────────────
  sheet.getRange('A1').setValue('REKAP PENJUALAN EVENT - PinTrack');
  sheet.getRange('A1').setFontSize(14).setFontWeight('bold');
  sheet.getRange('A2').setValue('Event     : ' + event.nama_event);
  sheet.getRange('A3').setValue('Lokasi    : ' + event.lokasi);
  sheet.getRange('A4').setValue('Tanggal   : ' + event.tanggal_mulai + ' s/d ' + event.tanggal_selesai);
  sheet.getRange('A5').setValue('Dicetak   : ' + formatTimestamp(new Date()));

  // ── Ringkasan Penjualan ────────────────────────────────────
  sheet.getRange('A7').setValue('RINGKASAN PENJUALAN').setFontWeight('bold');
  var summaryData = [
    ['', 'Pin', 'Gantungan Kunci', 'Total'],
    ['Stok Awal', event.stok_awal_pin, event.stok_awal_gk, event.stok_awal_pin + event.stok_awal_gk],
    ['Terjual', totalQtyPin, totalQtyGk, totalQtyPin + totalQtyGk],
    ['Stok Sisa', event.stok_sisa_pin, event.stok_sisa_gk, event.stok_sisa_pin + event.stok_sisa_gk],
  ];
  sheet.getRange(8, 1, summaryData.length, 4).setValues(summaryData);
  sheet.getRange(8, 1, 1, 4).setFontWeight('bold').setBackground('#1a73e8').setFontColor('#ffffff');

  // ── Keuangan & Modal ──────────────────────────────────────
  var financeData = [
    ['Jumlah Transaksi', transaksi.length],
    ['Total Pendapatan (Omzet)', totalHarga],
    ['Total Modal Produk', totalModal],
    ['Keuntungan Bersih', keuntunganBersih]
  ];
  sheet.getRange(13, 1, financeData.length, 2).setValues(financeData);
  sheet.getRange(14, 2).setNumberFormat('"Rp "#,##0');
  sheet.getRange(15, 2).setNumberFormat('"Rp "#,##0');
  sheet.getRange(16, 2).setNumberFormat('"Rp "#,##0');
  sheet.getRange(16, 1, 1, 2).setFontWeight('bold').setBackground('#e8f5e9');

  var nextRow = 18;

  // ── Pembagian Hasil (Jika ada peserta) ─────────────────────
  if (daftarPeserta.length > 0) {
    sheet.getRange(nextRow, 1).setValue('PEMBAGIAN HASIL PESERTA JUALAN').setFontWeight('bold');
    nextRow++;
    var pesertaHeaders = [['No', 'Nama Peserta', 'Bagian Keuntungan']];
    sheet.getRange(nextRow, 1, 1, 3).setValues(pesertaHeaders)
      .setFontWeight('bold').setBackground('#1a73e8').setFontColor('#ffffff');
    nextRow++;
    var pesertaRows = daftarPeserta.map(function(nama, idx) {
      return [idx + 1, nama, bagianPerOrang];
    });
    sheet.getRange(nextRow, 1, pesertaRows.length, 3).setValues(pesertaRows);
    sheet.getRange(nextRow, 3, pesertaRows.length, 1).setNumberFormat('"Rp "#,##0');
    nextRow += pesertaRows.length + 1;
  }

  // ── Detail Transaksi ──────────────────────────────────────
  sheet.getRange(nextRow, 1).setValue('DETAIL TRANSAKSI').setFontWeight('bold');
  nextRow++;
  var detailHeaders = [['No','Waktu','Produk','Qty Pin','Qty GK','Total Qty','Total Harga']];
  sheet.getRange(nextRow, 1, 1, 7).setValues(detailHeaders)
    .setFontWeight('bold').setBackground('#1a73e8').setFontColor('#ffffff');
  nextRow++;

  if (transaksi.length > 0) {
    var detailRows = transaksi.map(function(t, idx) {
      return [
        idx + 1, t.timestamp, t.jenis_produk,
        t.qty_pin, t.qty_gk, t.total_qty, t.total_harga
      ];
    });
    sheet.getRange(nextRow, 1, detailRows.length, 7).setValues(detailRows);
    sheet.getRange(nextRow, 7, detailRows.length, 1).setNumberFormat('"Rp "#,##0');
  } else {
    sheet.getRange(nextRow, 1, 1, 7).setValues([['-', '-', 'Belum ada transaksi pada event ini', 0, 0, 0, 0]]);
    sheet.getRange(nextRow, 1, 1, 7).setFontStyle('italic').setFontColor('#64748b');
  }

  // Auto resize kolom
  sheet.autoResizeColumns(1, 7);

  // Paksa simpan perubahan spreadsheet sebelum URL diakses oleh user
  SpreadsheetApp.flush();

  // ── Return URL PDF ────────────────────────────────────────
  var gid    = sheet.getSheetId();
  var pdfUrl = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID
    + '/export?format=pdf'
    + '&gid=' + gid
    + '&size=7'
    + '&portrait=true'
    + '&fitw=true'
    + '&gridlines=false'
    + '&printtitle=false'
    + '&sheetnames=false'
    + '&fzr=false'
    + '&top_margin=0.5'
    + '&bottom_margin=0.5'
    + '&left_margin=0.5'
    + '&right_margin=0.5';

  return successResponse({ pdf_url: pdfUrl, event_nama: event.nama_event });
}
