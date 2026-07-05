import { Clock, CalendarDays, Receipt, BarChart3, MapPin, QrCode } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const FEATURES = [
  { icon: Clock, title: 'Real-time Attendance', description: 'Track clock-ins and clock-outs as they happen, across every location.' },
  { icon: MapPin, title: 'GPS + Face Check-In', description: 'Verify staff are on-site with location-aware check-ins.' },
  { icon: QrCode, title: 'QR Code Attendance', description: 'Quick, contactless check-in for shared terminals.' },
  { icon: CalendarDays, title: 'Leave Management', description: 'Approve or reject leave requests with a full audit trail.' },
  { icon: Receipt, title: 'Reimbursements', description: 'Review expense claims and receipts in one place.' },
  { icon: BarChart3, title: 'Reports & Insights', description: 'Overtime, absence, QR, and department reports, exportable to CSV.' },
];

export function FeaturesSection() {
  const { t } = useLanguage();
  const revealRef = useScrollReveal<HTMLElement>();
  return (
    <section className="section reveal" id="features" ref={revealRef}>
      <h2 className="section-title">{t('featuresTitle')}</h2>
      <div className="features-grid">
        {FEATURES.map((f) => (
          <div className="card" key={f.title}>
            <div className="stat-card-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              <f.icon size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', margin: '0.75rem 0 0.4rem' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
