export interface ClinicRecord {
  timestamp: string;
  patientName: string;
  doctorName: string;
}

const API_URL = 'https://script.google.com/macros/s/AKfycbwRigrXmHXwpKj7CFmhb-AgflfwTfn-MStXMXHrbLGUCPX0wKzkUkWa50thNbxoaqBN/exec';

export async function fetchClinicData(): Promise<ClinicRecord[]> {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data = await res.json();

  // Expecting an array of records with keys: timestamp, patientName, doctorName
  if (!Array.isArray(data)) {
    throw new Error('Unexpected API response');
  }

  return data.map((row: any) => ({
    timestamp: String(row.timestamp || row.time || row.date || ''),
    patientName: String(row.patientName || row.patient || row.name || ''),
    doctorName: String(row.doctorName || row.doctor || ''),
  }));
}
