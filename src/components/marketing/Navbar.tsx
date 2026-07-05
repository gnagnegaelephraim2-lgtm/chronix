import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import logo from '../../assets/chronix_logo.png';

export function Navbar() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <img src={logo} alt="Chronix" style={{ height: 30 }} />
      <div className="navbar-links">
        <a href="#home">{t('navHomeLink')}</a>
        <a href="#industries">Industries</a>
        <a href="#features">{t('navFeatures')}</a>
        <a href="#pricing">{t('navPricing')}</a>
        <a href="#faq">{t('navFaq')}</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
          {t('loginButton')}
        </a>
        <button className="btn btn-primary-amber" onClick={() => navigate('/login')}>
          {t('signUp')}
        </button>
      </div>
    </nav>
  );
}
