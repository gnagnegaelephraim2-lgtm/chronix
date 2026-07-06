import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import logo from '../../assets/chronix_logo.png';
import { ArrowLeft, Clock, Users } from 'lucide-react';

import logistics1 from '../../assets/industries/logistics-1.jpg';

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <Link 
              to="/" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--text-secondary)', 
                textDecoration: 'none', 
                fontSize: '0.88rem', 
                fontWeight: 600, 
                transition: 'color 0.2s' 
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--chronix-navy)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <ArrowLeft size={16} /> Back to website
            </Link>
          </div>
          <div className="auth-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <Link to="/" aria-label="Back to Chronix home">
              <img src={logo} alt="Chronix" style={{ height: 110, width: 110, objectFit: 'contain', margin: '-39px 0', display: 'block' }} />
            </Link>
            <button type="button" className="banano-toggle" onClick={toggleTheme} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)' }}>
              <span>🍌</span>
              {theme === 'banano' ? 'Standard Mode' : 'Banano Mode'}
            </button>
          </div>
          {children}
        </div>
      </div>

      <div className="login-right-panel" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Full-bleed crisp background image */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${logistics1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
        {/* Light gradient overlay to preserve readability without blocking image details */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 100%)',
            zIndex: 1
          }}
        />

        {/* Mockups Container */}
        <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          
          {/* Top Left Wall-Mounted Biometric Clock-in Terminal */}
          <div style={{ position: 'absolute', top: '7%', left: '8%', display: 'flex', gap: '1rem', alignItems: 'flex-start' }} className="terminal-mock-container">
            {/* Terminal Quote Box */}
            <div style={{ background: '#fff', padding: '0.85rem 1.15rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '160px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.35 }}>Time to make every minute count.</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <img src={logo} alt="Chronix" style={{ height: 13, width: 13, objectFit: 'contain' }} />
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--chronix-navy)', letterSpacing: '0.3px' }}>CHRONIX</span>
              </div>
            </div>

            {/* Hardware clock device mockup */}
            <div style={{ background: '#1e242d', border: '3px solid #374151', borderRadius: '10px', width: '70px', height: '90px', padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 15px 30px rgba(0,0,0,0.22)', boxSizing: 'border-box' }}>
              {/* Device Screen */}
              <div style={{ background: '#0d1117', borderRadius: '4px', height: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#10b981', fontFamily: 'monospace', fontWeight: 700, padding: '2px 0' }}>
                <div>08:00 AM</div>
                <div style={{ fontSize: '0.35rem', color: '#6b7280' }}>WELCOME</div>
              </div>
              {/* Camera Lens */}
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4b5563', alignSelf: 'center', margin: '2px 0' }} />
              {/* Biometric Fingerprint Sensor Mock */}
              <div style={{ alignSelf: 'center', width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '0.72rem', cursor: 'default' }}>
                ☝️
              </div>
            </div>
          </div>

          {/* Center-Right Mock Dashboard Card */}
          <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: '18px', border: '1px solid var(--border)', boxShadow: '0 20px 45px rgba(0,0,0,0.08)', padding: '1.5rem', width: '360px', boxSizing: 'border-box' }} className="auth-mock-dashboard-card">
            
            {/* Stats row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                  <Clock size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--chronix-navy)', lineHeight: 1.1 }}>94%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>On-time</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(30, 48, 68, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--chronix-navy)' }}>
                  <Users size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--chronix-navy)', lineHeight: 1.1 }}>18</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>On shift now</div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', margin: '0.75rem 0' }} />

            {/* List header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--chronix-navy)' }}>Employee status</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)', cursor: 'pointer' }}>View all &gt;</span>
            </div>

            {/* Employee lists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { name: 'Gaelle Ephraim', action: 'Clocked In', time: '8:02 AM', color: 'var(--success)', initials: 'GE' },
                { name: 'Jean Pierre', action: 'Clocked In', time: '8:00 AM', color: 'var(--success)', initials: 'JP' },
                { name: 'Sarah Latour', action: 'Clocked Out', time: '5:17 PM', color: 'var(--danger)', initials: 'SL' },
              ].map((row) => (
                <div key={row.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--chronix-navy)', border: '1px solid var(--border)' }}>
                      {row.initials}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--chronix-navy)' }}>{row.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: row.color, fontWeight: 700, fontSize: '0.72rem' }}>{row.action}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{row.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Horizontal Features Pill Bar */}
          <div style={{ 
            position: 'absolute', 
            bottom: '7%', 
            left: '8%', 
            right: '8%', 
            background: 'rgba(255, 255, 255, 0.92)', 
            backdropFilter: 'blur(12px)', 
            WebkitBackdropFilter: 'blur(12px)', 
            border: '1px solid rgba(255, 255, 255, 0.55)', 
            borderRadius: '30px', 
            padding: '0.65rem 1.25rem', 
            display: 'flex', 
            gap: '1.25rem', 
            justifyContent: 'space-around', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)' 
          }} className="auth-features-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 750, color: 'var(--chronix-navy)' }}>
              <span>📅</span> Track attendance in real time
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 750, color: 'var(--chronix-navy)' }}>
              <span>👥</span> Manage shifts effortlessly
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 750, color: 'var(--chronix-navy)' }}>
              <span>📈</span> Insights that help your team thrive
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
