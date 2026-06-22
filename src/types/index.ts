export interface PermitDetails {
  workPermitExpiry: string; // YYYY-MM-DD
  entryPermitDetails: string;
  studentPermitDetails: string;
  contractorAssignment: string;
  permittedWorkCategories: string;
}

export interface Worker {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  hourlySalary: number;
  passportOrNcid: string;
  department: string;
  pin: string;
  password?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  permitDetails: PermitDetails;
}

export interface ClockLog {
  id: string;
  workerId: string;
  clockIn: string; // ISO date string
  clockOut?: string; // ISO date string
  totalHours?: number;
  latitude?: number;
  longitude?: number;
  method: 'kiosk_face' | 'kiosk_pin' | 'kiosk_password' | 'worker_portal' | 'supervisor_group';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'shift' | 'news' | 'safety' | 'payroll' | 'urgent';
  date: string; // ISO date string
  sender: string;
}

export interface PaymentHistory {
  id: string;
  workerId: string;
  workerName: string;
  totalHours: number;
  rate: number;
  amountPaid: number;
  dateProcessed: string; // ISO date string
  status: 'completed' | 'pending';
  referenceId: string;
}
