export interface Patient {
  id: string;
  fullName: string;
  doctorName: string;
  registrationTime: string;
  status: 'Waiting' | 'In Progress' | 'Finished';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  isAvailable?: boolean;
  patientCount: number;
  status?: 'active' | 'inactive' | string;
}

export interface ClinicRecord {
  timestamp: string;
  patientName?: string;
  doctorName?: string;
  [key: string]: any;
}
