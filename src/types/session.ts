export type SessionView = 'admin' | 'employee';

export interface Session {
  view: SessionView;
  employeeId: string;
  loggedInAt: string; // ISO datetime
}
