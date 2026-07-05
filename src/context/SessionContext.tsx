import { useMemo, useState, type ReactNode } from 'react';
import type { Session, SessionView } from '../types/session';
import type { Employee } from '../types';
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
      loginAs: (view: SessionView, employeeOrId?: string | Employee) => {
        let employee: Employee | undefined;
        if (typeof employeeOrId === 'string') {
          employee = state.employees.find((e) => e.id === employeeOrId);
        } else if (employeeOrId) {
          employee = employeeOrId;
        }
        if (!employee) {
          const wantedRole = view === 'admin' ? 'admin' : 'employee';
          employee = state.employees.find((e) => e.role === wantedRole) ?? state.employees[0];
        }
        if (!employee) return; // nothing to log in as — store has no employees and no override was given
        const finalView = employeeOrId
          ? (['admin', 'hr', 'supervisor'].includes(employee.role) ? 'admin' : 'employee')
          : view;
        const next: Session = { view: finalView, employeeId: employee.id, loggedInAt: new Date().toISOString() };
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
