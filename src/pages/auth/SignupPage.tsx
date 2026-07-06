// New-account signup — deliberately a richer form than Login (company name
// for Business accounts, phone for everyone) rather than reusing the same
// email+password form for both flows.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import type { SessionView } from '../../types/session';
import type { Employee } from '../../types';
import { AuthShell } from './AuthShell';

export function SignupPage() {
  const { t } = useLanguage();
  const { loginAs } = useSession();
  const { state } = useStore();
  const { addEmployee, updateSettings } = useStoreActions();
  const navigate = useNavigate();

  const [view, setView] = useState<SessionView>('admin');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const existing = state.employees.find((emp) => emp.email.toLowerCase() === trimmedEmail);
    if (existing) {
      setError(t('emailAlreadyRegisteredError'));
      return;
    }

    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(' ') || '—';
    const newEmployeeData: Omit<Employee, 'id'> = {
      firstName: firstName || 'New',
      lastName,
      avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(trimmedEmail || fullName)}`,
      email: trimmedEmail,
      phone: phone.trim(),
      role: view === 'admin' ? 'admin' : 'employee',
      department: '',
      employmentType: 'full_time',
      joinedAt: new Date().toISOString().slice(0, 10),
      workLocationId: state.settings.workLocations[0]?.id ?? '',
      allowedCheckInMethods: ['gps_face'],
      leaveBalance: 14,
    };
    const newId = addEmployee(newEmployeeData);

    if (view === 'admin' && companyName.trim()) {
      updateSettings({ companyName: companyName.trim() });
    }

    // Pass the full object, not just the id — the store update from
    // addEmployee hasn't flowed back into this context yet, so looking the
    // id up in state.employees right now would still see the old (missing) list.
    loginAs(view, { ...newEmployeeData, id: newId });
    navigate(view === 'admin' ? '/admin' : '/employee');
  }

  return (
    <AuthShell>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{t('signupTitle')}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('signupSubtitle')}</p>

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
          <label className="form-label">{t('fullNameLabel')}</label>
          <input className="form-input" type="text" placeholder={t('fullNamePlaceholder')} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>

        {view === 'admin' && (
          <div className="form-field">
            <label className="form-label">{t('companyNameLabel')}</label>
            <input className="form-input" type="text" placeholder={t('companyNamePlaceholder')} value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
        )}

        <div className="form-field">
          <label className="form-label">{t('emailLabel')}</label>
          <input className="form-input" type="email" placeholder={t('emailPlaceholder')} value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} required />
        </div>

        <div className="form-field">
          <label className="form-label">{t('phoneLabel')}</label>
          <input className="form-input" type="tel" placeholder={t('phonePlaceholder')} value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>

        <div className="form-field">
          <label className="form-label">{t('passwordLabel')}</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error} <Link to="/login" style={{ fontWeight: 600 }}>{t('logInLinkText')}</Link>
          </p>
        )}

        <button type="submit" className="btn btn-primary-amber" style={{ width: '100%', marginBottom: '1.25rem' }}>
          {t('createAccountButton')}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        {t('alreadyHaveAccount')} <Link to="/login" style={{ fontWeight: 600, color: 'var(--chronix-navy)' }}>{t('logInLinkText')}</Link>
      </p>
    </AuthShell>
  );
}
