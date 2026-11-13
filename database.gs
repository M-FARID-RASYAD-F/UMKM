// ============================================================
// database.gs — Semua operasi baca/tulis ke Spreadsheet
// ============================================================

// ── SETUP ────────────────────────────────────────────────────

/**
 * Inisialisasi semua sheet & pengaturan default
 * Jalankan sekali saat pertama kali setup
 */
function setupDatabase() {
  var ss = getSpreadsheet();
  
  var eventsSheet  = getOrCreateSheet(SHEET_EVENTS,     HEADERS_EVENTS);
  var transSheet   = getOrCreateSheet(SHEET_TRANSAKSI,  HEADERS_TRANSAKSI);
  var pesananSheet = getOrCreateSheet(SHEET_PESANAN_KHUSUS, HEADERS_PESANAN_KHUSUS);
  var rekapSheet   = getOrCreateSheet(SHEET_REKAP_TEMP, HEADERS_REKAP_TEMP);
  var settingSheet = getOrCreateSheet(SHEET_PENGATURAN, HEADERS_PENGATURAN);

  // Isi default settings jika kosong
  if (settingSheet.getLastRow() <= 1) {
    var rows = Object.keys(DEFAULT_SETTINGS).map(function(k) {
      return [k, DEFAULT_SETTINGS[k]];
    });
    settingSheet.getRange(2, 1, rows.length, 2).setValues(rows);
  }

  // Jika ada sheet default kosong seperti 'Sheet1' atau 'Sheet 1', hapus agar tampilan langsung ke Events
  var allSheets = ss.getSheets();
  for (var i = 0; i < allSheets.length; i++) {
    var name = allSheets[i].getName();
    if ((name === 'Sheet1' || name === 'Sheet 1') && allSheets.length > 1) {
      try {
        ss.deleteSheet(allSheets[i]);
      } catch (err) {
        // Abaikan jika tidak bisa dihapus
      }
    }
  }

  // Aktifkan sheet Events sebagai sheet utama di depan
  ss.setActiveSheet(eventsSheet);

  // Jalankan migrasi struktur sheet Events bila ada penambahan kolom
  migrateEventsSheet();

  return successResponse('Setup selesai! Sheet Events, Transaksi, PesananKhusus, Pengaturan, dan RekapTemp berhasil disinkronkan.');
}

/**
 * Migrasi otomatis skema sheet Events jika belum memiliki kolom modal_pin, modal_gk, peserta
 */
function migrateEventsSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_EVENTS);
  if (!sheet) return;

  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  if (lastCol === 0) return;

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var modalPinColIndex = headers.indexOf('modal_pin');

  // Jika kolom modal_pin belum ada di header
  if (modalPinColIndex === -1) {
    var createdAtIndex = headers.indexOf('created_at');

    if (createdAtIndex === 11 && lastCol <= 12) {
      // Skema lama standar (12 kolom, kolom 12 = created_at)
      // Sisipkan 3 kolom baru sebelum kolom 12 (kolom L)
      sheet.insertColumnsBefore(12, 3);
      if (lastRow > 1) {
        var defaultVals = [];
        for (var r = 2; r <= lastRow; r++) {
          defaultVals.push([0, 0, '']);
        }
        sheet.getRange(2, 12, lastRow - 1, 3).setValues(defaultVals);
      }
    } else {
      // Jika kolom sudah lebih dari 12 atau data sempat tercampur
      if (lastRow > 1) {
        var numColsToCheck = Math.max(lastCol, 15);
        var dataRange = sheet.getRange(2, 1, lastRow - 1, numColsToCheck);
        var rows = dataRange.getValues();
        var modified = false;

        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var valL = row[11]; // kolom 12
          var valM = row[12]; // kolom 13
          var valN = row[13]; // kolom 14
          var valO = row[14]; // kolom 15

          var isDateLike = (valL instanceof Date) || (typeof valL === 'string' && valL.indexOf('-') !== -1 && isNaN(Number(valL)));
          if (isDateLike && (!valM || valM === '') && (!valN || valN === '') && (!valO || valO === '')) {
            row[14] = valL; // pindahkan tanggal ke created_at
            row[11] = 0;    // modal_pin
            row[12] = 0;    // modal_gk
            row[13] = '';   // peserta
            modified = true;
          }
        }
        if (modified) {
          dataRange.setValues(rows);
        }
      }
    }

    // Tulis ulang header baris 1 agar presisi dengan HEADERS_EVENTS
    sheet.getRange(1, 1, 1, HEADERS_EVENTS.length).setValues([HEADERS_EVENTS]);
    sheet.getRange(1, 1, 1, HEADERS_EVENTS.length)
      .setBackground('#1a73e8')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

// ── PENGATURAN ────────────────────────────────────────────────

function getSetting(key) {
  var data = getSheetData(SHEET_PENGATURAN);
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) return Number(data[i][1]);
  }
  return DEFAULT_SETTINGS[key] || null;
}

function getAllSettings() {
  var data = getSheetData(SHEET_PENGATURAN);
  var result = {};
  data.forEach(function(row) { result[row[0]] = row[1]; });
  return result;
}

function updateSetting(key, value) {
  var sheet = getSpreadsheet().getSheetByName(SHEET_PENGATURAN);
  var data  = getSheetData(SHEET_PENGATURAN);
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 2, 2).setValue(value);
      return successResponse('Setting diupdate');
    }
  }
  sheet.appendRow([key, value]);
  return successResponse('Setting ditambahkan');
}

// ── EVENTS ────────────────────────────────────────────────────

function getAllEvents() {
  migrateEventsSheet();
  var data = getSheetData(SHEET_EVENTS);
  return data.map(function(row) {
    return rowToEvent(row);
  });
}

function getEventById(eventId) {
  var targetId = String(eventId || '').trim();
  if (!targetId) return null;
  var data = getSheetData(SHEET_EVENTS);
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === targetId) return rowToEvent(data[i]);
  }
  return null;
}

function getActiveEvents() {
  return getAllEvents().filter(function(e) { return e.status === 'aktif'; });
}

function createEvent(nama, tglMulai, tglSelesai, lokasi, stokPin, stokGk, catatan, modalPin, modalGk, peserta) {
  var sheet = getOrCreateSheet(SHEET_EVENTS, HEADERS_EVENTS);
  var id    = generateId();
  var now   = new Date();
  sheet.appendRow([
    id, nama, tglMulai, tglSelesai, lokasi,
    Number(stokPin), Number(stokGk),
    Number(stokPin), Number(stokGk),
    'aktif', catatan || '',
    Number(modalPin) || 0, Number(modalGk) || 0,
    peserta || '', now
  ]);
  return successResponse({ event_id: id, message: 'Event berhasil dibuat' });
}

function updateEvent(eventId, nama, tglMulai, tglSelesai, lokasi, stokPin, stokGk, catatan, modalPin, modalGk, peserta) {
  var sheet = getSpreadsheet().getSheetByName(SHEET_EVENTS);
  var data  = getSheetData(SHEET_EVENTS);
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === eventId) {
      var row = i + 2;
      var oldStokPin = Number(data[i][5]);
      var oldStokGk  = Number(data[i][6]);
      var sisaPin    = Number(data[i][7]);
      var sisaGk     = Number(data[i][8]);
      // Hitung selisih stok awal & update stok sisa
      var newSisaPin = sisaPin + (Number(stokPin) - oldStokPin);
      var newSisaGk  = sisaGk  + (Number(stokGk)  - oldStokGk);
      sheet.getRange(row, 2, 1, 13).setValues([[
        nama, tglMulai, tglSelesai, lokasi,
        Number(stokPin), Number(stokGk),
        Math.max(0, newSisaPin), Math.max(0, newSisaGk),
        data[i][9], catatan || '',
        Number(modalPin) || 0, Number(modalGk) || 0,
        peserta || ''
      ]]);
      return successResponse('Event diupdate');
    }
  }
  return errorResponse('Event tidak ditemukan');
}

function updateEventStatus(eventId, status) {
  var sheet = getSpreadsheet().getSheetByName(SHEET_EVENTS);
  var data  = getSheetData(SHEET_EVENTS);
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === eventId) {
      sheet.getRange(i + 2, 10).setValue(status);
      return successResponse('Status diupdate');
    }
  }
  return errorResponse('Event tidak ditemukan');
}

function deleteEvent(eventId) {
  var sheet = getSpreadsheet().getSheetByName(SHEET_EVENTS);
  var data  = getSheetData(SHEET_EVENTS);
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === eventId) {
      sheet.deleteRow(i + 2);
      return successResponse('Event dihapus');
    }
  }
  return errorResponse('Event tidak ditemukan');
}

/**
 * Kurangi stok sisa setelah transaksi
 */
function decreaseStok(eventId, qtyPin, qtyGk) {
  var sheet = getSpreadsheet().getSheetByName(SHEET_EVENTS);
  var data  = getSheetData(SHEET_EVENTS);
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === eventId) {
      var row     = i + 2;
      var sisaPin = Number(data[i][7]) - Number(qtyPin);
      var sisaGk  = Number(data[i][8]) - Number(qtyGk);
      if (sisaPin < 0 || sisaGk < 0) return errorResponse('Stok tidak mencukupi!');
      sheet.getRange(row, 8).setValue(sisaPin);
      sheet.getRange(row, 9).setValue(sisaGk);
      return successResponse({ sisa_pin: sisaPin, sisa_gk: sisaGk });
    }
  }
  return errorResponse('Event tidak ditemukan');
}

/**
 * Tambah kembali stok (saat undo transaksi)
 */
function increaseStok(eventId, qtyPin, qtyGk) {
  var sheet = getSpreadsheet().getSheetByName(SHEET_EVENTS);
  var data  = getSheetData(SHEET_EVENTS);
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === eventId) {
      var row     = i + 2;
      var sisaPin = Number(data[i][7]) + Number(qtyPin);
      var sisaGk  = Number(data[i][8]) + Number(qtyGk);
      sheet.getRange(row, 8).setValue(sisaPin);
      sheet.getRange(row, 9).setValue(sisaGk);
      return successResponse({ sisa_pin: sisaPin, sisa_gk: sisaGk });
    }
  }
  return errorResponse('Event tidak ditemukan');
}

// ── TRANSAKSI ────────────────────────────────────────────────

function getTransaksiByEvent(eventId) {
  var targetId = String(eventId || '').trim();
  if (!targetId) return [];
  var data = getSheetData(SHEET_TRANSAKSI);
  return data.filter(function(row) {
    return String(row[1]).trim() === targetId;
  }).map(function(row) {
    return rowToTransaksi(row);
  });
}

function getTodayTransaksi(eventId) {
  var today = new Date();
  today.setHours(0,0,0,0);
  return getTransaksiByEvent(eventId).filter(function(t) {
    if (!t.timestamp) return false;
    var d = parseDateAny(t.timestamp);
    return d && !isNaN(d.getTime()) && d >= today;
  });
}

function createTransaksi(eventId, jenisProduk, qtyPin, qtyGk, totalHarga, catatan) {
  qtyPin = Number(qtyPin) || 0;
  qtyGk  = Number(qtyGk)  || 0;

  // Kurangi stok dulu — jika gagal, batalkan
  var stokResult = JSON.parse(decreaseStok(eventId, qtyPin, qtyGk));
  if (stokResult.status === 'error') return errorResponse(stokResult.message);

  var sheet = getOrCreateSheet(SHEET_TRANSAKSI, HEADERS_TRANSAKSI);
  var id    = generateId();
  var now   = new Date();
  sheet.appendRow([
    id, eventId, now, jenisProduk,
    qtyPin, qtyGk, qtyPin + qtyGk,
    Number(totalHarga), catatan || ''
  ]);

  return successResponse({
    transaksi_id : id,
    sisa_pin     : stokResult.data.sisa_pin,
    sisa_gk      : stokResult.data.sisa_gk,
    message      : 'Transaksi berhasil disimpan'
  });
}

function deleteLastTransaksi(eventId) {
  var sheet = getSpreadsheet().getSheetByName(SHEET_TRANSAKSI);
  if (!sheet) return errorResponse('Sheet transaksi tidak ditemukan');

  var allData  = getSheetData(SHEET_TRANSAKSI);
  var eventRows = [];
  for (var i = 0; i < allData.length; i++) {
    if (allData[i][1] === eventId) eventRows.push({ data: allData[i], sheetRow: i + 2 });
  }

  if (eventRows.length === 0) return errorResponse('Tidak ada transaksi untuk dibatalkan');

  var last = eventRows[eventRows.length - 1];
  var qtyPin = Number(last.data[4]);
  var qtyGk  = Number(last.data[5]);

  sheet.deleteRow(last.sheetRow);
  increaseStok(eventId, qtyPin, qtyGk);

  var event = getEventById(eventId);
  return successResponse({
    sisa_pin : event.stok_sisa_pin,
    sisa_gk  : event.stok_sisa_gk,
    message  : 'Transaksi terakhir dibatalkan'
  });
}

// ── ROW CONVERTERS ────────────────────────────────────────────

function rowToEvent(row) {
  return {
    event_id       : row[0],
    nama_event     : row[1],
    tanggal_mulai  : row[2] ? formatDate(row[2]) : '',
    tanggal_selesai: row[3] ? formatDate(row[3]) : '',
    lokasi         : row[4],
    stok_awal_pin  : Number(row[5]) || 0,
    stok_awal_gk   : Number(row[6]) || 0,
    stok_sisa_pin  : Number(row[7]) || 0,
    stok_sisa_gk   : Number(row[8]) || 0,
    status         : row[9],
    catatan        : row[10],
    modal_pin      : Number(row[11]) || 0,
    modal_gk       : Number(row[12]) || 0,
    peserta        : row[13] || '',
    created_at     : row[14] ? formatTimestamp(row[14]) : ''
  };
}

function rowToTransaksi(row) {
  return {
    transaksi_id : row[0],
    event_id     : row[1],
    timestamp    : row[2] ? formatTimestamp(row[2]) : '',
    jenis_produk : row[3],
    qty_pin      : Number(row[4]) || 0,
    qty_gk       : Number(row[5]) || 0,
    total_qty    : Number(row[6]) || 0,
    total_harga  : Number(row[7]) || 0,
    catatan      : row[8]
  };
}

// ── PESANAN CUSTOM (DESAIN KHUSUS) ───────────────────────────

function getPesananCustomByEvent(eventId) {
  var targetId = String(eventId || '').trim();
  if (!targetId) return [];
  var data = getSheetData(SHEET_PESANAN_KHUSUS);
  return data.filter(function(row) {
    return String(row[1]).trim() === targetId;
  }).map(function(row) {
    return rowToPesananCustom(row);
  });
}

function createPesananCustom(eventId, namaCust, kontakCust, jenisProd, qtyPin, qtyGk, deskripsiDesain, linkRef, totalHarga, statusBayar, nominalDp, statusPesanan, metodeAmbil, catatan) {
  var targetId = String(eventId || '').trim();
  if (!targetId) return errorResponse('Event ID wajib disertakan');
  if (!namaCust || !String(namaCust).trim()) return errorResponse('Nama customer wajib diisi');
  if (!kontakCust || !String(kontakCust).trim()) return errorResponse('Kontak customer wajib diisi');

  qtyPin = Number(qtyPin) || 0;
  qtyGk  = Number(qtyGk)  || 0;
  var totalQty = qtyPin + qtyGk;
  if (totalQty <= 0) return errorResponse('Jumlah pesanan (qty) minimal 1');

  var sheet = getOrCreateSheet(SHEET_PESANAN_KHUSUS, HEADERS_PESANAN_KHUSUS);
  var id = generateId();
  var now = new Date();

  sheet.appendRow([
    id,
    targetId,
    now,
    String(namaCust).trim(),
    String(kontakCust).trim(),
    jenisProd || 'pin',
    qtyPin,
    qtyGk,
    totalQty,
    deskripsiDesain || '',
    linkRef || '',
    Number(totalHarga) || 0,
    statusBayar || 'Belum Bayar',
    Number(nominalDp) || 0,
    statusPesanan || 'Pending',
    metodeAmbil || 'Ambil di Booth',
    catatan || ''
  ]);

  return successResponse({
    pesanan_id: id,
    message: 'Pesanan custom berhasil dicatat'
  });
}

function updateStatusPesananCustom(pesananId, statusPesanan, statusPembayaran) {
  var targetId = String(pesananId || '').trim();
  if (!targetId) return errorResponse('Pesanan ID tidak valid');

  var sheet = getSpreadsheet().getSheetByName(SHEET_PESANAN_KHUSUS);
  if (!sheet) return errorResponse('Sheet pesanan khusus tidak ditemukan');

  var allData = getSheetData(SHEET_PESANAN_KHUSUS);
  for (var i = 0; i < allData.length; i++) {
    if (String(allData[i][0]).trim() === targetId) {
      var rowNum = i + 2;
      // Kolom 13 (index 12) = status_pembayaran
      // Kolom 15 (index 14) = status_pesanan
      if (statusPembayaran !== undefined && statusPembayaran !== null && statusPembayaran !== '') {
        sheet.getRange(rowNum, 13).setValue(statusPembayaran);
      }
      if (statusPesanan !== undefined && statusPesanan !== null && statusPesanan !== '') {
        sheet.getRange(rowNum, 15).setValue(statusPesanan);
      }
      return successResponse({ message: 'Status pesanan custom berhasil diperbarui' });
    }
  }

  return errorResponse('Pesanan dengan ID tersebut tidak ditemukan');
}

function deletePesananCustom(pesananId) {
  var targetId = String(pesananId || '').trim();
  if (!targetId) return errorResponse('Pesanan ID tidak valid');

  var sheet = getSpreadsheet().getSheetByName(SHEET_PESANAN_KHUSUS);
  if (!sheet) return errorResponse('Sheet pesanan khusus tidak ditemukan');

  var allData = getSheetData(SHEET_PESANAN_KHUSUS);
  for (var i = 0; i < allData.length; i++) {
    if (String(allData[i][0]).trim() === targetId) {
      sheet.deleteRow(i + 2);
      return successResponse({ message: 'Pesanan custom berhasil dihapus' });
    }
  }

  return errorResponse('Pesanan tidak ditemukan');
}

function rowToPesananCustom(row) {
  return {
    pesanan_id        : row[0],
    event_id          : row[1],
    timestamp         : row[2] ? formatTimestamp(row[2]) : '',
    nama_customer     : row[3] || '',
    kontak_customer   : row[4] || '',
    jenis_produk      : row[5] || '',
    qty_pin           : Number(row[6]) || 0,
    qty_gk            : Number(row[7]) || 0,
    total_qty         : Number(row[8]) || 0,
    deskripsi_desain  : row[9] || '',
    link_referensi    : row[10] || '',
    total_harga       : Number(row[11]) || 0,
    status_pembayaran : row[12] || 'Belum Bayar',
    nominal_dp        : Number(row[13]) || 0,
    status_pesanan    : row[14] || 'Pending',
    metode_pengambilan: row[15] || 'Ambil di Booth',
    catatan           : row[16] || ''
  };
}
