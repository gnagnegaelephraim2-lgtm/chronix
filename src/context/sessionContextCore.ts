import { createContext } from 'react';
import type { Session, SessionView } from '../types/session';

export interface SessionContextValue {
  session: Session | null;
  loginAs: (view: SessionView, employeeId?: string) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
