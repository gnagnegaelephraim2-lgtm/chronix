import { useRef, useState } from 'react';
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
  const tiltRef = useRef<HTMLDivElement>(null);

  function handleTiltMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--tilt-x', `${(-y * 10).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty('--tilt-scale', '1.02');
  }

  function handleTiltLeave() {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
    el.style.setProperty('--tilt-scale', '1');
  }

  function scrollToNext() {
    document.querySelector('#industries')?.scrollIntoView({ behavior: 'smooth' });
  }

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
          <button className="btn btn-primary-amber" onClick={() => navigate('/signup')}>
            {t('getStartedNow')}
          </button>
          <button className="btn btn-primary-navy" onClick={() => setShowDemo(true)}>
            {t('watchDemo')}
          </button>
        </div>
      </div>
      <div className="hero-visual">
        <div
          ref={tiltRef}
          className="hero-visual-btn hero-visual-dashboard"
          onClick={() => setShowDemo(true)}
          onMouseMove={handleTiltMove}
          onMouseLeave={handleTiltLeave}
          aria-label="Watch product demo video"
          style={{
            width: '100%',
            aspectRatio: '1.5',
            background: 'linear-gradient(135deg, rgba(92, 64, 8, 0.08) 0%, rgba(255, 210, 0, 0.04) 100%)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(92, 64, 8, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.25rem',
            boxSizing: 'border-box',
            transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale(var(--tilt-scale, 1))',
            transition: 'transform 0.1s ease-out, border-color 0.25s, box-shadow 0.25s',
          }}
        >
          {/* Dashboard Frame Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.6rem', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ marginLeft: '8px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Chronix Cloud Terminal</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ background: 'var(--border)', width: '32px', height: '6px', borderRadius: '3px' }} />
              <span style={{ background: 'var(--border)', width: '48px', height: '6px', borderRadius: '3px' }} />
            </div>
          </div>

          {/* Real-time Activity Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1, overflow: 'hidden' }}>
            <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '0.8rem', color: 'var(--chronix-navy)', fontWeight: 700 }}>
              Live Attendance Stream
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { name: 'Gaelle Ephraim', sector: 'Hospitality 🏨', action: 'Clocked In', loc: 'Le Suffren Hotel, Port Louis', time: 'Just now', initial: 'GE', color: 'var(--info)' },
                { name: 'Jean Pierre', sector: 'Construction 🏗️', action: 'Clocked In', loc: 'Beau Plan, Pamplemousses', time: '2 mins ago', initial: 'JP', color: 'var(--chronix-amber)' },
                { name: 'Sarah Latour', sector: 'Retail 🛍️', action: 'Clocked Out', loc: 'Bagatelle Mall, Moka', time: '5 mins ago', initial: 'SL', color: 'var(--danger)' },
                { name: 'Anil Ramgoolam', sector: 'Manufacturing 🏭', action: 'Clocked In', loc: 'Plaine Lauzun Freezone', time: '12 mins ago', initial: 'AR', color: 'var(--success)' }
              ].map((log, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                    animation: `fadeInUp 0.4s ease-out ${index * 0.12}s both`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: log.color,
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {log.initial}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.name}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.sector} &bull; {log.loc}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                    <span style={{ 
                      fontSize: '0.62rem', 
                      fontWeight: 700, 
                      padding: '1px 6px', 
                      borderRadius: '8px',
                      background: log.action === 'Clocked In' ? 'var(--success-bg)' : 'var(--danger-bg)',
                      color: log.action === 'Clocked In' ? 'var(--success)' : 'var(--danger)',
                      display: 'inline-block',
                      marginBottom: '1px'
                    }}>
                      {log.action}
                    </span>
                    <div style={{ fontSize: '0.58rem', color: 'var(--text-secondary)' }}>{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Central Play Badge Overlay */}
          <div 
            className="dashboard-play-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
            }}
          >
            <span 
              className="play-btn-circle"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--chronix-navy)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(92, 64, 8, 0.25)',
              }}
            >
              <Play size={20} fill="currentColor" style={{ marginLeft: '3px' }} />
            </span>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '-1.5rem', right: '1rem', zIndex: 2 }}>
          <LiveClockPreview />
        </div>
      </div>
      <button type="button" className="hero-scroll-cue" onClick={scrollToNext} aria-label="Scroll to explore Chronix">
        <span>Explore Chronix</span>
        <ChevronDown size={20} className="hero-scroll-cue-icon" />
      </button>
      {showDemo && <DemoVideoModal onClose={() => setShowDemo(false)} />}
    </header>
  );
}
