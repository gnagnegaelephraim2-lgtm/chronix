import { Avatar } from '../common/Avatar';
import { useLanguage } from '../../hooks/useLanguage';
import type { Employee } from '../../types';

export function StatusCard({ employee, isClockedIn }: { employee: Employee; isClockedIn: boolean }) {
  const { t } = useLanguage();
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar src={employee.avatarUrl} name={`${employee.firstName} ${employee.lastName}`} size={56} />
      <div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Attendance status</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: isClockedIn ? 'var(--success)' : 'var(--text-primary)' }}>
          {isClockedIn ? t('clockedIn') : t('notClockedIn')}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('haveAProductiveDay')}</div>
      </div>
    </div>
  );
}
