// ============================================================
// Code.gs — Entry Point & Router
// ============================================================

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('PinTrack — Event Sales')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Include file HTML lain (untuk CSS/komponen bersama)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ── API Handler (dipanggil dari client via google.script.run) ──

function apiGetAllEvents() {
  return JSON.stringify(getAllEvents());
}

function apiGetActiveEvents() {
  return JSON.stringify(getActiveEvents());
}

function apiGetEventById(eventId) {
  return JSON.stringify(getEventById(eventId));
}

function apiCreateEvent(nama, tglMulai, tglSelesai, lokasi, stokPin, stokGk, catatan, modalPin, modalGk, peserta) {
  return createEvent(nama, tglMulai, tglSelesai, lokasi, stokPin, stokGk, catatan, modalPin, modalGk, peserta);
}

function apiUpdateEvent(eventId, nama, tglMulai, tglSelesai, lokasi, stokPin, stokGk, catatan, modalPin, modalGk, peserta) {
  return updateEvent(eventId, nama, tglMulai, tglSelesai, lokasi, stokPin, stokGk, catatan, modalPin, modalGk, peserta);
}

function apiDeleteEvent(eventId) {
  return deleteEvent(eventId);
}

function apiUpdateEventStatus(eventId, status) {
  return updateEventStatus(eventId, status);
}

function apiCreateTransaksi(eventId, jenisProduk, qtyPin, qtyGk, totalHarga, catatan) {
  return createTransaksi(eventId, jenisProduk, qtyPin, qtyGk, totalHarga, catatan);
}

function apiDeleteLastTransaksi(eventId) {
  return deleteLastTransaksi(eventId);
}

function apiGetTransaksiByEvent(eventId) {
  return JSON.stringify(getTransaksiByEvent(eventId));
}

function apiGetTodayTransaksi(eventId) {
  return JSON.stringify(getTodayTransaksi(eventId));
}

function apiKalkulasiHarga(qtyPin, qtyGk) {
  return kalkulasiHarga(qtyPin, qtyGk);
}

function apiGetRekapEvent(eventId) {
  return getRekapEvent(eventId);
}

function apiGeneratePdfUrl(eventId) {
  return generatePdfUrl(eventId);
}

function apiGetAllSettings() {
  return JSON.stringify(getAllSettings());
}

function apiUpdateSetting(key, value) {
  return updateSetting(key, value);
}

function apiSetupDatabase() {
  return setupDatabase();
}

function apiMigrateDatabase() {
  migrateEventsSheet();
  return successResponse('Struktur database berhasil disinkronkan.');
}

// ── API Pesanan Custom ──

function apiGetPesananCustomByEvent(eventId) {
  return JSON.stringify(getPesananCustomByEvent(eventId));
}

function apiCreatePesananCustom(eventId, namaCust, kontakCust, jenisProd, qtyPin, qtyGk, deskripsiDesain, linkRef, totalHarga, statusBayar, nominalDp, statusPesanan, metodeAmbil, catatan) {
  return createPesananCustom(eventId, namaCust, kontakCust, jenisProd, qtyPin, qtyGk, deskripsiDesain, linkRef, totalHarga, statusBayar, nominalDp, statusPesanan, metodeAmbil, catatan);
}

function apiUpdateStatusPesananCustom(pesananId, statusPesanan, statusPembayaran) {
  return updateStatusPesananCustom(pesananId, statusPesanan, statusPembayaran);
}

function apiDeletePesananCustom(pesananId) {
  return deletePesananCustom(pesananId);
}
