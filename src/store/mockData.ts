import type {
  Employee,
  AttendanceRecord,
  Request,
  Reimbursement,
  WorkLocation,
  Shift,
  BusinessSettings,
  ActivityEvent,
  ApprovalStep,
} from '../types';
import { localDateString } from '../utils/format';

// Deterministic-ish PRNG so demo data looks the same across restarts within a day.
let seed = 42;
function rand(): number {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

const isoDate = localDateString;

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

interface EmployeeSeed {
  id: string;
  firstName: string;
  lastName: string;
  role: Employee['role'];
  department: string;
  employmentType: Employee['employmentType'];
}

const EMPLOYEE_SEEDS: EmployeeSeed[] = [
  { id: 'emp-owner', firstName: 'Vikash', lastName: 'Dabee', role: 'admin', department: 'Admin', employmentType: 'full_time' },
  { id: 'emp-hr', firstName: 'Marie-Ange', lastName: 'Bibi', role: 'hr', department: 'Admin', employmentType: 'full_time' },
  { id: 'emp-sup', firstName: 'Jean-Pierre', lastName: 'Le Bon', role: 'supervisor', department: 'Operations', employmentType: 'full_time' },
  { id: 'emp-1', firstName: 'Priya', lastName: 'Sharma', role: 'employee', department: 'Sales', employmentType: 'full_time' },
  { id: 'emp-2', firstName: 'Arjun', lastName: 'Patel', role: 'employee', department: 'Sales', employmentType: 'full_time' },
  { id: 'emp-3', firstName: 'Neha', lastName: 'Verma', role: 'employee', department: 'Front Office', employmentType: 'full_time' },
  { id: 'emp-4', firstName: 'Devendra', lastName: 'Ramgoolam', role: 'employee', department: 'Warehouse', employmentType: 'full_time' },
  { id: 'emp-5', firstName: 'Fatima', lastName: 'Bibi', role: 'employee', department: 'Housekeeping', employmentType: 'part_time' },
  { id: 'emp-6', firstName: 'Kevin', lastName: 'Appadoo', role: 'employee', department: 'Operations', employmentType: 'full_time' },
  { id: 'emp-7', firstName: 'Yashvin', lastName: 'Ramtohul', role: 'employee', department: 'Warehouse', employmentType: 'full_time' },
  { id: 'emp-8', firstName: 'Ashwina', lastName: 'Goorapah', role: 'employee', department: 'Front Office', employmentType: 'full_time' },
  { id: 'emp-9', firstName: 'Loic', lastName: 'Perrine', role: 'employee', department: 'Housekeeping', employmentType: 'full_time' },
  { id: 'emp-10', firstName: 'Sarah', lastName: 'Cheung', role: 'employee', department: 'Sales', employmentType: 'temporary' },
  { id: 'emp-11', firstName: 'Rajesh', lastName: 'Beeharry', role: 'employee', department: 'Operations', employmentType: 'full_time' },
  { id: 'emp-12', firstName: 'Anaïs', lastName: 'Poinen', role: 'employee', department: 'Housekeeping', employmentType: 'part_time' },
  { id: 'emp-13', firstName: 'Deepak', lastName: 'Seebun', role: 'employee', department: 'Warehouse', employmentType: 'full_time' },
];

export const EMPLOYEES: Employee[] = EMPLOYEE_SEEDS.map((seed, i) => ({
  id: seed.id,
  firstName: seed.firstName,
  lastName: seed.lastName,
  avatarUrl: `https://i.pravatar.cc/150?u=${seed.id}`,
  email: `${seed.firstName.toLowerCase()}.${seed.lastName.toLowerCase().replace(/[^a-z]/g, '')}@chronix-demo.mu`,
  phone: `+230 5${700 + i * 3}${1000 + i}`,
  role: seed.role,
  department: seed.department,
  employmentType: seed.employmentType,
  joinedAt: isoDate(new Date(2023, i % 12, (i * 3) % 27 + 1)),
  workLocationId: WORK_LOCATIONS[i % WORK_LOCATIONS.length].id,
  allowedCheckInMethods: i % 3 === 0 ? ['gps_face', 'qr'] : ['gps_face'],
  leaveBalance: 14 - (i % 6),
}));

// ---- Attendance: last 14 days per employee ----
function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  EMPLOYEES.forEach((emp) => {
    for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
      const day = new Date(today);
      day.setDate(day.getDate() - dayOffset);

      const isToday = dayOffset === 0;
      const roll = rand();
      let status: AttendanceRecord['status'];
      if (roll < 0.13) status = 'absent';
      else if (roll < 0.33) status = 'late';
      else status = 'on_time';

      if (status === 'absent') {
        records.push({
          id: `att-${emp.id}-${isoDate(day)}`,
          employeeId: emp.id,
          date: isoDate(day),
          clockIn: '',
          clockOut: null,
          breakMinutes: 0,
          hours: null,
          workLocationId: emp.workLocationId,
          method: 'gps_face',
          status: 'absent',
          live: false,
        });
        continue;
      }

      const clockInMinute = status === 'late' ? 15 + Math.floor(rand() * 40) : Math.floor(rand() * 10);
      const clockInHour = 9 + Math.floor(clockInMinute / 60);
      const clockInDate = new Date(day);
      clockInDate.setHours(clockInHour, clockInMinute % 60, 0, 0);

      const leaveEarly = isToday && rand() < 0.15; // a few employees still clocked in "live" today
      const method = pick<AttendanceRecord['method']>(emp.allowedCheckInMethods.length ? emp.allowedCheckInMethods : ['gps_face']);

      if (leaveEarly) {
        records.push({
          id: `att-${emp.id}-${isoDate(day)}`,
          employeeId: emp.id,
          date: isoDate(day),
          clockIn: clockInDate.toISOString(),
          clockOut: null,
          breakMinutes: 30,
          hours: null,
          workLocationId: emp.workLocationId,
          method,
          status,
          live: true,
        });
      } else {
        const hours = 7.5 + rand() * 1.5;
        const clockOutDate = new Date(clockInDate.getTime() + hours * 3600 * 1000);
        records.push({
          id: `att-${emp.id}-${isoDate(day)}`,
          employeeId: emp.id,
          date: isoDate(day),
          clockIn: clockInDate.toISOString(),
          clockOut: clockOutDate.toISOString(),
          breakMinutes: 30,
          hours: Math.round(hours * 100) / 100,
          workLocationId: emp.workLocationId,
          method,
          status,
          live: false,
        });
      }
    }
  });

  return records;
}

export const ATTENDANCE_RECORDS: AttendanceRecord[] = generateAttendance();

// ---- Requests ----
function stepsFor(status: Request['status'], submitted: Date): ApprovalStep[] {
  const flow: Array<{ step: ApprovalStep['step']; offsetDays: number }> = [
    { step: 'submitted', offsetDays: 0 },
    { step: 'team_lead', offsetDays: 1 },
    { step: 'manager', offsetDays: 2 },
    { step: 'hr', offsetDays: 3 },
  ];
  const doneCount = status === 'approved' || status === 'rejected' ? 4 : status === 'in_review' ? 2 : 1;
  return flow.map((f, i) => ({
    step: f.step,
    state: i < doneCount ? 'done' : i === doneCount ? 'in_progress' : 'pending',
    date: i < doneCount ? isoDate(new Date(submitted.getTime() + f.offsetDays * 86400000)) : null,
  }));
}

const today = new Date();
function daysAgo(n: number): Date {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
}
function daysFromNow(n: number): Date {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d;
}

export const REQUESTS: Request[] = [
  {
    id: 'req-1', employeeId: 'emp-1', type: 'leave', leaveType: 'annual',
    dateFrom: isoDate(daysFromNow(5)), dateTo: isoDate(daysFromNow(7)), days: 3,
    reason: 'Family trip to Rodrigues.', attachmentUrl: null, status: 'pending',
    approvalSteps: stepsFor('pending', daysAgo(1)), submittedAt: daysAgo(1).toISOString(),
    decidedAt: null, decidedBy: null,
  },
  {
    id: 'req-2', employeeId: 'emp-2', type: 'leave', leaveType: 'sick',
    dateFrom: isoDate(daysAgo(2)), dateTo: isoDate(daysAgo(1)), days: 2,
    reason: 'Flu, doctor advised rest.', attachmentUrl: '/mock/receipts/medical-note.pdf', status: 'in_review',
    approvalSteps: stepsFor('in_review', daysAgo(3)), submittedAt: daysAgo(3).toISOString(),
    decidedAt: null, decidedBy: null,
  },
  {
    id: 'req-3', employeeId: 'emp-4', type: 'remote_work', leaveType: null,
    dateFrom: isoDate(daysFromNow(1)), dateTo: isoDate(daysFromNow(1)), days: 1,
    reason: 'Waiting for a home delivery, will work from home.', attachmentUrl: null, status: 'approved',
    approvalSteps: stepsFor('approved', daysAgo(4)), submittedAt: daysAgo(4).toISOString(),
    decidedAt: daysAgo(2).toISOString(), decidedBy: 'emp-hr',
  },
  {
    id: 'req-4', employeeId: 'emp-6', type: 'half_day', leaveType: null,
    dateFrom: isoDate(daysFromNow(2)), dateTo: isoDate(daysFromNow(2)), days: 0.5,
    reason: 'Dentist appointment in the afternoon.', attachmentUrl: null, status: 'pending',
    approvalSteps: stepsFor('pending', daysAgo(0)), submittedAt: daysAgo(0).toISOString(),
    decidedAt: null, decidedBy: null,
  },
  {
    id: 'req-5', employeeId: 'emp-8', type: 'leave', leaveType: 'personal',
    dateFrom: isoDate(daysAgo(10)), dateTo: isoDate(daysAgo(8)), days: 3,
    reason: 'Personal matters.', attachmentUrl: null, status: 'rejected',
    approvalSteps: stepsFor('rejected', daysAgo(14)), submittedAt: daysAgo(14).toISOString(),
    decidedAt: daysAgo(12).toISOString(), decidedBy: 'emp-hr',
  },
  {
    id: 'req-6', employeeId: 'emp-9', type: 'permission_slip', leaveType: null,
    dateFrom: isoDate(daysFromNow(3)), dateTo: isoDate(daysFromNow(3)), days: 0.25,
    reason: 'Leaving 2 hours early for a school meeting.', attachmentUrl: null, status: 'pending',
    approvalSteps: stepsFor('pending', daysAgo(0)), submittedAt: daysAgo(0).toISOString(),
    decidedAt: null, decidedBy: null,
  },
  {
    id: 'req-7', employeeId: 'emp-11', type: 'leave', leaveType: 'annual',
    dateFrom: isoDate(daysFromNow(20)), dateTo: isoDate(daysFromNow(24)), days: 5,
    reason: 'Annual family holiday.', attachmentUrl: null, status: 'approved',
    approvalSteps: stepsFor('approved', daysAgo(5)), submittedAt: daysAgo(5).toISOString(),
    decidedAt: daysAgo(3).toISOString(), decidedBy: 'emp-hr',
  },
];

// ---- Reimbursements ----
export const REIMBURSEMENTS: Reimbursement[] = [
  {
    id: 'reim-1', employeeId: 'emp-1', expenseType: 'transport', description: 'Taxi to client site in Curepipe',
    date: isoDate(daysAgo(2)), amountMUR: 450, receiptUrl: '/mock/receipts/taxi-1.jpg', status: 'pending',
    submittedAt: daysAgo(2).toISOString(), decidedAt: null,
  },
  {
    id: 'reim-2', employeeId: 'emp-3', expenseType: 'meals', description: 'Client lunch meeting',
    date: isoDate(daysAgo(5)), amountMUR: 850, receiptUrl: '/mock/receipts/lunch-1.jpg', status: 'approved',
    submittedAt: daysAgo(5).toISOString(), decidedAt: daysAgo(4).toISOString(),
  },
  {
    id: 'reim-3', employeeId: 'emp-6', expenseType: 'supplies', description: 'Printer cartridges for the office',
    date: isoDate(daysAgo(7)), amountMUR: 1200, receiptUrl: '/mock/receipts/supplies-1.jpg', status: 'approved',
    submittedAt: daysAgo(7).toISOString(), decidedAt: daysAgo(6).toISOString(),
  },
  {
    id: 'reim-4', employeeId: 'emp-7', expenseType: 'accommodation', description: 'Overnight stay for warehouse audit in Curepipe',
    date: isoDate(daysAgo(9)), amountMUR: 2400, receiptUrl: '/mock/receipts/hotel-1.jpg', status: 'rejected',
    submittedAt: daysAgo(9).toISOString(), decidedAt: daysAgo(8).toISOString(),
  },
  {
    id: 'reim-5', employeeId: 'emp-10', expenseType: 'transport', description: 'Bus fare reimbursement (weekly)',
    date: isoDate(daysAgo(1)), amountMUR: 180, receiptUrl: null, status: 'pending',
    submittedAt: daysAgo(1).toISOString(), decidedAt: null,
  },
  {
    id: 'reim-6', employeeId: 'emp-13', expenseType: 'meals', description: 'Overtime dinner allowance',
    date: isoDate(daysAgo(3)), amountMUR: 350, receiptUrl: '/mock/receipts/dinner-1.jpg', status: 'in_review',
    submittedAt: daysAgo(3).toISOString(), decidedAt: null,
  },
];

// ---- Business settings ----
export const BUSINESS_SETTINGS: BusinessSettings = {
  companyName: 'Étoile Resort & Spa',
  logoUrl: '/chronix_logo.png',
  employeeCount: EMPLOYEES.length,
  shifts: SHIFTS,
  workLocations: WORK_LOCATIONS,
  checkInMethods: ['gps_face', 'qr', 'kiosk'],
  leaveTypes: ['annual', 'sick', 'personal'],
  approvalFlow: ['submitted', 'team_lead', 'manager', 'hr'],
  notificationChannels: ['email', 'in_app'],
};

// ---- Activity events derived from attendance + requests + reimbursements ----
function generateActivity(): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  let n = 0;

  ATTENDANCE_RECORDS
    .filter((r) => r.status !== 'absent')
    .forEach((r) => {
      events.push({ id: `act-${n++}`, employeeId: r.employeeId, kind: r.status === 'late' ? 'check_in_late' : 'check_in', at: r.clockIn });
      if (r.clockOut) {
        events.push({ id: `act-${n++}`, employeeId: r.employeeId, kind: 'check_out', at: r.clockOut });
      }
    });

  REQUESTS.forEach((r) => {
    events.push({ id: `act-${n++}`, employeeId: r.employeeId, kind: 'request_submitted', at: r.submittedAt });
    if (r.status === 'approved' && r.decidedAt) {
      events.push({ id: `act-${n++}`, employeeId: r.employeeId, kind: 'request_approved', at: r.decidedAt });
    } else if (r.status === 'rejected' && r.decidedAt) {
      events.push({ id: `act-${n++}`, employeeId: r.employeeId, kind: 'request_rejected', at: r.decidedAt });
    }
  });

  REIMBURSEMENTS.forEach((r) => {
    events.push({ id: `act-${n++}`, employeeId: r.employeeId, kind: 'request_submitted', at: r.submittedAt });
    if (r.receiptUrl) {
      events.push({ id: `act-${n++}`, employeeId: r.employeeId, kind: 'receipt_uploaded', at: r.submittedAt });
    }
    if (r.status === 'approved' && r.decidedAt) {
      events.push({ id: `act-${n++}`, employeeId: r.employeeId, kind: 'request_approved', at: r.decidedAt });
    } else if (r.status === 'rejected' && r.decidedAt) {
      events.push({ id: `act-${n++}`, employeeId: r.employeeId, kind: 'request_rejected', at: r.decidedAt });
    }
  });

  return events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export const ACTIVITY_EVENTS: ActivityEvent[] = generateActivity();
