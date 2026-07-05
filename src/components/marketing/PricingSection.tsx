import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

export function PricingSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="section" id="pricing">
      <h2 className="section-title">{t('pricingTitle')}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('pricingSubtitle')}</p>
      <div className="pricing-grid">
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Per active employee</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>
            Rs 100<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/month</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Rs 1,500 minimum per business, per month.</p>
          <button className="btn btn-primary-amber" style={{ width: '100%' }} onClick={() => navigate('/login')}>
            {t('getStartedNow')}
          </button>
        </div>
      </div>
    </section>
  );
}
