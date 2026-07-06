import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoVideoModal } from './DemoVideoModal';
import { LiveClockPreview } from './LiveClockPreview';

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

export function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const SLIDESHOW_IMAGES = [
    hospitality1,
    construction1,
    retail1,
    manufacturing1,
    logistics1,
    agriculture1,
    healthcare1,
    education1,
    bpo1,
    financial1,
    foodbeverage1,
    security1,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [SLIDESHOW_IMAGES.length]);

  function scrollToNext() {
    document.querySelector('#industries')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <header className="hero" id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Full-screen Cross-fading Slideshow Background */}
      <div className="hero-slideshow" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {SLIDESHOW_IMAGES.map((src, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === bgIndex ? 0.85 : 0,
              transition: 'opacity 1.2s ease-in-out',
            }}
          />
        ))}
        {/* Extremely soft theme wash overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--bg-page)',
            opacity: 0.12,
            zIndex: 1
          }}
        />
      </div>

      <div className="hero-copy" style={{
        textAlign: 'center',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2,
        padding: '3.5rem 3rem',
        maxWidth: '820px',
        background: 'transparent',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        borderRadius: '24px',
      }}>
        <h1 style={{ fontSize: '3.4rem', lineHeight: 1.1, marginBottom: '1.5rem', textAlign: 'center', letterSpacing: '-1.5px', fontWeight: 800, textShadow: '0 2px 20px rgba(255,255,255,0.95), 0 1px 4px rgba(255,255,255,0.95)' }}>
          {t('heroHeadlinePrefix')} <span className="amber-text">{t('heroHeadlineAmber')}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '2.25rem', maxWidth: 620, textAlign: 'center', lineHeight: 1.55, textShadow: '0 2px 16px rgba(255,255,255,0.95), 0 1px 4px rgba(255,255,255,0.95)' }}>{t('heroSubtext')}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary-amber btn-lg" onClick={() => navigate('/signup')} style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem', fontWeight: 600 }}>
            {t('getStartedNow')}
          </button>
          <button className="btn btn-primary-navy btn-lg" onClick={() => setShowDemo(true)} style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem', fontWeight: 600 }}>
            {t('watchDemo')}
          </button>
        </div>
      </div>

      <div className="hero-clock-widget" style={{ position: 'absolute', bottom: '5.5rem', right: '2rem', zIndex: 2 }}>
        <LiveClockPreview />
      </div>

      <button type="button" className="hero-scroll-cue" onClick={scrollToNext} aria-label="Scroll to explore Chronix" style={{ zIndex: 2 }}>
        <span>Explore Chronix</span>
        <ChevronDown size={20} className="hero-scroll-cue-icon" />
      </button>
      {showDemo && <DemoVideoModal onClose={() => setShowDemo(false)} />}
    </header>
  );
}
