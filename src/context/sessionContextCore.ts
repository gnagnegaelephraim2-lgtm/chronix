import { createContext } from 'react';
import type { Session, SessionView } from '../types/session';

export interface SessionContextValue {
  session: Session | null;
  loginAs: (view: SessionView) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
