import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const FAQS = [
  { q: 'Do my employees need to download an app?', a: 'No. Chronix works entirely in the browser, on desktop or mobile, including iOS webviews.' },
  { q: 'How does location-based check-in work?', a: 'Employees clock in from within an allowed radius of a work location set by your business, verified via GPS.' },
  { q: 'Is payroll processing included?', a: 'Payroll integration is coming soon. Today, Reports gives you payroll-ready exports in CSV.' },
  { q: 'Can I try it before committing?', a: 'Yes — sign up and explore the full Admin and Employee experience with your own data.' },
];

export function FAQSection() {
  const { t } = useLanguage();
  const revealRef = useScrollReveal<HTMLElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section reveal" id="faq" ref={revealRef}>
      <h2 className="section-title">{t('faqTitle')}</h2>
      <div className="faq-list" style={{ maxWidth: 720 }}>
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`} key={item.q}>
              <button
                type="button"
                className="faq-question"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
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
    </section>
  );
}
