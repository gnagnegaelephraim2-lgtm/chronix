import type { ReactNode } from 'react';
import { useTheme } from '../../hooks/useTheme';
import logo from '../../assets/chronix_logo.png';

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
            <img src={logo} alt="Chronix" style={{ height: 32 }} />
            <button type="button" className="banano-toggle" onClick={toggleTheme}>
              <span>🍌</span>
              {theme === 'banano' ? 'Standard Mode' : 'Banano Mode'}
            </button>
          </div>
          {children}
        </div>
      </div>

      <div className="login-right-panel">
        <div style={{ color: '#fff', textAlign: 'center', maxWidth: 320 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '0.6rem 1rem', display: 'inline-flex', marginBottom: '1.5rem' }}>
            <img src={logo} alt="Chronix" style={{ height: 32, display: 'block' }} />
          </div>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
            One shared system, two views. Everything your team does on the clock appears instantly on your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
