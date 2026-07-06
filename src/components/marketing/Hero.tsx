import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Play } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { LiveClockPreview } from './LiveClockPreview';
import { DemoVideoModal } from './DemoVideoModal';

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
    <header className="hero" id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '6.5rem 5% 8.5rem', boxSizing: 'border-box' }}>
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
        {/* Horizontal gradient overlay wash: keeps left side solid wash and right side clear */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, var(--bg-page) 20%, rgba(253, 251, 247, 0.45) 55%, rgba(253, 251, 247, 0.1) 100%)',
            zIndex: 1
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto', alignItems: 'center', zIndex: 2, position: 'relative' }} className="hero-grid">
        <div className="hero-copy" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* Top visual Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(255, 210, 0, 0.12)', 
            border: '1px solid rgba(255, 210, 0, 0.3)', 
            borderRadius: '30px', 
            padding: '0.45rem 1rem', 
            marginBottom: '1.25rem', 
            fontSize: '0.82rem', 
            fontWeight: 700, 
            color: 'var(--chronix-navy)' 
          }}>
            <span style={{ fontSize: '0.9rem' }}>🛡️</span> Smart Attendance. Stronger Business.
          </div>

          <h1 style={{ fontSize: 'clamp(2.1rem, 5.5vw, 3.8rem)', lineHeight: 1.1, marginBottom: '1.25rem', fontWeight: 800, color: 'var(--chronix-navy)', letterSpacing: '-1.5px' }}>
            {t('heroHeadlinePrefix')} <span className="amber-text">{t('heroHeadlineAmber')}</span>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', marginBottom: '2.25rem', maxWidth: '520px', lineHeight: 1.6, fontWeight: 500 }}>
            {t('heroSubtext')}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary-amber btn-lg" onClick={() => navigate('/signup')} style={{ padding: '0.85rem 2rem', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚀</span> {t('getStartedNow')}
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => setShowDemo(true)} style={{ padding: '0.85rem 2rem', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent' }}>
              <Play size={16} fill="currentColor" /> {t('watchDemo')}
            </button>
          </div>

          {/* Feature highlights row */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }} className="hero-features-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--chronix-navy)' }}>
              <span style={{ color: 'var(--chronix-amber)', fontSize: '1rem' }}>🛡️</span> Accurate Attendance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--chronix-navy)' }}>
              <span style={{ color: 'var(--chronix-amber)', fontSize: '1rem' }}>🕒</span> Real-Time Tracking
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--chronix-navy)' }}>
              <span style={{ color: 'var(--chronix-amber)', fontSize: '1rem' }}>📊</span> Payroll-Ready Reports
            </div>
          </div>
        </div>

        <div className="hero-visual" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <LiveClockPreview />
        </div>
      </div>

      {/* SVG Wave curve at the bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 1 }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '70px', transform: 'rotateY(180deg)' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,84.75,25.86,191.86,55.19,250.65,68.66,321.39,56.44Z" fill="var(--bg-page)"></path>
        </svg>
      </div>

      <button type="button" className="hero-scroll-cue" onClick={scrollToNext} aria-label="Scroll to explore Chronix" style={{ zIndex: 2 }}>
        <span>Explore Chronix</span>
        <ChevronDown size={20} className="hero-scroll-cue-icon" />
      </button>
      {showDemo && <DemoVideoModal onClose={() => setShowDemo(false)} />}
    </header>
  );
}
