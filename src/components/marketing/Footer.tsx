import { useLanguage } from '../../hooks/useLanguage';
import logo from '../../assets/chronix_logo.png';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div style={{ background: '#fff', borderRadius: 8, padding: '0.4rem 0.7rem', display: 'inline-flex', marginBottom: '0.75rem' }}>
        <img src={logo} alt="Chronix" style={{ height: 20, display: 'block' }} />
      </div>
      <p style={{ fontSize: '0.85rem', maxWidth: 420 }}>{t('footerTagline')}</p>
      <p style={{ fontSize: '0.78rem', marginTop: '2rem', opacity: 0.6 }}>© {new Date().getFullYear()} Chronix. All rights reserved.</p>
    </footer>
  );
}
