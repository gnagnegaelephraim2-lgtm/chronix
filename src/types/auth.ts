export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'worker';
  passwordHash: string;
  salt: string;
  workerId?: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  userName: string;
  userEmail: string;
  role: 'admin' | 'supervisor' | 'worker';
  workerId?: string;
  expiresAt: string;
}

export interface InviteCode {
  id: string;
  code: string;
  targetRole: 'supervisor' | 'worker';
  createdBy: string;
  createdByName: string;
  used: boolean;
  usedByName?: string;
  createdAt: string;
  expiresAt: string;
}
