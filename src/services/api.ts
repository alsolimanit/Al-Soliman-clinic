export interface ClinicRecord {
  timestamp: string;
  patientName: string;
  doctorName: string;
}

// Google Apps Script Web App URL (reads the specified Google Sheet)
const API_URL = 'https://script.google.com/macros/s/AKfycbwRigrXmHXwpKj7CFmhb-AgflfwTfn-MStXMXHrbLGUCPX0wKzkUkWa50thNbxoaqBN/exec';

/**
 * Fetch clinic data from the Google Apps Script endpoint.
 * - Uses `cache: 'no-store'` to avoid cached responses so polling always gets fresh data.
 * - Returns an array of `ClinicRecord` objects.
 */
export async function fetchClinicData(): Promise<ClinicRecord[]> {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data = await res.json();

  // The Apps Script may return an array of objects.
  if (!Array.isArray(data)) {
    throw new Error('Unexpected API response: expected an array');
  }

  // Map/normalize fields to our expected keys. Be defensive about field names.
  const mapped = data.map((row: any) => ({
    timestamp: String(row.timestamp || row.Timestamp || row.time || row.date || ''),
    patientName: String(row.patientName || row['Full Patient Name'] || row.patient || row.name || ''),
    doctorName: String(row.doctorName || row['Doctor Name'] || row.doctor || ''),
  }));

  // Debug: indicate data received from API
  console.log(`[api] fetchClinicData -> received ${mapped.length} records`);

  return mapped;
}
