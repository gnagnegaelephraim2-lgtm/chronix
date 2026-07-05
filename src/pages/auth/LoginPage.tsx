// Screen B — Login (shared)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { useLanguage } from '../../hooks/useLanguage';
import type { SessionView } from '../../types/session';
import logo from '../../assets/chronix_logo.png';

export function LoginPage() {
  const { t } = useLanguage();
  const { loginAs } = useSession();
  const navigate = useNavigate();
  const [view, setView] = useState<SessionView>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    loginAs(view);
    navigate(view === 'admin' ? '/admin' : '/employee');
  }

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}>
          <img src={logo} alt="Chronix" style={{ height: 32, marginBottom: '2rem' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{t('loginTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('loginSubtitle')}</p>

          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--button-radius)', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setView('admin')}
              className="btn"
              style={{
                flex: 1,
                borderRadius: 0,
                background: view === 'admin' ? 'var(--chronix-amber)' : 'transparent',
                color: view === 'admin' ? 'var(--chronix-navy)' : 'var(--text-primary)',
              }}
            >
              {t('loginBusinessTab')}
            </button>
            <button
              type="button"
              onClick={() => setView('employee')}
              className="btn"
              style={{
                flex: 1,
                borderRadius: 0,
                background: view === 'employee' ? 'var(--chronix-amber)' : 'transparent',
                color: view === 'employee' ? 'var(--chronix-navy)' : 'var(--text-primary)',
              }}
            >
              {t('loginEmployeeTab')}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label">{t('emailLabel')}</label>
              <input className="form-input" type="email" placeholder={t('emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-field">
              <label className="form-label">{t('passwordLabel')}</label>
              <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
              <a href="#" style={{ fontSize: '0.82rem', color: 'var(--chronix-navy)', fontWeight: 600 }}>
                {t('forgotPassword')}
              </a>
            </div>
            <button type="submit" className="btn btn-primary-amber" style={{ width: '100%', marginBottom: '1.25rem' }}>
              {t('loginButton')}
            </button>
          </form>

          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '1rem' }}>{t('orLoginWith')}</div>
          <button className="btn btn-outline" style={{ width: '100%' }}>
            {t('continueWithGoogle')}
          </button>
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
