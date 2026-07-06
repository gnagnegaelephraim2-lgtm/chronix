import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, User } from 'lucide-react';
import { useLiveClock } from '../../hooks/useLiveClock';
import logo from '../../assets/chronix_logo.png';

export function LiveClockPreview() {
  const now = useLiveClock(1000);
  const navigate = useNavigate();
  const [clockedIn, setClockedIn] = useState(false);

  function handleClockIn() {
    if (clockedIn) return;
    setClockedIn(true);
    setTimeout(() => navigate('/login'), 700);
  }

  return (
    <div className="live-clock-preview" style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', padding: '1.75rem', width: '330px', boxSizing: 'border-box', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <img src={logo} alt="Chronix" style={{ height: 26, width: 26, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--chronix-navy)', letterSpacing: '0.5px' }}>CHRONIX</span>
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Time Clock</span>
      </div>

      {/* Inner light-green container */}
      <div style={{ background: 'rgba(39, 201, 63, 0.08)', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(39, 201, 63, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', flexShrink: 0 }}>
          <User size={16} />
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--chronix-navy)' }}>Welcome back</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            {clockedIn ? 'Clocked in — redirecting…' : 'Ready to clock in'}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--chronix-navy)', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>
        {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 500 }}>
        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </div>

      <button
        type="button"
        className="btn"
        style={{ width: '100%', background: 'var(--success)', color: '#fff', padding: '0.8rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        onClick={handleClockIn}
      >
        {clockedIn ? (
          <>
            <Check size={16} /> CLOCKED IN
          </>
        ) : (
          <>
            <span style={{ fontSize: '1.1rem' }}>👆</span> CLOCK IN
          </>
        )}
      </button>
    </div>
  );
}
