/**
 * Safe Apps Script web app that returns sheet rows as JSON
 * - Replace SPREADSHEET_ID and SHEET_NAME if needed (defaults to project sheet).
 */
function doGet(e) {
  try {
    const SPREADSHEET_ID = '1f5SQE4TYFB4C4i0Qam2U5Fe8kC08My_F-En14hJ-l0A';
    const SHEET_NAME = 'Alsoliman hs v 0.1 Clinics Management database';

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Debug mode: return spreadsheet metadata and sheet list to help diagnose "Sheet not found" errors
    if (e && e.parameter && e.parameter.debug === '1') {
      const sheetNames = ss.getSheets().map(s => s.getName());
      const owner = ss.getOwner ? ss.getOwner().getEmail() : null;
      return ContentService.createTextOutput(JSON.stringify({ spreadsheetId: SPREADSHEET_ID, sheetNames, owner }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*');
    }

    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Sheet not found: ' + SHEET_NAME, availableSheets: ss.getSheets().map(s => s.getName()) }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*');
    }

    const values = sheet.getDataRange().getValues();
    if (!values || values.length < 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*');
    }
    const headers = values[0].map(h => String(h).trim());

    // Ensure there is a "ميعاد الحجز" (booking time) column. If missing, append it.
    const bookingHeader = 'ميعاد الحجز';
    let bookingCol = headers.findIndex(h => h === bookingHeader);
    if (bookingCol === -1) {
      // append new header
      bookingCol = headers.length;
      sheet.getRange(1, bookingCol + 1).setValue(bookingHeader);
      headers.push(bookingHeader);
    }

    // Fill empty booking time cells with current timestamp (system registration time)
    const nowStr = new Date().toISOString();
    const rowsData = values.slice(1);
    for (let r = 0; r < rowsData.length; r++) {
      const cell = rowsData[r][bookingCol];
      if (cell === '' || cell === null || typeof cell === 'undefined') {
        // write ISO timestamp to sheet (keeps stable format)
        sheet.getRange(r + 2, bookingCol + 1).setValue(nowStr);
        rowsData[r][bookingCol] = nowStr;
      }
    }

    const rows = rowsData.map(r => {
      const obj = {};
      for (let i = 0; i < headers.length; i++) obj[headers[i] || ('col' + i)] = r[i];
      return obj;
    });

    return ContentService.createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    return ContentService.createTextOutput(JSON.stringify({ error: message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

function doPost(e) {
  // For simplicity and safety, POST behaves like GET (no deletions allowed)
  return doGet(e);
}
