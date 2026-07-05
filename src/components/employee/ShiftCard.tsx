import confetti from 'canvas-confetti';
import { useStoreActions } from '../../hooks/useStore';
import { useGeolocationCheck } from '../../hooks/useGeolocationCheck';
import { useLanguage } from '../../hooks/useLanguage';
import type { Employee, Shift, WorkLocation } from '../../types';

interface ShiftCardProps {
  employee: Employee;
  shift: Shift | undefined;
  location: WorkLocation | undefined;
  isClockedIn: boolean;
}

export function ShiftCard({ employee, shift, location, isClockedIn }: ShiftCardProps) {
  const { t } = useLanguage();
  const { clockIn, clockOut } = useStoreActions();
  const geo = useGeolocationCheck(location);

  function handleClockIn() {
    if (!geo.inRange || !location) return;
    clockIn(employee.id, employee.allowedCheckInMethods[0] ?? 'gps_face', location.id);
    confetti({ particleCount: 60, spread: 65, origin: { y: 0.7 } });
  }

  function handleClockOut() {
    clockOut(employee.id);
  }

  return (
    <div className="card">
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{t('currentShift')}</div>
      <div style={{ fontWeight: 600, marginBottom: '1rem' }}>
        {shift ? `${shift.start} – ${shift.end} · ${shift.name}` : '—'}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary-navy" disabled={isClockedIn || !geo.inRange} onClick={handleClockIn} style={{ flex: 1 }}>
          {t('clockInCta')}
        </button>
        <button className="btn btn-primary-amber" disabled={!isClockedIn} onClick={handleClockOut} style={{ flex: 1 }}>
          {t('clockOutCta')}
        </button>
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
        {isClockedIn ? t('clockOutSub') : t('clockInSub')}
      </div>
    </div>
  );
}
