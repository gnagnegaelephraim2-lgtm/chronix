import type {
  Employee,
  AttendanceRecord,
  Request,
  Reimbursement,
  WorkLocation,
  Shift,
  BusinessSettings,
  ActivityEvent,
} from '../types';

export const WORK_LOCATIONS: WorkLocation[] = [
  { id: 'loc-1', name: 'Main office - Port Louis', address: 'Rue du Gouvernement, Port Louis', lat: -20.1609, lng: 57.5012, radiusMeters: 150 },
  { id: 'loc-2', name: 'Curepipe Branch', address: 'Sir Winston Churchill St, Curepipe', lat: -20.3159, lng: 57.5218, radiusMeters: 120 },
  { id: 'loc-3', name: 'Ebène Cybercity Office', address: 'Cybercity, Ebène', lat: -20.2456, lng: 57.4874, radiusMeters: 150 },
];

export const SHIFTS: Shift[] = [
  { id: 'shift-1', name: 'General Shift', start: '09:00', end: '18:00', type: 'general', graceMinutes: 10 },
  { id: 'shift-2', name: 'Night Shift', start: '20:00', end: '05:00', type: 'night', graceMinutes: 15 },
  { id: 'shift-3', name: 'Split Shift', start: '08:00', end: '14:00', type: 'split', graceMinutes: 5 },
];

// No seeded people or activity — every Employee/AttendanceRecord/Request/
// Reimbursement/ActivityEvent is created by real sign-ups and real usage.
export const EMPLOYEES: Employee[] = [];
export const ATTENDANCE_RECORDS: AttendanceRecord[] = [];
export const REQUESTS: Request[] = [];
export const REIMBURSEMENTS: Reimbursement[] = [];
export const ACTIVITY_EVENTS: ActivityEvent[] = [];

export const BUSINESS_SETTINGS: BusinessSettings = {
  companyName: 'Your Business',
  logoUrl: '/chronix_logo.png',
  employeeCount: EMPLOYEES.length,
  shifts: SHIFTS,
  workLocations: WORK_LOCATIONS,
  checkInMethods: ['gps_face', 'qr', 'kiosk'],
  leaveTypes: ['annual', 'sick', 'personal'],
  approvalFlow: ['submitted', 'team_lead', 'manager', 'hr'],
  notificationChannels: ['email', 'in_app'],
};
