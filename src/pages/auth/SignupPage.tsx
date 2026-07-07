// New-account signup — Business only. Employees never self-register; an
// admin creates them (see AddEmployeeModal) and hands them a temp PIN, which
// they use on the shared Login page. Signup deliberately collects more than
// Login needs, so we have some basis for knowing a real business is signing
// up: company name, location, headcount, and a contact number.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import type { Employee } from '../../types';
import { uid } from '../../store/storeReducer';
import { generateKioskPin } from '../../utils/kioskPin';
import { AuthShell } from './AuthShell';

export function SignupPage() {
  const { t } = useLanguage();
  const { loginAs } = useSession();
  const { state } = useStore();
  const { addEmployee, updateSettings } = useStoreActions();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
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

    const newLocation = {
      id: uid('loc'),
      name: `Main Office - ${businessLocation.trim()}`,
      address: businessLocation.trim(),
      lat: -20.2,
      lng: 57.5,
      radiusMeters: 150,
    };

    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(' ') || '—';
    const newEmployeeData: Omit<Employee, 'id'> = {
      firstName: firstName || 'New',
      lastName,
      avatarUrl: '',
      email: trimmedEmail,
      phone: phone.trim(),
      role: 'admin',
      department: '',
      employmentType: 'full_time',
      joinedAt: new Date().toISOString().slice(0, 10),
      workLocationId: newLocation.id,
      shiftId: null,
      allowedCheckInMethods: ['gps_face'],
      leaveBalance: 14,
      hourlyRateMUR: 0,
      credential: password,
      status: 'active',
      terminatedAt: null,
      terminationReason: null,
      kioskPin: generateKioskPin(),
    };
    const newId = addEmployee(newEmployeeData);

    updateSettings({
      companyName: companyName.trim(),
      employeeCount: Math.max(1, Number(employeeCount) || 1),
      workLocations: [newLocation],
      trialStartedAt: new Date().toISOString(),
      trialCancelled: false,
      billingCard: null,
    });

    // Pass the full object, not just the id — the store update from
    // addEmployee hasn't flowed back into this context yet, so looking the
    // id up in state.employees right now would still see the old (missing) list.
    loginAs('admin', { ...newEmployeeData, id: newId });
    navigate('/admin');
  }

  return (
    <AuthShell>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{t('signupTitle')}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('signupSubtitle')}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">{t('fullNameLabel')}</label>
          <input className="form-input" type="text" placeholder={t('fullNamePlaceholder')} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>

        <div className="form-field">
          <label className="form-label">{t('companyNameLabel')}</label>
          <input className="form-input" type="text" placeholder={t('companyNamePlaceholder')} value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        </div>

        <div className="contact-form-row">
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('businessLocationLabel')}</label>
            <input className="form-input" type="text" placeholder={t('businessLocationPlaceholder')} value={businessLocation} onChange={(e) => setBusinessLocation(e.target.value)} required />
          </div>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('employeeCountLabel')}</label>
            <input className="form-input" type="number" min="1" placeholder={t('employeeCountPlaceholder')} value={employeeCount} onChange={(e) => setEmployeeCount(e.target.value)} required />
          </div>
        </div>
        <div style={{ height: '1rem' }} />

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
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
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
