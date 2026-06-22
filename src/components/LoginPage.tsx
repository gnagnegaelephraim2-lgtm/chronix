import React, { useState, useEffect } from 'react';
import type { Worker } from '../types';
import type { AuthSession } from '../types/auth';
import { generateInviteCode, validateAndConsumeInviteCode } from '../utils/authUtils';
import {
  Clock, Shield, DollarSign, Globe, Users,
  Eye, EyeOff, LogIn, Check, AlertTriangle,
  Sun, Moon, User, Key, ShieldCheck, Copy, UserPlus
} from 'lucide-react';

interface LoginPageProps {
  workers: Worker[];
  onLogin: (session: AuthSession) => void;
  lang: string;
  onToggleLang: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  companyLogo: string;
  companyName: string;
}

export default function LoginPage({
  workers, onLogin, lang, onToggleLang, theme, onToggleTheme, companyLogo, companyName
}: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'director' | 'supervisor' | 'worker'>('director');
  const [directorMode, setDirectorMode] = useState<'signin' | 'signup'>('signin');
  const [supervisorMode, setSupervisorMode] = useState<'signin' | 'signup'>('signin');
  const [workerMode, setWorkerMode] = useState<'signin' | 'signup'>('signin');

  // Director fields
  const [compName, setCompName] = useState('');
  const [dirCode, setDirCode] = useState('');
  const [dirName, setDirName] = useState('');
  const [showDirCode, setShowDirCode] = useState(false);

  // Supervisor sign-in field
  const [supCode, setSupCode] = useState('');
  const [showSupCode, setShowSupCode] = useState(false);

  // Supervisor self-registration fields
  const [supName, setSupName] = useState('');
  const [supSurname, setSupSurname] = useState('');
  const [supRegCode, setSupRegCode] = useState('');
  const [supNewCode, setSupNewCode] = useState('');
  const [showSupRegCode, setShowSupRegCode] = useState(false);
  const [showSupNewCode, setShowSupNewCode] = useState(false);

  // Worker sign-in field
  const [workerPin, setWorkerPin] = useState('');

  // Worker self-registration fields
  const [empName, setEmpName] = useState('');
  const [empSurname, setEmpSurname] = useState('');
  const [empRegCode, setEmpRegCode] = useState('');
  const [empNewPin, setEmpNewPin] = useState('');

  // Generated invite code shown after signup
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync default/active company name
  useEffect(() => {
    // Only pre-fill company name on the sign-in forms, not on signup
    if (directorMode === 'signin') {
      const savedName = localStorage.getItem('chronix_company_name') || companyName || '';
      setCompName(savedName);
    } else {
      setCompName('');
    }
  }, [directorMode, companyName]);

  const handleTabChange = (tab: 'director' | 'supervisor' | 'worker') => {
    setActiveTab(tab);
    setError('');
    setSuccessMsg('');
    setGeneratedCode('');
    setCodeCopied(false);
    setDirCode('');
    setSupCode('');
    setWorkerPin('');
    setSupRegCode('');
    setSupNewCode('');
    setEmpRegCode('');
    setEmpNewPin('');
  };

  const handleDirectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      if (directorMode === 'signup') {
        // Register Company
        if (!compName.trim()) { setError('Please enter a Company Name.'); setIsLoading(false); return; }
        if (!dirName.trim()) { setError('Please enter your Name.'); setIsLoading(false); return; }
        if (!dirCode.trim()) { setError('Please set a Director Code.'); setIsLoading(false); return; }

        localStorage.setItem('chronix_company_name', compName.trim());
        localStorage.setItem('chronix_director_code', dirCode);
        localStorage.setItem('chronix_director_name', dirName.trim());

        // Auto-generate a supervisor invite code
        const supInvite = generateInviteCode('supervisor', 'auth-admin-default', dirName.trim());
        setGeneratedCode(supInvite.code);

        const session: AuthSession = {
          userId: 'auth-admin-default',
          userName: dirName.trim(),
          userEmail: 'director@company.mu',
          role: 'admin',
          expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
        };
        localStorage.setItem('chronix_auth_session', JSON.stringify(session));
        setSuccessMsg('Company registered! Share your Supervisor Code below, then continue.');
        setIsLoading(false);
      } else {
        // Sign In
        const savedCompanyName = localStorage.getItem('chronix_company_name') || 'Mauritius Sugar Cane Corp';
        const savedDirectorCode = localStorage.getItem('chronix_director_code') || 'admin';
        const savedDirectorName = localStorage.getItem('chronix_director_name') || 'System Director';

        if (compName.trim().toLowerCase() !== savedCompanyName.trim().toLowerCase()) {
          setError('Company Name does not match records.');
          setIsLoading(false);
          return;
        }

        if (dirCode !== savedDirectorCode) {
          setError('Invalid Director Code. Default is "admin".');
          setIsLoading(false);
          return;
        }

        const session: AuthSession = {
          userId: 'auth-admin-default',
          userName: savedDirectorName,
          userEmail: 'director@company.mu',
          role: 'admin',
          expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
        };
        localStorage.setItem('chronix_auth_session', JSON.stringify(session));
        onLogin(session);
      }
    }, 600);
  };

  const handleSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const savedCompanyName = localStorage.getItem('chronix_company_name') || 'Mauritius Sugar Cane Corp';
      if (compName.trim().toLowerCase() !== savedCompanyName.trim().toLowerCase()) {
        setError('Company Name does not match records.');
        setIsLoading(false);
        return;
      }

      // Search supervisor by code in workers list
      const supervisor = workers.find(w => w.isSupervisor && w.supervisorCode === supCode && w.status === 'active');
      if (!supervisor) {
        setError('Invalid Supervisor Code or account is inactive.');
        setIsLoading(false);
        return;
      }

      const session: AuthSession = {
        userId: 'auth-' + supervisor.id,
        userName: `${supervisor.name} ${supervisor.surname}`,
        userEmail: supervisor.email || 'supervisor@company.mu',
        role: 'supervisor',
        workerId: supervisor.id,
        expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
      };
      localStorage.setItem('chronix_auth_session', JSON.stringify(session));
      onLogin(session);
    }, 600);
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const employee = workers.find(w => w.pin === workerPin && w.status === 'active');
      if (!employee) {
        setError('Invalid Employee Code (PIN) or worker is inactive.');
        setIsLoading(false);
        return;
      }

      const session: AuthSession = {
        userId: 'auth-' + employee.id,
        userName: `${employee.name} ${employee.surname}`,
        userEmail: employee.email || 'employee@company.mu',
        role: 'worker',
        workerId: employee.id,
        expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
      };
      localStorage.setItem('chronix_auth_session', JSON.stringify(session));
      onLogin(session);
    }, 600);
  };

  // ── Supervisor self-registration ─────────────────────────────────────────
  const handleSupervisorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setIsLoading(true);
    setTimeout(() => {
      if (!supName.trim() || !supSurname.trim()) { setError('Please enter your full name.'); setIsLoading(false); return; }
      if (!supRegCode.trim()) { setError('Please enter your Supervisor Registration Code.'); setIsLoading(false); return; }
      if (!supNewCode.trim()) { setError('Please create your Supervisor Access Code.'); setIsLoading(false); return; }
      const fullName = `${supName.trim()} ${supSurname.trim()}`;
      const codeResult = validateAndConsumeInviteCode(supRegCode.trim().toUpperCase(), 'supervisor', fullName);
      if (!codeResult.valid) { setError(codeResult.error || 'Invalid code.'); setIsLoading(false); return; }
      const existingWorkers: Worker[] = JSON.parse(localStorage.getItem('chronix_workers') || '[]');
      if (existingWorkers.find(w => w.isSupervisor && w.supervisorCode === supNewCode.trim())) {
        setError('That Supervisor Code is already taken. Choose another.'); setIsLoading(false); return;
      }
      const newWorker: Worker = {
        id: 'worker-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        name: supName.trim(), surname: supSurname.trim(),
        email: '', phone: '', hourlySalary: 0, passportOrNcid: '',
        department: 'Management', pin: '', password: '', status: 'active',
        isSupervisor: true, supervisorCode: supNewCode.trim(),
        avatar: undefined,
        permitDetails: { workPermitExpiry: '', entryPermitDetails: '', studentPermitDetails: '', contractorAssignment: '', permittedWorkCategories: '' }
      };
      localStorage.setItem('chronix_workers', JSON.stringify([...existingWorkers, newWorker]));
      // Generate a worker invite code for this supervisor
      const workerInvite = generateInviteCode('worker', newWorker.id, fullName);
      const session: AuthSession = {
        userId: 'auth-' + newWorker.id, userName: fullName,
        userEmail: '', role: 'supervisor', workerId: newWorker.id,
        expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
      };
      localStorage.setItem('chronix_auth_session', JSON.stringify(session));
      setGeneratedCode(workerInvite.code);
      setSuccessMsg('Account created! Share your Worker Code below, then continue.');
      setIsLoading(false);
    }, 600);
  };

  // ── Worker self-registration ──────────────────────────────────────────────
  const handleWorkerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setIsLoading(true);
    setTimeout(() => {
      if (!empName.trim() || !empSurname.trim()) { setError('Please enter your full name.'); setIsLoading(false); return; }
      if (!empRegCode.trim()) { setError('Please enter your Worker Registration Code.'); setIsLoading(false); return; }
      if (!empNewPin || empNewPin.length < 4) { setError('Please set a PIN of at least 4 digits.'); setIsLoading(false); return; }
      const fullName = `${empName.trim()} ${empSurname.trim()}`;
      const codeResult = validateAndConsumeInviteCode(empRegCode.trim().toUpperCase(), 'worker', fullName);
      if (!codeResult.valid) { setError(codeResult.error || 'Invalid code.'); setIsLoading(false); return; }
      const existingWorkers: Worker[] = JSON.parse(localStorage.getItem('chronix_workers') || '[]');
      if (existingWorkers.find(w => w.pin === empNewPin && w.status === 'active')) {
        setError('That PIN is already in use. Please choose a different PIN.'); setIsLoading(false); return;
      }
      const newWorker: Worker = {
        id: 'worker-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        name: empName.trim(), surname: empSurname.trim(),
        email: '', phone: '', hourlySalary: 0, passportOrNcid: '',
        department: 'General', pin: empNewPin, password: '', status: 'active',
        isSupervisor: false, avatar: undefined,
        permitDetails: { workPermitExpiry: '', entryPermitDetails: '', studentPermitDetails: '', contractorAssignment: '', permittedWorkCategories: '' }
      };
      localStorage.setItem('chronix_workers', JSON.stringify([...existingWorkers, newWorker]));
      const session: AuthSession = {
        userId: 'auth-' + newWorker.id, userName: fullName,
        userEmail: '', role: 'worker', workerId: newWorker.id,
        expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
      };
      localStorage.setItem('chronix_auth_session', JSON.stringify(session));
      setSuccessMsg('Account created! Redirecting to your portal…');
      setIsLoading(false);
      setTimeout(() => window.location.reload(), 1500);
    }, 600);
  };

  // PIN pad helpers
  const handlePinPress = (num: string) => {
    if (workerPin.length < 6) {
      setWorkerPin(prev => prev + num);
    }
  };

  const handlePinBackspace = () => {
    setWorkerPin(prev => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    setWorkerPin('');
  };

  const features = [
    { icon: <Shield size={16} />, text: 'Director: Configure settings and appoint supervisors' },
    { icon: <Users size={16} />, text: 'Supervisor: Oversee crew shifts and issue worker PINs' },
    { icon: <Clock size={16} />, text: 'Employee: Clock in instantly using personal secure PIN' },
    { icon: <DollarSign size={16} />, text: 'Bilingual Mauritian worker attendance & payroll system' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '0.7rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.4rem',
    letterSpacing: '0.3px',
  };

  return (
    <div className="login-container">
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '-250px', left: '-250px', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Top-right controls */}
      <div style={{ position: 'absolute', top: '1rem', right: '1.25rem', display: 'flex', gap: '0.5rem', zIndex: 20 }}>
        <button onClick={onToggleLang} className="btn btn-outline" style={{ padding: '0.35rem 0.7rem', fontSize: '0.72rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Globe size={13} /> {lang === 'en' ? 'FR' : 'EN'}
        </button>
        <button onClick={onToggleTheme} className="btn btn-outline" style={{ padding: '0.35rem 0.7rem', borderRadius: '8px' }}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      {/* ── LEFT PANEL: Brand ── */}
      <div className="login-left-panel">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--accent-primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <img src={companyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '1.5px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CHRONIX
            </h1>
            <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Workforce System
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.6rem' }}>
          Bilingual Secure<br />
          <span style={{ color: 'var(--accent-primary)' }}>Code-Based</span> Authentication
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '2.25rem' }}>
          Welcome to the Chronix access portal. Standard email logins have been deprecated. Log in using your assigned authorization and PIN codes.
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.5rem' }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                {f.icon}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL: Form ── */}
      <div className="login-right-panel">
        <div style={{ width: '100%', maxWidth: '440px', padding: '1rem 0' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', padding: '4px', marginBottom: '1.75rem', border: '1px solid var(--border-color)', gap: '4px' }}>
            <button
              onClick={() => handleTabChange('director')}
              style={{
                flex: 1,
                padding: '0.65rem 0.25rem',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                background: activeTab === 'director' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'director' ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              <Shield size={14} />
              Director
            </button>
            <button
              onClick={() => handleTabChange('supervisor')}
              style={{
                flex: 1,
                padding: '0.65rem 0.25rem',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                background: activeTab === 'supervisor' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'supervisor' ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              <Users size={14} />
              Supervisor
            </button>
            <button
              onClick={() => handleTabChange('worker')}
              style={{
                flex: 1,
                padding: '0.65rem 0.25rem',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                background: activeTab === 'worker' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'worker' ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              <User size={14} />
              Employee
            </button>
          </div>

          {/* Banners */}
          {successMsg && (
            <div className="badge badge-success" style={{ width: '100%', padding: '0.7rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', borderRadius: '10px', boxSizing: 'border-box' }}>
              <Check size={15} /> {successMsg}
            </div>
          )}
          {error && (
            <div className="badge badge-danger" style={{ width: '100%', padding: '0.7rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', borderRadius: '10px', boxSizing: 'border-box' }}>
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          {/* ─── Generated invite code panel ─── */}
          {generatedCode && (
            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '14px', padding: '1.2rem 1.25rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-secondary)', letterSpacing: '0.5px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                {activeTab === 'director' ? 'Supervisor Registration Code' : 'Worker Registration Code'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <code style={{ flex: 1, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.2rem', color: 'var(--text-primary)', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                  {generatedCode}
                </code>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText(generatedCode); setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000); }}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', color: codeCopied ? 'var(--accent-secondary)' : 'var(--text-muted)', borderColor: codeCopied ? 'var(--accent-secondary)' : undefined }}
                >
                  {codeCopied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                Share this code with your {activeTab === 'director' ? 'supervisors' : 'employees'} so they can register. Valid for 7 days. Generate more in your portal.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', height: '42px', fontSize: '0.9rem', borderRadius: '10px' }}
                onClick={() => window.location.reload()}
              >
                <ShieldCheck size={16} /> Continue to {activeTab === 'director' ? 'Admin' : 'Supervisor'} Portal
              </button>
            </div>
          )}

          {/* ─── DIRECTOR PORTAL ─── */}
          {activeTab === 'director' && (
            <form onSubmit={handleDirectorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '2px', border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'flex-start', marginBottom: '0.2rem' }}>
                <button
                  type="button"
                  onClick={() => { setDirectorMode('signin'); setError(''); }}
                  style={{
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: directorMode === 'signin' ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: directorMode === 'signin' ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setDirectorMode('signup'); setError(''); }}
                  style={{
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: directorMode === 'signup' ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: directorMode === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}
                >
                  Register Company
                </button>
              </div>

              <div>
                <label style={labelStyle}>Company Name</label>
                <input
                  type="text"
                  value={compName}
                  onChange={e => setCompName(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Mauritius Sugar Cane Corp"
                  required
                />
              </div>

              {directorMode === 'signup' && localStorage.getItem('chronix_director_code') && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span>A company account already exists on this device. Registering again will overwrite it. <button type="button" onClick={() => { setDirectorMode('signin'); setError(''); }} style={{ background: 'none', border: 'none', color: '#fbbf24', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Sign in instead</button></span>
                </div>
              )}

              {directorMode === 'signup' && (
                <div>
                  <label style={labelStyle}>Director Name</label>
                  <input
                    type="text"
                    value={dirName}
                    onChange={e => setDirName(e.target.value)}
                    style={inputStyle}
                    placeholder="Enter full name"
                    required
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>{directorMode === 'signup' ? 'Create Director Access Code' : 'Director Access Code'}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showDirCode ? 'text' : 'password'}
                    value={dirCode}
                    onChange={e => setDirCode(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '2.8rem' }}
                    placeholder="Enter Code (Default: admin)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowDirCode(!showDirCode)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}
                  >
                    {showDirCode ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isLoading}
                style={{ height: '48px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isLoading
                  ? <><span className="auth-spinner" /> Verifying...</>
                  : <><ShieldCheck size={18} /> {directorMode === 'signup' ? 'Register & Access System' : 'Access Director Dashboard'}</>}
              </button>
            </form>
          )}

          {/* ─── SUPERVISOR PORTAL ─── */}
          {activeTab === 'supervisor' && !generatedCode && (
            <>
              {/* Sign in / Register toggle */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '2px', border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'flex-start', marginBottom: '1.1rem', gap: '2px' }}>
                <button type="button" onClick={() => { setSupervisorMode('signin'); setError(''); }}
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: supervisorMode === 'signin' ? 'rgba(255,255,255,0.08)' : 'transparent', color: supervisorMode === 'signin' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  Sign In
                </button>
                <button type="button" onClick={() => { setSupervisorMode('signup'); setError(''); }}
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: supervisorMode === 'signup' ? 'rgba(255,255,255,0.08)' : 'transparent', color: supervisorMode === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  Register
                </button>
              </div>

              {supervisorMode === 'signin' ? (
                <form onSubmit={handleSupervisorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={labelStyle}>Company Name</label>
                    <input type="text" value={compName} onChange={e => setCompName(e.target.value)} style={inputStyle} placeholder="e.g. Mauritius Sugar Cane Corp" required />
                  </div>
                  <div>
                    <label style={labelStyle}>Supervisor Access Code</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showSupCode ? 'text' : 'password'} value={supCode} onChange={e => setSupCode(e.target.value)} style={{ ...inputStyle, paddingRight: '2.8rem' }} placeholder="Enter Supervisor Code" required />
                      <button type="button" onClick={() => setShowSupCode(!showSupCode)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                        {showSupCode ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Code set during your registration.</p>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ height: '48px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {isLoading ? <><span className="auth-spinner" /> Authenticating...</> : <><LogIn size={18} /> Sign In as Supervisor</>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSupervisorRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>First Name</label>
                      <input type="text" value={supName} onChange={e => setSupName(e.target.value)} style={inputStyle} placeholder="First name" required />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input type="text" value={supSurname} onChange={e => setSupSurname(e.target.value)} style={inputStyle} placeholder="Last name" required />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Supervisor Registration Code</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showSupRegCode ? 'text' : 'password'} value={supRegCode} onChange={e => setSupRegCode(e.target.value.toUpperCase())} style={{ ...inputStyle, paddingRight: '2.8rem', letterSpacing: '0.1rem', fontFamily: 'monospace' }} placeholder="XXXX-XXXX (from Director)" required />
                      <button type="button" onClick={() => setShowSupRegCode(!showSupRegCode)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                        {showSupRegCode ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>One-time code provided by your Company Director.</p>
                  </div>
                  <div>
                    <label style={labelStyle}>Create Your Supervisor Access Code</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showSupNewCode ? 'text' : 'password'} value={supNewCode} onChange={e => setSupNewCode(e.target.value)} style={{ ...inputStyle, paddingRight: '2.8rem' }} placeholder="Choose a memorable code" required />
                      <button type="button" onClick={() => setShowSupNewCode(!showSupNewCode)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                        {showSupNewCode ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>This becomes your permanent login code. Keep it secure.</p>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ height: '48px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {isLoading ? <><span className="auth-spinner" /> Creating Account...</> : <><UserPlus size={18} /> Register as Supervisor</>}
                  </button>
                </form>
              )}
            </>
          )}

          {/* ─── WORKER PORTAL ─── */}
          {activeTab === 'worker' && !generatedCode && (
            <>
              {/* Sign in / Register toggle */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '2px', border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'flex-start', marginBottom: '1.1rem', gap: '2px' }}>
                <button type="button" onClick={() => { setWorkerMode('signin'); setError(''); }}
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: workerMode === 'signin' ? 'rgba(255,255,255,0.08)' : 'transparent', color: workerMode === 'signin' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  Sign In
                </button>
                <button type="button" onClick={() => { setWorkerMode('signup'); setError(''); setWorkerPin(''); }}
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: workerMode === 'signup' ? 'rgba(255,255,255,0.08)' : 'transparent', color: workerMode === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  Register
                </button>
              </div>

              {workerMode === 'signin' ? (
                <form onSubmit={handleWorkerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Employee PIN</label>
                    <input type="password" pattern="[0-9]*" inputMode="numeric" value={workerPin}
                      onChange={e => setWorkerPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      style={{ ...inputStyle, letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.25rem' }}
                      placeholder="••••" required maxLength={6} />
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem', textAlign: 'center' }}>
                      Enter your 4-to-6 digit PIN set during registration.
                    </p>
                  </div>
                  {/* PIN Pad */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', margin: '0.25rem 0', background: 'rgba(0,0,0,0.15)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    {['1','2','3','4','5','6','7','8','9'].map(num => (
                      <button key={num} type="button" onClick={() => handlePinPress(num)}
                        style={{ height: '45px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                        onMouseDown={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                        onMouseUp={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>{num}</button>
                    ))}
                    <button type="button" onClick={handlePinClear} style={{ height: '45px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'var(--accent-danger)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Clear</button>
                    <button type="button" onClick={() => handlePinPress('0')} style={{ height: '45px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>0</button>
                    <button type="button" onClick={handlePinBackspace} style={{ height: '45px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>⌫</button>
                  </div>
                  <button type="submit" className="btn btn-secondary" disabled={isLoading} style={{ height: '48px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {isLoading ? <><span className="auth-spinner" /> Signing In...</> : <><Key size={18} /> Access Employee Portal</>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleWorkerRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>First Name</label>
                      <input type="text" value={empName} onChange={e => setEmpName(e.target.value)} style={inputStyle} placeholder="First name" required />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input type="text" value={empSurname} onChange={e => setEmpSurname(e.target.value)} style={inputStyle} placeholder="Last name" required />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Worker Registration Code</label>
                    <input type="text" value={empRegCode} onChange={e => setEmpRegCode(e.target.value.toUpperCase())} style={{ ...inputStyle, letterSpacing: '0.1rem', fontFamily: 'monospace' }} placeholder="XXXX-XXXX (from Supervisor)" required />
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>One-time code provided by your Supervisor.</p>
                  </div>
                  <div>
                    <label style={labelStyle}>Create Your PIN (4–6 digits)</label>
                    <input type="password" pattern="[0-9]*" inputMode="numeric" value={empNewPin}
                      onChange={e => setEmpNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      style={{ ...inputStyle, letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.25rem' }}
                      placeholder="••••" required maxLength={6} />
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem', textAlign: 'center' }}>This PIN is your permanent login code.</p>
                  </div>
                  <button type="submit" className="btn btn-secondary" disabled={isLoading} style={{ height: '48px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {isLoading ? <><span className="auth-spinner" /> Creating Account...</> : <><UserPlus size={18} /> Register as Employee</>}
                  </button>
                </form>
              )}
            </>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
            {compName} · Powered by Chronix Pro · © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
