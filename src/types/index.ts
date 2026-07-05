export type EmployeeRole = 'employee' | 'supervisor' | 'hr' | 'admin';
export type EmploymentType = 'full_time' | 'part_time' | 'temporary';
export type CheckInMethod = 'gps_face' | 'qr' | 'kiosk';
export type AttendanceStatus = 'on_time' | 'late' | 'absent';
export type RequestType = 'leave' | 'half_day' | 'remote_work' | 'permission_slip';
export type LeaveType = 'annual' | 'sick' | 'personal';
export type RequestStatus = 'pending' | 'in_review' | 'approved' | 'rejected';
export type ApprovalStepName = 'submitted' | 'team_lead' | 'manager' | 'hr';
export type ApprovalStepState = 'done' | 'in_progress' | 'pending';
export type ExpenseType = 'transport' | 'meals' | 'supplies' | 'accommodation';
export type NotificationChannel = 'email' | 'sms' | 'in_app';
export type ActivityKind =
  | 'check_in'
  | 'check_in_late'
  | 'check_out'
  | 'request_submitted'
  | 'request_approved'
  | 'request_rejected'
  | 'receipt_uploaded';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: string;
  employmentType: EmploymentType;
  joinedAt: string; // ISO date
  workLocationId: string;
  allowedCheckInMethods: CheckInMethod[];
  leaveBalance: number; // days remaining
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // ISO date (day)
  clockIn: string; // ISO datetime
  clockOut: string | null;
  breakMinutes: number;
  hours: number | null;
  workLocationId: string;
  method: CheckInMethod;
  status: AttendanceStatus;
  live: boolean; // true while shift is still open
}

export interface ApprovalStep {
  step: ApprovalStepName;
  state: ApprovalStepState;
  date: string | null;
}

export interface Request {
  id: string;
  employeeId: string;
  type: RequestType;
  leaveType: LeaveType | null;
  dateFrom: string;
  dateTo: string;
  days: number;
  reason: string;
  attachmentUrl: string | null;
  status: RequestStatus;
  approvalSteps: ApprovalStep[];
  submittedAt: string;
  decidedAt: string | null;
  decidedBy: string | null;
}

export interface Reimbursement {
  id: string;
  employeeId: string;
  expenseType: ExpenseType;
  description: string;
  date: string;
  amountMUR: number;
  receiptUrl: string | null;
  status: RequestStatus; // reuses pending/in_review/approved/rejected
  submittedAt: string;
  decidedAt: string | null;
}

export interface WorkLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  radiusMeters: number;
}

export interface Shift {
  id: string;
  name: string;
  start: string; // 'HH:MM'
  end: string; // 'HH:MM'
  type: 'general' | 'night' | 'split';
  graceMinutes: number;
}

export interface BusinessSettings {
  companyName: string;
  logoUrl: string;
  employeeCount: number;
  shifts: Shift[];
  workLocations: WorkLocation[];
  checkInMethods: CheckInMethod[];
  leaveTypes: LeaveType[];
  approvalFlow: ApprovalStepName[];
  notificationChannels: NotificationChannel[];
}

export interface ActivityEvent {
  id: string;
  employeeId: string;
  kind: ActivityKind;
  at: string; // ISO datetime
}

// UI-only helper types (not part of the spec's data contract)
export interface ReportCardDef {
  id: string;
  title: string;
  description: string;
  icon: 'overtime' | 'absence' | 'qr' | 'department';
}

export interface SettingsSectionDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}
