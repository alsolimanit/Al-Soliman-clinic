export interface ClinicRecord {
  timestamp: string;
  patientName: string;
  doctorName: string;
  bookingTime?: string;
}

// Prefer an explicit web app URL for reliability during testing.
// You can override via `import.meta.env.VITE_CLINIC_API_URL` in dev if desired.
const API_URL = (import.meta as any).env?.VITE_CLINIC_API_URL ||
  'https://script.google.com/macros/s/AKfycby-M_Sa8DF2WZVGB_yJlTSSxoWEqkr100lrGD_lnzlGGa9oANHqWBSXETwOjwxOEO0m/exec';

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
      // Inspect content type first to provide clearer errors when HTML is returned.
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // read as text to include first part of HTML or error page in thrown message
        const text = await res.text();
        const snippet = text.slice(0, 400).replace(/\s+/g, ' ');
        throw new Error(`Expected JSON but received ${contentType || 'unknown'}: ${snippet}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) throw new Error('Unexpected API response: expected an array');

      const mapped = data.map((row: any) => ({
        timestamp: String(row.timestamp || row.Timestamp || row.time || row.date || ''),
        patientName: String(row.patientName || row['Full Patient Name'] || row.patient || row.name || ''),
        doctorName: String(row.doctorName || row['Doctor Name'] || row.doctor || ''),
        bookingTime: String(row['ميعاد الحجز'] || row.bookingTime || row.booking_time || row['Booking Time'] || ''),
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

