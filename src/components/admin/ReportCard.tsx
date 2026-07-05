import { Clock, UserX, QrCode, Building2 } from 'lucide-react';
import type { ReportCardDef } from '../../types';

const ICONS = { overtime: Clock, absence: UserX, qr: QrCode, department: Building2 };

export function ReportCard({ def, onGenerate }: { def: ReportCardDef; onGenerate: () => void }) {
  const Icon = ICONS[def.icon];
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="stat-card-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
        <Icon size={20} />
      </div>
      <h3 style={{ fontSize: '1rem' }}>{def.title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>{def.description}</p>
      <button className="btn btn-outline" style={{ color: 'var(--chronix-navy)', borderColor: 'var(--chronix-navy)' }} onClick={onGenerate}>
        Generate Report →
      </button>
    </div>
  );
}
