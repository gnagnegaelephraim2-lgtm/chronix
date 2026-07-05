import { useLanguage } from '../../hooks/useLanguage';

const FAQS = [
  { q: 'Do my employees need to download an app?', a: 'No. Chronix works entirely in the browser, on desktop or mobile, including iOS webviews.' },
  { q: 'How does location-based check-in work?', a: 'Employees clock in from within an allowed radius of a work location set by your business, verified via GPS.' },
  { q: 'Is payroll processing included?', a: 'Payroll integration is coming soon. Today, Reports gives you payroll-ready exports in CSV.' },
  { q: 'Can I try it before committing?', a: 'Yes — sign up and explore the full Admin and Employee experience with your own data.' },
];

export function FAQSection() {
  const { t } = useLanguage();
  return (
    <section className="section" id="faq">
      <h2 className="section-title">{t('faqTitle')}</h2>
      <div className="faq-list" style={{ maxWidth: 720 }}>
        {FAQS.map((item) => (
          <div className="card" key={item.q}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>{item.q}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
