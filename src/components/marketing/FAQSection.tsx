import { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const FAQS_DATA = {
  en: [
    { q: 'Do my employees need to download an app?', a: 'No. Chronix works entirely in the browser, on desktop or mobile, including iOS webviews. Employees simply navigate to the login page and access their interface without install overhead.' },
    { q: 'How does location-based check-in work?', a: 'Employees clock in from within an allowed radius of a work location set by your business. Our system verifies their GPS position during check-in to confirm they are physically on site.' },
    { q: 'Is payroll processing included?', a: 'Payroll integration is coming soon. Today, Chronix generates payroll-ready CSV exports containing complete records of active work hours, breaks, and overtime.' },
    { q: 'Can I try it before committing?', a: 'Yes! You can sign up and explore the full Admin dashboard and Employee interface. You can set up your own office locations and add demo employees to experience it live.' },
    { q: 'What devices are supported for QR kiosk mode?', a: 'Any tablet, iPad, computer, or smartphone with a working front-facing camera. Simply position the device at your entrance, open Kiosk Mode in settings, and let staff scan their codes.' }
  ],
  fr: [
    { q: 'Mes employés doivent-ils télécharger une application ?', a: 'Non. Chronix fonctionne entièrement dans le navigateur, sur ordinateur ou mobile, y compris les webviews iOS. Vos employés se connectent directement sans aucune installation.' },
    { q: 'Comment fonctionne le pointage par localisation GPS ?', a: 'Les employés pointent depuis un rayon autorisé autour des bureaux définis par vos soins. Le système vérifie les coordonnées GPS de leur appareil lors de la validation.' },
    { q: 'La préparation de la paie est-elle intégrée ?', a: 'L\'intégration de paie automatique arrive bientôt. Actuellement, Chronix génère des exports de feuilles d\'heures complets au format CSV prêts pour la paie.' },
    { q: 'Puis-je essayer avant de m\'engager ?', a: 'Oui ! Créez un compte et explorez l\'intégralité des interfaces Administrateur et Employé avec vos propres données de test, sans frais.' },
    { q: 'Quels appareils sont compatibles avec le mode borne QR ?', a: 'Toute tablette, iPad ou ordinateur équipé d\'une caméra frontale. Placez l\'appareil à l\'entrée, ouvrez le mode Borne dans les paramètres, et laissez vos équipes scanner.' }
  ]
} as const;

const FAQ_LEFT_DATA = {
  en: {
    badge: 'Support Desk',
    title: 'Frequently Asked Questions',
    desc: 'Cannot find the answer you are looking for? Our local Mauritian support team is here to assist you with onboarding, shift schedules, geofencing setup, and payroll exports.',
    ctaTitle: 'Need Direct Help?',
    ctaText: 'Speak to a human or write to us for rapid assistance:',
    email: 'support@chronix.mu',
    phone: '+230 5700 1234',
  },
  fr: {
    badge: 'Centre d\'Aide',
    title: 'Questions Fréquentes',
    desc: 'Vous ne trouvez pas la réponse à vos questions ? Notre équipe locale à Maurice est à votre service pour vous guider lors de l\'intégration de vos salariés ou du paramétrage des horaires.',
    ctaTitle: 'Besoin d\'Aide Directe ?',
    ctaText: 'Échangez avec un conseiller local pour une assistance rapide :',
    email: 'support@chronix.mu',
    phone: '+230 5700 1234',
  }
} as const;

export function FAQSection() {
  const { lang } = useLanguage();
  const revealRef = useScrollReveal<HTMLElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const activeFaqs = FAQS_DATA[lang === 'fr' ? 'fr' : 'en'];
  const leftData = FAQ_LEFT_DATA[lang === 'fr' ? 'fr' : 'en'];

  return (
    <section className="section reveal" id="faq" ref={revealRef}>
      <div className="faq-two-column">
        {/* Left Column: Glamorous Info Column */}
        <div className="faq-info-col">
          <span className="faq-info-badge">{leftData.badge}</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--chronix-navy)', lineHeight: 1.25 }}>
            {leftData.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
            {leftData.desc}
          </p>

          <div className="faq-info-cta">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--chronix-navy)' }}>
              {leftData.ctaTitle}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 1rem 0' }}>
              {leftData.ctaText}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href={`mailto:${leftData.email}`} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.85rem', 
                  color: 'var(--chronix-navy)', 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                <Mail size={16} style={{ color: 'var(--chronix-amber)' }} />
                {leftData.email}
              </a>
              <a 
                href={`tel:${leftData.phone.replace(/\s+/g, '')}`} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.85rem', 
                  color: 'var(--chronix-navy)', 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                <PhoneCall size={16} style={{ color: 'var(--chronix-amber)' }} />
                {leftData.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Accordion */}
        <div className="faq-accordion-col">
          <div className="faq-list">
            {activeFaqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`} key={item.q}>
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    style={{ background: 'transparent' }}
                  >
                    <span className="faq-icon">
                      <HelpCircle size={18} />
                    </span>
                    <span className="faq-question-text">{item.q}</span>
                    <ChevronDown className="faq-chevron" size={18} />
                  </button>
                  <div className="faq-answer-wrap">
                    <div className="faq-answer-inner">
                      <p className="faq-answer">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
