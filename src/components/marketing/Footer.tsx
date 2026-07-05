import { useLanguage } from '../../hooks/useLanguage';
import logo from '../../assets/chronix_logo.png';

const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Industries', href: '#industries' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    heading: 'Industries',
    links: [
      { label: 'Hospitality', href: '#industries' },
      { label: 'Construction', href: '#industries' },
      { label: 'Retail', href: '#industries' },
      { label: 'Manufacturing', href: '#industries' },
      { label: 'Logistics', href: '#industries' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
];

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div style={{ background: '#fff', borderRadius: 8, padding: '0.4rem 0.7rem', display: 'inline-flex', marginBottom: '0.75rem' }}>
            <img src={logo} alt="Chronix" style={{ height: 20, display: 'block' }} />
          </div>
          <p style={{ fontSize: '0.85rem', maxWidth: 320 }}>{t('footerTagline')}</p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div className="footer-column" key={column.heading}>
            <h4>{column.heading}</h4>
            {column.links.map((link) => (
              <a href={link.href} key={link.label}>{link.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Chronix. All rights reserved.</p>
        <p>Made for Mauritian businesses.</p>
      </div>
    </footer>
  );
}
