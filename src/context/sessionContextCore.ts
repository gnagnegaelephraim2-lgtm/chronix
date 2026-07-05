import { createContext } from 'react';
import type { Session, SessionView } from '../types/session';
import type { Employee } from '../types';

export interface SessionContextValue {
  session: Session | null;
  // Accepts an id (looked up in current store state — fine for an employee
  // that already exists there) or a full Employee object (for one just
  // created via addEmployee in the same event handler, whose id wouldn't be
  // found yet — the store update hasn't been reflected back into this
  // context's state closure at that point).
  loginAs: (view: SessionView, employeeOrId?: string | Employee) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
