import type { AuthUser, AuthSession, InviteCode } from '../types/auth';

const USERS_KEY = 'chronix_auth_users';
const SESSION_KEY = 'chronix_auth_session';
const SESSION_TTL = 8 * 60 * 60 * 1000;       // 8 hours default
const SESSION_REMEMBER = 30 * 24 * 60 * 60 * 1000; // 30 days

// ── Crypto helpers ────────────────────────────────────────────────────────────

export function generateSalt(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', encoder.encode(password + salt));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verify(password: string, salt: string, hash: string): Promise<boolean> {
  return (await hashPassword(password, salt)) === hash;
}

// ── Storage helpers ───────────────────────────────────────────────────────────

export function getStoredUsers(): AuthUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

export function saveUsers(users: AuthUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s: AuthSession = JSON.parse(raw);
    if (new Date(s.expiresAt).getTime() < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch { return null; }
}

function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ── Default seed accounts ─────────────────────────────────────────────────────

export async function createDefaultUsers(): Promise<void> {
  if (getStoredUsers().length > 0) return;

  const adminSalt = generateSalt();
  const superSalt = generateSalt();
  const [adminHash, superHash] = await Promise.all([
    hashPassword('Admin@123', adminSalt),
    hashPassword('Super@123', superSalt),
  ]);

  saveUsers([
    {
      id: 'auth-admin-default',
      name: 'System Administrator',
      email: 'admin@chronix.mu',
      role: 'admin',
      passwordHash: adminHash,
      salt: adminSalt,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'auth-super-default',
      name: 'Site Supervisor',
      email: 'supervisor@chronix.mu',
      role: 'supervisor',
      passwordHash: superHash,
      salt: superSalt,
      createdAt: new Date().toISOString(),
    },
  ]);
}

// ── Auth actions ──────────────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string,
  remember: boolean
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  const users = getStoredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return { success: false, error: 'No account found with that email address.' };

  const ok = await verify(password, user.salt, user.passwordHash);
  if (!ok) return { success: false, error: 'Incorrect password. Please try again.' };

  const session: AuthSession = {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    role: user.role,
    workerId: user.workerId,
    expiresAt: new Date(Date.now() + (remember ? SESSION_REMEMBER : SESSION_TTL)).toISOString(),
  };
  saveSession(session);
  return { success: true, session };
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: AuthUser['role'],
  workerId?: string,
  inviteCode?: string
): Promise<{ success: boolean; error?: string }> {
  const users = getStoredUsers();
  if (users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()))
    return { success: false, error: 'An account with this email already exists.' };
  if (password.length < 8)
    return { success: false, error: 'Password must be at least 8 characters.' };

  // Supervisor and worker registrations require a valid invite code
  if (role === 'supervisor' || role === 'worker') {
    if (!inviteCode?.trim())
      return { success: false, error: `A ${role} invite code is required to register.` };
    const codeResult = validateInviteCode(inviteCode.trim().toUpperCase(), role);
    if (!codeResult.valid)
      return { success: false, error: codeResult.error };
    // Consume the code after all validations pass
    consumeInviteCode(codeResult.invite!.id, name.trim());
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);

  const newUser: AuthUser = {
    id: 'auth-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    passwordHash,
    salt,
    workerId,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  return { success: true };
}

export function getAllUsers(): AuthUser[] {
  return getStoredUsers();
}

export function deleteAuthUser(id: string): void {
  saveUsers(getStoredUsers().filter(u => u.id !== id));
}

// ── Invite codes ──────────────────────────────────────────────────────────────

const CODES_KEY = 'chronix_invite_codes';
const CODE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function makeCodeString(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const raw = Array.from(bytes).map(b => chars[b % chars.length]).join('');
  return raw.slice(0, 4) + '-' + raw.slice(4);
}

export function getInviteCodes(): InviteCode[] {
  try { return JSON.parse(localStorage.getItem(CODES_KEY) || '[]'); }
  catch { return []; }
}

function saveInviteCodes(codes: InviteCode[]): void {
  localStorage.setItem(CODES_KEY, JSON.stringify(codes));
}

export function generateInviteCode(
  targetRole: 'supervisor' | 'worker',
  createdBy: string,
  createdByName: string
): InviteCode {
  const code: InviteCode = {
    id: 'ic-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
    code: makeCodeString(),
    targetRole,
    createdBy,
    createdByName,
    used: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + CODE_TTL).toISOString(),
  };
  saveInviteCodes([...getInviteCodes(), code]);
  return code;
}

export function validateInviteCode(
  code: string,
  targetRole: string
): { valid: boolean; error?: string; invite?: InviteCode } {
  const all = getInviteCodes();
  const invite = all.find(c => c.code === code);
  if (!invite) return { valid: false, error: 'Invalid invite code.' };
  if (invite.used) return { valid: false, error: 'This invite code has already been used.' };
  if (new Date(invite.expiresAt).getTime() < Date.now())
    return { valid: false, error: 'This invite code has expired.' };
  if (invite.targetRole !== targetRole)
    return { valid: false, error: `This code is for a ${invite.targetRole} account, not ${targetRole}.` };
  return { valid: true, invite };
}

function consumeInviteCode(id: string, usedByName: string): void {
  saveInviteCodes(
    getInviteCodes().map(c => c.id === id ? { ...c, used: true, usedByName } : c)
  );
}

export function revokeInviteCode(id: string): void {
  saveInviteCodes(getInviteCodes().filter(c => c.id !== id));
}

export function validateAndConsumeInviteCode(
  code: string,
  targetRole: 'supervisor' | 'worker',
  usedByName: string
): { valid: boolean; error?: string } {
  const result = validateInviteCode(code, targetRole);
  if (!result.valid) return { valid: false, error: result.error };
  consumeInviteCode(result.invite!.id, usedByName);
  return { valid: true };
}
