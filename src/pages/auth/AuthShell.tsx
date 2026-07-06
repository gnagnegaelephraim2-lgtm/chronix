import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import logo from '../../assets/chronix_logo.png';
import logoWhite from '../../assets/chronix_logo_white.png';

interface AuthShellProps {
  children: ReactNode;
}

// Shared split-layout shell for Login and Signup. The Banano Mode toggle
// used to be position:absolute over the whole page — on mobile, where the
// right branding panel is hidden, that put it directly on top of the logo
// with no clearance. Putting it in the same flex row as the logo means it
// takes up real layout space instead of floating over whatever's beneath it.
export function AuthShell({ children }: AuthShellProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}>
          <div className="auth-top-row">
            <Link to="/" aria-label="Back to Chronix home">
              <img src={logo} alt="Chronix" style={{ height: 32, display: 'block' }} />
            </Link>
            <button type="button" className="banano-toggle" onClick={toggleTheme}>
              <span>🍌</span>
              {theme === 'banano' ? 'Standard Mode' : 'Banano Mode'}
            </button>
          </div>
          {children}
        </div>
      </div>

      <div className="login-right-panel">
        <div style={{ color: '#fff', textAlign: 'center', maxWidth: 340, position: 'relative', zIndex: 1 }}>
          <img src={logoWhite} alt="Chronix" style={{ height: 36, display: 'block', margin: '0 auto 1.5rem' }} />

          <div className="auth-mockup-card">
            <div className="auth-mockup-row">
              {[
                { label: 'On-time', value: '94%', color: 'var(--success)' },
                { label: 'On shift now', value: '18', color: 'var(--chronix-navy)' },
              ].map((stat) => (
                <div key={stat.label} className="auth-mockup-stat">
                  <div style={{ color: stat.color, fontWeight: 800, fontSize: '1.35rem' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="auth-mockup-list">
              {[
                { name: 'Gaelle Ephraim', action: 'Clocked In', color: 'var(--success)' },
                { name: 'Jean Pierre', action: 'Clocked In', color: 'var(--success)' },
                { name: 'Sarah Latour', action: 'Clocked Out', color: 'var(--danger)' },
              ].map((row) => (
                <div key={row.name} className="auth-mockup-list-row">
                  <span>{row.name}</span>
                  <span style={{ color: row.color, fontWeight: 700 }}>{row.action}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '1rem', lineHeight: 1.6, marginTop: '1.75rem' }}>
            One shared system, two views. Everything your team does on the clock appears instantly on your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
