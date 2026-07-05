import { useMemo, useState, type ReactNode } from 'react';
import type { Session, SessionView } from '../types/session';
import { useStore } from '../hooks/useStore';
import { SessionContext, type SessionContextValue } from './sessionContextCore';

const STORAGE_KEY = 'chronix_session_v1';

function loadSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const { state } = useStore();
  const [session, setSession] = useState<Session | null>(loadSession);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      loginAs: (view: SessionView) => {
        const wantedRole = view === 'admin' ? 'admin' : 'employee';
        const employee = state.employees.find((e) => e.role === wantedRole) ?? state.employees[0];
        const next: Session = { view, employeeId: employee.id, loggedInAt: new Date().toISOString() };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setSession(next);
      },
      logout: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      },
    }),
    [session, state.employees]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
