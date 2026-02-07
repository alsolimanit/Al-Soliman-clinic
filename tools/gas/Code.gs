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
    const rows = values.slice(1).map(r => {
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
  // Optional: respond similarly to GET for testing convenience
  return doGet(e);
}
