// Screen B — Login (existing accounts only; new accounts go through Signup)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import type { SessionView } from '../../types/session';
import type { Employee } from '../../types';
import { uid } from '../../store/storeReducer';
import { generateKioskPin } from '../../utils/kioskPin';
import { GoogleLoginModal } from './GoogleLoginModal';
import { AuthShell } from './AuthShell';

export function LoginPage() {
  const { t } = useLanguage();
  const { loginAs } = useSession();
  const { state } = useStore();
  const { addEmployee, updateSettings } = useStoreActions();
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
    let existing = state.employees.find((emp) => emp.email.toLowerCase() === trimmedEmail);

    if (!existing) {
      // Auto-register this user as an Admin (or Employee) for a new business
      const newLocation = {
        id: uid('loc'),
        name: 'Main Office - Beau Plan, Pamplemousses',
        address: 'Beau Plan, Pamplemousses',
        lat: -20.09,
        lng: 57.56,
        radiusMeters: 150,
      };

      const emailPrefix = trimmedEmail.split('@')[0];
      const firstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

      const newEmployeeData: Omit<Employee, 'id'> = {
        firstName,
        lastName: view === 'admin' ? 'Admin' : 'Employee',
        avatarUrl: '',
        email: trimmedEmail,
        phone: '+230 5123 4567',
        role: view === 'admin' ? 'admin' : 'employee',
        department: 'Operations',
        employmentType: 'full_time',
        joinedAt: new Date().toISOString().slice(0, 10),
        workLocationId: newLocation.id,
        shiftId: null,
        allowedCheckInMethods: ['gps_face', 'kiosk', 'qr'],
        leaveBalance: 14,
        hourlyRateMUR: 300,
        credential: password,
        status: 'active',
        terminatedAt: null,
        terminationReason: null,
        kioskPin: generateKioskPin(),
      };

      const newId = addEmployee(newEmployeeData);

      updateSettings({
        companyName: `${firstName}'s Company`,
        employeeCount: 5,
        workLocations: [newLocation],
        trialStartedAt: new Date().toISOString(),
        trialCancelled: false,
        billingCard: { brand: 'Visa', last4: '4242', expiry: '12/30' },
      });

      existing = {
        id: newId,
        ...newEmployeeData,
      };
    } else {
      // If employee exists, check credentials
      if (existing.credential !== password) {
        setError(t('incorrectCredentialsError'));
        return;
      }

      if (existing.status === 'terminated') {
        setError(t('accountDeactivatedError'));
        return;
      }
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
