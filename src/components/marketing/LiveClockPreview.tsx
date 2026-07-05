import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
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
    <div className="live-clock-preview">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <img src={logo} alt="Chronix" style={{ height: 18 }} />
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Time Clock</span>
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Welcome back</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
        {clockedIn ? 'Clocked in — redirecting to login…' : 'Ready to clock in'}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700 }}>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <button
        type="button"
        className="btn"
        style={{ width: '100%', background: 'var(--success)', color: '#fff', opacity: clockedIn ? 0.8 : 1 }}
        onClick={handleClockIn}
      >
        {clockedIn ? (
          <>
            <Check size={16} /> CLOCKED IN
          </>
        ) : (
          'CLOCK IN'
        )}
      </button>
    </div>
  );
}
