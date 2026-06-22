import React, { useState } from 'react';
import type { Worker } from '../types';
import type { AuthSession } from '../types/auth';
import { loginUser, registerUser } from '../utils/authUtils';
import {
  Clock, Shield, DollarSign, Globe, Users,
  Eye, EyeOff, UserPlus, LogIn, Check, AlertTriangle,
  Sun, Moon, ChevronRight
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

function getPasswordStrength(pwd: string) {
  if (!pwd) return null;
  const hasMin = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSpecial = /[!@#$%^&*()_+\-=]/.test(pwd);
  const score = [hasMin, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (!hasMin) return { label: 'Too short', color: '#ef4444', width: '15%' };
  if (score <= 2) return { label: 'Weak', color: '#f59e0b', width: '35%' };
  if (score === 3) return { label: 'Good', color: '#3b82f6', width: '65%' };
  return { label: 'Strong', color: '#10b981', width: '100%' };
}

export default function LoginPage({
  workers, onLogin, lang, onToggleLang, theme, onToggleTheme, companyLogo, companyName
}: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'supervisor' | 'worker'>('admin');
  const [linkedWorkerId, setLinkedWorkerId] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const strength = mode === 'register' ? getPasswordStrength(password) : null;
  const pwdMismatch = mode === 'register' && confirmPassword.length > 0 && confirmPassword !== password;

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await loginUser(email, password, rememberMe);
      if (res.success && res.session) {
        onLogin(res.session);
      } else {
        setError(res.error || 'Login failed.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (role === 'worker' && !linkedWorkerId) { setError('Please select your worker profile.'); return; }
    setIsLoading(true);
    try {
      const res = await registerUser(
        fullName, email, password, role,
        role === 'worker' ? linkedWorkerId : undefined
      );
      if (res.success) {
        setSuccessMsg('Account created! You can now sign in.');
        switchMode('login');
        setEmail(email);
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Clock size={16} />, text: 'Biometric & PIN clock-in with kiosk support' },
    { icon: <Shield size={16} />, text: 'Migrant permit tracker with 30-day expiry alerts' },
    { icon: <DollarSign size={16} />, text: 'Automated payroll & PDF/Excel report export' },
    { icon: <Users size={16} />, text: 'Supervisor bulk crew clock-in management' },
    { icon: <Globe size={16} />, text: 'Full English & French multilingual interface' },
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
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
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
      <div style={{
        flex: '0 0 42%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 3.5rem',
        borderRight: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--accent-primary)', flexShrink: 0 }}>
            <img src={companyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '1.5px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CHRONIX
            </h1>
            <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Workforce Management Pro
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.6rem' }}>
          Complete Workforce<br />
          <span style={{ color: 'var(--accent-primary)' }}>Intelligence</span> Platform
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '2.25rem' }}>
          Manage clock-ins, payroll, permits, and crew operations — all in one secure system built for Mauritius.
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
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', padding: '4px', marginBottom: '1.75rem', border: '1px solid var(--border-color)' }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  background: mode === m ? 'var(--accent-primary)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                {m === 'login' ? <LogIn size={15} /> : <UserPlus size={15} />}
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Banners */}
          {successMsg && (
            <div className="badge badge-success" style={{ width: '100%', padding: '0.7rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', borderRadius: '10px' }}>
              <Check size={15} /> {successMsg}
            </div>
          )}
          {error && (
            <div className="badge badge-danger" style={{ width: '100%', padding: '0.7rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', borderRadius: '10px' }}>
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          {/* ─── LOGIN FORM ─── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="name@company.mu" required autoFocus />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '2.8rem' }}
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
                Remember me for 30 days
              </label>

              <button type="submit" className="btn btn-primary" disabled={isLoading}
                style={{ height: '48px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isLoading
                  ? <><span className="auth-spinner" /> Authenticating...</>
                  : <><LogIn size={18} /> Sign In to Chronix</>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No account yet?{' '}
                <button type="button" onClick={() => switchMode('register')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', padding: 0 }}>
                  Create one <ChevronRight size={12} style={{ verticalAlign: 'middle' }} />
                </button>
              </p>
            </form>
          )}

          {/* ─── REGISTER FORM ─── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} placeholder="e.g. Jean-Pierre Leblanc" required autoFocus />
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="name@company.mu" required />
              </div>

              <div>
                <label style={labelStyle}>Account Role</label>
                <select value={role} onChange={e => { setRole(e.target.value as any); setLinkedWorkerId(''); }} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="admin">Administrator — Full system access</option>
                  <option value="supervisor">Supervisor — Crew & kiosk management</option>
                  <option value="worker">Worker — Personal clock-in portal</option>
                </select>
              </div>

              {role === 'worker' && (
                <div>
                  <label style={labelStyle}>Link to Worker Profile</label>
                  <select value={linkedWorkerId} onChange={e => setLinkedWorkerId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} required>
                    <option value="">— Select your profile —</option>
                    {workers.filter(w => w.status === 'active').map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} {w.surname} · {w.passportOrNcid} · {w.department}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Your login will be linked to this worker record for clock-in access.
                  </p>
                </div>
              )}

              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '2.8rem' }} placeholder="Min. 8 characters" required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {strength && (
                  <div style={{ marginTop: '0.4rem' }}>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '2px', transition: 'width 0.3s ease, background 0.3s ease' }} />
                    </div>
                    <p style={{ fontSize: '0.68rem', color: strength.color, marginTop: '0.2rem', fontWeight: 600 }}>{strength.label}</p>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '2.8rem', borderColor: pwdMismatch ? 'var(--accent-danger)' : undefined }} placeholder="Re-enter password" required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {pwdMismatch && <p style={{ fontSize: '0.68rem', color: 'var(--accent-danger)', marginTop: '0.2rem' }}>Passwords do not match</p>}
              </div>

              <button type="submit" className="btn btn-secondary" disabled={isLoading}
                style={{ height: '48px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isLoading
                  ? <><span className="auth-spinner" /> Creating Account...</>
                  : <><UserPlus size={18} /> Create Account</>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', padding: 0 }}>
                  Sign in <ChevronRight size={12} style={{ verticalAlign: 'middle' }} />
                </button>
              </p>
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
            {companyName} · Powered by Chronix Pro · © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
