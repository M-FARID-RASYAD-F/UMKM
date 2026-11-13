// ============================================================
// utils.gs — Helper Functions
// ============================================================

/**
 * Generate UUID sederhana
 */
function generateId() {
  return Utilities.getUuid();
}

/**
 * Parse string tanggal/timestamp (mendukung DD/MM/YYYY, ISO, atau Date object)
 */
function parseDateAny(val) {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  var s = String(val).trim();
  if (!s) return null;
  var parts = s.split(' ');
  var dParts = parts[0].split('/');
  if (dParts.length === 3) {
    var day   = parseInt(dParts[0], 10);
    var month = parseInt(dParts[1], 10) - 1;
    var year  = parseInt(dParts[2], 10);
    var hour  = 0, min = 0, sec = 0;
    if (parts[1]) {
      var tParts = parts[1].split(':');
      hour = parseInt(tParts[0], 10) || 0;
      min  = parseInt(tParts[1], 10) || 0;
      sec  = parseInt(tParts[2], 10) || 0;
    }
    return new Date(year, month, day, hour, min, sec);
  }
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format tanggal ke DD/MM/YYYY
 */
function formatDate(date) {
  if (!date) return '';
  var d = parseDateAny(date);
  if (!d) return '';
  var day   = String(d.getDate()).padStart(2, '0');
  var month = String(d.getMonth() + 1).padStart(2, '0');
  var year  = d.getFullYear();
  return day + '/' + month + '/' + year;
}

/**
 * Format timestamp ke DD/MM/YYYY HH:mm
 */
function formatTimestamp(ts) {
  if (!ts) return '';
  var d = parseDateAny(ts);
  if (!d) return '';
  return formatDate(d) + ' ' + 
    String(d.getHours()).padStart(2,'0') + ':' +
    String(d.getMinutes()).padStart(2,'0');
}

/**
 * Format angka ke format Rupiah
 */
function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

/**
 * Ambil Spreadsheet dan pastikan TimeZone disetel ke Asia/Jakarta (WIB)
 */
function getSpreadsheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  try {
    if (ss.getSpreadsheetTimeZone() !== 'Asia/Jakarta') {
      ss.setSpreadsheetTimeZone('Asia/Jakarta');
    }
  } catch(e) {
    console.warn('Gagal set timezone spreadsheet: ' + e.message);
  }
  return ss;
}

/**
 * Ambil sheet berdasarkan nama, buat jika belum ada
 */
function getOrCreateSheet(sheetName, headers) {
  var ss    = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#1a73e8')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

/**
 * Ambil semua data dari sheet (tanpa header)
 */
function getSheetData(sheetName) {
  var sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  return sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
}

/**
 * Response sukses untuk client
 */
function successResponse(data) {
  return JSON.stringify({ status: 'ok', data: data });
}

/**
 * Response error untuk client
 */
function errorResponse(message) {
  return JSON.stringify({ status: 'error', message: message });
}
