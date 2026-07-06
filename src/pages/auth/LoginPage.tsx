// Screen B — Login (existing accounts only; new accounts go through Signup)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import type { SessionView } from '../../types/session';
import { GoogleLoginModal } from './GoogleLoginModal';
import { AuthShell } from './AuthShell';

export function LoginPage() {
  const { t } = useLanguage();
  const { loginAs } = useSession();
  const { state } = useStore();
  const navigate = useNavigate();
  const [view, setView] = useState<SessionView>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const existing = state.employees.find((emp) => emp.email.toLowerCase() === trimmedEmail);

    if (!existing) {
      setError(t('noAccountFoundError'));
      return;
    }

    if (existing.credential !== password) {
      setError(t('incorrectCredentialsError'));
      return;
    }

    loginAs(view, existing.id);
    if (existing.mustChangePassword) {
      navigate('/employee/change-password');
      return;
    }
    navigate(existing.role === 'employee' ? '/employee' : '/admin');
  }

  return (
    <AuthShell>
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
          <input className="form-input" type="email" placeholder={t('emailPlaceholder')} value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} required />
        </div>
        <div className="form-field">
          <label className="form-label">{t('passwordLabel')}</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error} <Link to="/signup" style={{ fontWeight: 600 }}>{t('signUpLinkText')}</Link>
          </p>
        )}
        <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
          <a href="#" style={{ fontSize: '0.82rem', color: 'var(--chronix-navy)', fontWeight: 600 }}>
            {t('forgotPassword')}
          </a>
        </div>
        <button type="submit" className="btn btn-primary-amber" style={{ width: '100%', marginBottom: '1.25rem' }}>
          {t('loginButton')}
        </button>
      </form>

      {view === 'admin' && (
        <>
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '1rem' }}>{t('orLoginWith')}</div>
          <button type="button" className="btn btn-outline" style={{ width: '100%', marginBottom: '1.5rem' }} onClick={() => setShowGoogleModal(true)}>
            {t('continueWithGoogle')}
          </button>
        </>
      )}

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        {t('dontHaveAccount')} <Link to="/signup" style={{ fontWeight: 600, color: 'var(--chronix-navy)' }}>{t('signUpLinkText')}</Link>
      </p>

      {showGoogleModal && <GoogleLoginModal onClose={() => setShowGoogleModal(false)} />}
    </AuthShell>
  );
}
