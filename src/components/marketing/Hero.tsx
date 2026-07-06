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
        {/* Soft theme wash overlay — evens out contrast across every photo
            in the rotation without boxing the text behind a visible panel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--bg-page)',
            opacity: 0.32,
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
        padding: 'clamp(1.5rem, 6vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)',
        maxWidth: '820px',
        width: '100%',
        boxSizing: 'border-box',
        background: 'transparent',
        borderRadius: '24px',
      }}>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6.5vw, 3.4rem)', lineHeight: 1.15, marginBottom: '1.25rem', textAlign: 'center', letterSpacing: '-1px', fontWeight: 800, color: '#000' }}>
          {t('heroHeadlinePrefix')} <span className="amber-text">{t('heroHeadlineAmber')}</span>
        </h1>
        <p style={{ color: '#000', fontSize: 'clamp(0.95rem, 2.6vw, 1.15rem)', marginBottom: '1.75rem', maxWidth: 620, textAlign: 'center', lineHeight: 1.55, fontWeight: 500 }}>{t('heroSubtext')}</p>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary-amber btn-lg" onClick={() => navigate('/signup')} style={{ padding: 'clamp(0.7rem, 2vw, 0.85rem) clamp(1.5rem, 5vw, 2.25rem)', fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', fontWeight: 600 }}>
            {t('getStartedNow')}
          </button>
          <button className="btn btn-primary-navy btn-lg" onClick={() => setShowDemo(true)} style={{ padding: 'clamp(0.7rem, 2vw, 0.85rem) clamp(1.5rem, 5vw, 2.25rem)', fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', fontWeight: 600 }}>
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
