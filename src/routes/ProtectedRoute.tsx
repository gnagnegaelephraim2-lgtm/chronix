import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import type { SessionView } from '../types/session';

export function ProtectedRoute({ view, children }: { view: SessionView; children: ReactNode }) {
  const { session } = useSession();

  if (!session) return <Navigate to="/login" replace />;
  if (session.view !== view) return <Navigate to={session.view === 'admin' ? '/admin' : '/employee'} replace />;

  return <>{children}</>;
}
