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
  // Implement retry with timeout to make fetching more resilient.
  const maxAttempts = 3;
  const timeoutMs = 8000; // abort if request takes longer than 8s

  let lastError: any = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(API_URL, { cache: 'no-store', signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error('Unexpected API response: expected an array');

      const mapped = data.map((row: any) => ({
        timestamp: String(row.timestamp || row.Timestamp || row.time || row.date || ''),
        patientName: String(row.patientName || row['Full Patient Name'] || row.patient || row.name || ''),
        doctorName: String(row.doctorName || row['Doctor Name'] || row.doctor || ''),
      }));

      console.log(`[api] fetchClinicData -> attempt ${attempt} succeeded, records=${mapped.length}`);
      return mapped;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;
      console.warn(`[api] fetchClinicData -> attempt ${attempt} failed:`, err?.message || err);
      // small backoff before retrying
      if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }

  // All attempts failed — surface a clear error message
  throw new Error(`Failed to fetch clinic data after ${maxAttempts} attempts: ${lastError?.message || lastError}`);
}
