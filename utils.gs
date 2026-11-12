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
 * Format tanggal ke DD/MM/YYYY
 */
function formatDate(date) {
  if (!date) return '';
  var d = new Date(date);
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
  var d = new Date(ts);
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
 * Ambil Spreadsheet
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
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
