import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { LiveClockPreview } from './LiveClockPreview';
import heroImg from '../../assets/hero.png';

export function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="hero" id="home">
      <div className="hero-copy">
        <h1 style={{ fontSize: '2.4rem', lineHeight: 1.15, marginBottom: '1rem' }}>
          {t('heroHeadlinePrefix')} <span className="amber-text">{t('heroHeadlineAmber')}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.75rem', maxWidth: 520 }}>{t('heroSubtext')}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary-amber" onClick={() => navigate('/login')}>
            {t('getStartedNow')}
          </button>
          <button className="btn btn-primary-navy">{t('watchDemo')}</button>
        </div>
      </div>
      <div className="hero-visual">
        <img src={heroImg} alt="" style={{ width: '100%', borderRadius: 16, display: 'block' }} />
        <div style={{ position: 'absolute', bottom: '-1.5rem', right: '1rem' }}>
          <LiveClockPreview />
        </div>
      </div>
    </header>
  );
}
