import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { LiveClockPreview } from './LiveClockPreview';
import { DemoVideoModal } from './DemoVideoModal';
import heroImg from '../../assets/hero.png';

import hospitality1 from '../../assets/industries/hospitality-1.jpg';
import construction1 from '../../assets/industries/construction-1.jpg';
import retail1 from '../../assets/industries/retail-1.jpg';
import manufacturing1 from '../../assets/industries/manufacturing-1.jpg';
import logistics1 from '../../assets/industries/logistics-1.jpg';
import agriculture1 from '../../assets/industries/agriculture-1.jpg';
import healthcare1 from '../../assets/industries/healthcare-1.jpg';
import education1 from '../../assets/industries/education-1.jpg';
import bpo1 from '../../assets/industries/bpo-1.jpg';
import financial1 from '../../assets/industries/financial-1.jpg';
import foodbeverage1 from '../../assets/industries/foodbeverage-1.jpg';
import security1 from '../../assets/industries/security-1.jpg';
import hospitality2 from '../../assets/industries/hospitality-2.jpg';
import construction2 from '../../assets/industries/construction-2.jpg';
import retail2 from '../../assets/industries/retail-2.jpg';
import manufacturing2 from '../../assets/industries/manufacturing-2.jpg';
import logistics2 from '../../assets/industries/logistics-2.jpg';
import healthcare2 from '../../assets/industries/healthcare-2.jpg';

const MARQUEE_ROW_A = [hospitality1, construction1, retail1, manufacturing1, logistics1, agriculture1, healthcare1, education1, bpo1];
const MARQUEE_ROW_B = [financial1, foodbeverage1, security1, hospitality2, construction2, retail2, manufacturing2, logistics2, healthcare2];

export function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <header className="hero" id="home">
      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-row hero-marquee-row--left">
          {[...MARQUEE_ROW_A, ...MARQUEE_ROW_A].map((src, i) => (
            <img src={src} alt="" key={i} loading="lazy" />
          ))}
        </div>
        <div className="hero-marquee-row hero-marquee-row--right">
          {[...MARQUEE_ROW_B, ...MARQUEE_ROW_B].map((src, i) => (
            <img src={src} alt="" key={i} loading="lazy" />
          ))}
        </div>
      </div>
      <div className="hero-copy">
        <h1 style={{ fontSize: '2.4rem', lineHeight: 1.15, marginBottom: '1rem' }}>
          {t('heroHeadlinePrefix')} <span className="amber-text">{t('heroHeadlineAmber')}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.75rem', maxWidth: 520 }}>{t('heroSubtext')}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary-amber" onClick={() => navigate('/login')}>
            {t('getStartedNow')}
          </button>
          <button className="btn btn-primary-navy" onClick={() => setShowDemo(true)}>
            {t('watchDemo')}
          </button>
        </div>
      </div>
      <div className="hero-visual">
        <button
          type="button"
          className="hero-visual-btn"
          onClick={() => setShowDemo(true)}
          aria-label="Watch product demo video"
        >
          <img src={heroImg} alt="" style={{ width: '100%', borderRadius: 16, display: 'block' }} />
          <span className="hero-play-badge">
            <Play size={26} fill="currentColor" />
          </span>
        </button>
        <div style={{ position: 'absolute', bottom: '-1.5rem', right: '1rem' }}>
          <LiveClockPreview />
        </div>
      </div>
      {showDemo && <DemoVideoModal onClose={() => setShowDemo(false)} />}
    </header>
  );
}
