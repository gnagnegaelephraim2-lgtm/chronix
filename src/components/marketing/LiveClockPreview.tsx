import { useLiveClock } from '../../hooks/useLiveClock';
import logo from '../../assets/chronix_logo.png';

export function LiveClockPreview() {
  const now = useLiveClock(1000);

  return (
    <div className="live-clock-preview">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <img src={logo} alt="Chronix" style={{ height: 18 }} />
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Time Clock</span>
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hello, John</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>ID: EMP-1042</div>
      <div style={{ fontSize: '2rem', fontWeight: 700 }}>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <button className="btn" style={{ width: '100%', background: 'var(--success)', color: '#fff' }} disabled>
        CLOCK IN
      </button>
    </div>
  );
}
