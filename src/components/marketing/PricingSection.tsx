import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const PRICING_DATA = {
  en: {
    badge: 'MOST POPULAR',
    starter: {
      name: 'Starter Plan',
      price: 'Rs 1,500',
      period: '/month',
      desc: 'Perfect for micro-businesses looking to transition from paper logs to a secure, modern digital registry.',
      limit: 'Flat rate for up to 15 employees',
      features: [
        { text: 'GPS geofenced clock-ins', enabled: true },
        { text: 'Standard attendance lists', enabled: true },
        { text: 'Daily shift scheduler', enabled: true },
        { text: 'Standard email reports', enabled: true },
        { text: '1 administrator seat', enabled: true },
        { text: 'QR code scanning kiosk', enabled: false },
        { text: 'Reimbursement receipts tracking', enabled: false },
      ]
    },
    growth: {
      name: 'Growth Plan',
      price: 'Rs 100',
      period: '/employee/month',
      desc: 'Connect multiple branches, unlock advanced leave requests, and track reimbursement claims seamlessly.',
      limit: 'Rs 1,500 minimum monthly charge',
      features: [
        { text: 'Everything in Starter', enabled: true },
        { text: 'Unlimited employee count', enabled: true },
        { text: 'QR code scanning kiosks', enabled: true },
        { text: 'Leave & absence workflows', enabled: true },
        { text: 'Reimbursement claims & receipts', enabled: true },
        { text: 'Department performance reports', enabled: true },
        { text: 'Dedicated payroll format exports', enabled: false },
      ]
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: 'Custom',
      period: '',
      desc: 'Designed for large hotels, factories, and retail chains requiring customized setups and priority support.',
      limit: 'Best for businesses with 100+ staff',
      features: [
        { text: 'Everything in Growth', enabled: true },
        { text: 'Custom payroll CSV formatting', enabled: true },
        { text: 'Priority support & account manager', enabled: true },
        { text: 'Custom geofencing boundaries', enabled: true },
        { text: 'Guided onboarding & HR training', enabled: true },
        { text: '99.9% system uptime SLA', enabled: true },
      ]
    },
    contactSales: 'Contact Sales',
    startTrial: 'Start Free Trial',
  },
  fr: {
    badge: 'LE PLUS POPULAIRE',
    starter: {
      name: 'Plan Débutant',
      price: 'Rs 1 500',
      period: '/mois',
      desc: 'Idéal pour les micro-entreprises souhaitant passer des registres papier à un système numérique sécurisé.',
      limit: 'Tarif fixe jusqu\'à 15 employés',
      features: [
        { text: 'Pointage géolocalisé par GPS', enabled: true },
        { text: 'Listes de présence standard', enabled: true },
        { text: 'Planificateur d\'horaire quotidien', enabled: true },
        { text: 'Rapports par e-mail standard', enabled: true },
        { text: '1 compte administrateur', enabled: true },
        { text: 'Borne de lecture de code QR', enabled: false },
        { text: 'Suivi des reçus de remboursement', enabled: false },
      ]
    },
    growth: {
      name: 'Plan Croissance',
      price: 'Rs 100',
      period: '/employé/mois',
      desc: 'Connectez plusieurs succursales, débloquez les demandes de congé et gérez les notes de frais.',
      limit: 'Facturation minimale de Rs 1 500/mois',
      features: [
        { text: 'Tout ce qui est dans Débutant', enabled: true },
        { text: 'Nombre d\'employés illimité', enabled: true },
        { text: 'Bornes de lecture de code QR', enabled: true },
        { text: 'Flux de congés & absences', enabled: true },
        { text: 'Notes de frais & reçus photos', enabled: true },
        { text: 'Rapports par département', enabled: true },
        { text: 'Exports paie personnalisés', enabled: false },
      ]
    },
    enterprise: {
      name: 'Plan Entreprise',
      price: 'Sur devis',
      period: '',
      desc: 'Conçu pour les grands hôtels, usines et chaînes de magasins nécessitant des configurations spécifiques.',
      limit: 'Idéal pour plus de 100 salariés',
      features: [
        { text: 'Tout ce qui est dans Croissance', enabled: true },
        { text: 'Formats CSV de paie personnalisés', enabled: true },
        { text: 'Support prioritaire & gestionnaire', enabled: true },
        { text: 'Limites de géorepérage sur mesure', enabled: true },
        { text: 'Formation RH & onboarding guidé', enabled: true },
        { text: 'Contrat d\'engagement de service SLA', enabled: true },
      ]
    },
    contactSales: 'Contacter le Support',
    startTrial: 'Démarrer l\'essai gratuit',
  }
} as const;

export function PricingSection() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLElement>();

  const data = PRICING_DATA[lang === 'fr' ? 'fr' : 'en'];

  return (
    <section className="section reveal" id="pricing" ref={revealRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="section-title" style={{ textAlign: 'center' }}>{t('pricingTitle')}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', textAlign: 'center', maxWidth: '600px' }}>
        {t('pricingSubtitle')}
      </p>

      <div className="pricing-grid">
        {/* Starter Plan Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{data.starter.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', minHeight: '60px', margin: '0 0 1rem 0' }}>
            {data.starter.desc}
          </p>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--chronix-navy)' }}>
            {data.starter.price}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{data.starter.period}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1.5rem' }}>
            {data.starter.limit}
          </div>

          <ul className="pricing-features-list" style={{ flexGrow: 1 }}>
            {data.starter.features.map((f, idx) => (
              <li key={idx} className={`pricing-feature-item ${f.enabled ? '' : 'disabled'}`}>
                {f.text}
              </li>
            ))}
          </ul>

          <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate('/signup')}>
            {data.startTrial}
          </button>
        </div>

        {/* Growth Plan Card (Featured) */}
        <div className="card pricing-card--popular" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="popular-badge">{data.badge}</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.5rem 0' }}>{data.growth.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', minHeight: '60px', margin: '0 0 1rem 0' }}>
            {data.growth.desc}
          </p>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--chronix-navy)' }}>
            {data.growth.price}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{data.growth.period}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1.5rem' }}>
            {data.growth.limit}
          </div>

          <ul className="pricing-features-list" style={{ flexGrow: 1 }}>
            {data.growth.features.map((f, idx) => (
              <li key={idx} className={`pricing-feature-item ${f.enabled ? '' : 'disabled'}`}>
                {f.text}
              </li>
            ))}
          </ul>

          <button className="btn btn-primary-amber" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate('/signup')}>
            {data.startTrial}
          </button>
        </div>

        {/* Enterprise Plan Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{data.enterprise.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', minHeight: '60px', margin: '0 0 1rem 0' }}>
            {data.enterprise.desc}
          </p>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--chronix-navy)' }}>
            {data.enterprise.price}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{data.enterprise.period}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1.5rem' }}>
            {data.enterprise.limit}
          </div>

          <ul className="pricing-features-list" style={{ flexGrow: 1 }}>
            {data.enterprise.features.map((f, idx) => (
              <li key={idx} className={`pricing-feature-item ${f.enabled ? '' : 'disabled'}`}>
                {f.text}
              </li>
            ))}
          </ul>

          <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate('/contact')}>
            {data.contactSales}
          </button>
        </div>
      </div>
    </section>
  );
}
