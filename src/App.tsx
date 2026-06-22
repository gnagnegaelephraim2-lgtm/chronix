import React, { useState, useEffect } from 'react';
import type { Worker, ClockLog, Announcement, PaymentHistory } from './types';
import type { AuthSession } from './types/auth';
import type { Language } from './data/translations';
import { getT } from './data/translations';
import { clearSession } from './utils/authUtils';
import AdminPortal from './components/AdminPortal';
import WorkerPortal from './components/WorkerPortal';
import KioskPortal from './components/KioskPortal';
import SupervisorPortal from './components/SupervisorPortal';
import LoginPage from './components/LoginPage';
import {
  Building2,
  User,
  Smartphone,
  Users,
  Globe,
  Sun,
  Moon,
  UserCheck2,
  LogOut,
  ShieldCheck,
  Menu,
} from 'lucide-react';

// Pre-seeded logo data URL (sleek stylized emblem base64)
const DEFAULT_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%23131b2e' stroke='%236366f1' stroke-width='4'/><path d='M35 50 L48 62 L68 38' stroke='%2310b981' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>";

// Initial mock workers data seed
const MOCK_WORKERS: Worker[] = [
  {
    id: 'worker-1',
    name: 'Devendra',
    surname: 'Ramgoolam',
    email: 'devendra@ramgoolam.mu',
    phone: '+230 5123 4567',
    hourlySalary: 280,
    passportOrNcid: 'R120384910293',
    department: 'Sugar Processing',
    pin: '1234',
    password: 'password123',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    permitDetails: {
      workPermitExpiry: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days left (Warning status)
      entryPermitDetails: 'Class A Entry Visa #884920',
      studentPermitDetails: 'Not Applicable',
      contractorAssignment: 'AfrAsia Agribusiness Ltd',
      permittedWorkCategories: 'Agricultural Processing & Boiler Operation'
    }
  },
  {
    id: 'worker-2',
    name: 'Jean-Pierre',
    surname: 'Le Bon',
    email: 'jp.lebon@logistics.mu',
    phone: '+230 5789 0123',
    hourlySalary: 320,
    passportOrNcid: 'L051283940192',
    department: 'Logistics',
    pin: '5678',
    password: 'password567',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    permitDetails: {
      workPermitExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 180 days left (Valid status)
      entryPermitDetails: 'Logistics Visa #102948',
      studentPermitDetails: 'Not Applicable',
      contractorAssignment: 'MauriLog Services',
      permittedWorkCategories: 'Heavy Vehicle Operator & Forklift Operations'
    }
  },
  {
    id: 'worker-3',
    name: 'Marie Antoinette',
    surname: 'Dupont',
    email: 'm.dupont@resort.mu',
    phone: '+230 5234 5678',
    hourlySalary: 450,
    passportOrNcid: 'D080472910394',
    department: 'Hospitality',
    pin: '1111',
    password: 'password111',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    permitDetails: {
      workPermitExpiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expired 5 days ago (Alert status)
      entryPermitDetails: 'Tourism & Service Work Permit #992834',
      studentPermitDetails: 'Vatel Student Visa #2024-88',
      contractorAssignment: 'Elite Hospitality Staffing',
      permittedWorkCategories: 'Guest Services & Tour Operations'
    }
  },
  {
    id: 'worker-4',
    name: 'Fatima',
    surname: 'Bibi',
    email: 'fatima.bibi@admin.mu',
    phone: '+230 5987 6543',
    hourlySalary: 350,
    passportOrNcid: 'B060983192039',
    department: 'Administration',
    pin: '2222',
    password: 'password222',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    permitDetails: {
      workPermitExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days left (Valid status)
      entryPermitDetails: 'Corporate Visa #554829',
      studentPermitDetails: 'Not Applicable',
      contractorAssignment: 'Direct Hire',
      permittedWorkCategories: 'Office Management & Secretarial Services'
    }
  }
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Cyclone Safety Warning',
    content: 'Mauritius is currently under Cyclone Warning Class II. All outdoor field shifts are suspended. Indoor staff please check in with supervisors before leaving.',
    type: 'safety',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    sender: 'Health & Safety Manager'
  },
  {
    id: 'ann-2',
    title: 'Payroll Processing Confirmation',
    content: 'Monthly worker payroll has been processed and submitted to the bank. Funds should clear by tomorrow noon. Check your individual portals for slips.',
    type: 'payroll',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sender: 'HR & Finance Director'
  }
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Portals: 'selector' | 'admin' | 'worker' | 'kiosk' | 'supervisor'
  const [portal, setPortal] = useState<'selector' | 'admin' | 'worker' | 'kiosk' | 'supervisor'>('selector');
  const [selectedWorkerForView, setSelectedWorkerForView] = useState<Worker | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Auth session
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // App Databases States
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [logs, setLogs] = useState<ClockLog[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [companyName, setCompanyName] = useState<string>('Mauritius Sugar Cane Corp');
  const [companyLogo, setCompanyLogo] = useState<string>(DEFAULT_LOGO);

  const t = getT(lang);

  // Bootstrap: load data + auth on mount
  useEffect(() => {
    // Data from localStorage
    const storedWorkers = localStorage.getItem('chronix_workers');
    const storedLogs = localStorage.getItem('chronix_logs');
    const storedAnnouncements = localStorage.getItem('chronix_announcements');
    const storedPayments = localStorage.getItem('chronix_payments');
    const storedCompanyName = localStorage.getItem('chronix_company_name');
    const storedCompanyLogo = localStorage.getItem('chronix_company_logo');
    const storedLang = localStorage.getItem('chronix_lang');

    const loadedWorkers: Worker[] = storedWorkers ? JSON.parse(storedWorkers) : MOCK_WORKERS;
    if (!storedWorkers) localStorage.setItem('chronix_workers', JSON.stringify(MOCK_WORKERS));
    setWorkers(loadedWorkers);

    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    } else {
      const mockLogs: ClockLog[] = [
        { id: 'log-1', workerId: 'worker-1', clockIn: new Date(Date.now() - 4 * 3600000).toISOString(), clockOut: new Date(Date.now() - 3600000).toISOString(), totalHours: 3, method: 'kiosk_face' },
        { id: 'log-2', workerId: 'worker-2', clockIn: new Date(Date.now() - 8 * 3600000).toISOString(), clockOut: new Date(Date.now() - 2 * 3600000).toISOString(), totalHours: 6, method: 'worker_portal' }
      ];
      setLogs(mockLogs);
      localStorage.setItem('chronix_logs', JSON.stringify(mockLogs));
    }

    if (storedAnnouncements) {
      setAnnouncements(JSON.parse(storedAnnouncements));
    } else {
      setAnnouncements(MOCK_ANNOUNCEMENTS);
      localStorage.setItem('chronix_announcements', JSON.stringify(MOCK_ANNOUNCEMENTS));
    }

    if (storedPayments) setPayments(JSON.parse(storedPayments));
    if (storedCompanyName) setCompanyName(storedCompanyName);
    if (storedLang) setLang(storedLang as Language);

    // Load logo or fetch from public/logo.png and cache it as base64
    const loadLogo = async () => {
      if (storedCompanyLogo) {
        setCompanyLogo(storedCompanyLogo);
      } else {
        try {
          const response = await fetch('/logo.png');
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setCompanyLogo(base64data);
            localStorage.setItem('chronix_company_logo', base64data);
          };
          reader.readAsDataURL(blob);
        } catch (e) {
          console.error("Failed to load /logo.png", e);
          setCompanyLogo(DEFAULT_LOGO);
        }
      }
    };
    loadLogo();

    // Restoring session
    try {
      const rawSession = localStorage.getItem('chronix_auth_session');
      if (rawSession) {
        const s: AuthSession = JSON.parse(rawSession);
        if (new Date(s.expiresAt).getTime() > Date.now()) {
          setCurrentSession(s);
          if (s.role === 'admin') setPortal('admin');
          else if (s.role === 'supervisor') setPortal('supervisor');
        } else {
          localStorage.removeItem('chronix_auth_session');
        }
      }
    } catch (err) {
      console.error("Failed to load session", err);
    }
    setIsInitializing(false);
  }, []);

  // Resolve worker session after workers are loaded
  useEffect(() => {
    if (!currentSession || currentSession.role !== 'worker' || !currentSession.workerId) return;
    if (workers.length === 0) return;
    const linked = workers.find(w => w.id === currentSession.workerId);
    if (linked) {
      setSelectedWorkerForView(linked);
      setPortal('worker');
    }
  }, [currentSession, workers]);

  // Save changes helper utilities
  const saveWorkers = (updated: Worker[]) => {
    setWorkers(updated);
    localStorage.setItem('chronix_workers', JSON.stringify(updated));
  };

  const saveLogs = (updated: ClockLog[]) => {
    setLogs(updated);
    localStorage.setItem('chronix_logs', JSON.stringify(updated));
  };

  const saveAnnouncements = (updated: Announcement[]) => {
    setAnnouncements(updated);
    localStorage.setItem('chronix_announcements', JSON.stringify(updated));
  };

  const savePayments = (updated: PaymentHistory[]) => {
    setPayments(updated);
    localStorage.setItem('chronix_payments', JSON.stringify(updated));
  };

  // Toggle Language
  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'fr' : 'en';
    setLang(nextLang);
    localStorage.setItem('chronix_lang', nextLang);
  };

  // Toggle Dark/Light Theme
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  // Handle successful login from LoginPage
  const handleLogin = (session: AuthSession) => {
    setCurrentSession(session);
    if (session.role === 'admin') {
      setPortal('admin');
    } else if (session.role === 'supervisor') {
      setPortal('supervisor');
    } else if (session.role === 'worker' && session.workerId) {
      const linked = workers.find(w => w.id === session.workerId);
      if (linked) { setSelectedWorkerForView(linked); setPortal('worker'); }
      else setPortal('selector');
    } else {
      setPortal('selector');
    }
  };

  // Logout — clear session and return to login screen
  const handleLogout = () => {
    clearSession();
    setCurrentSession(null);
    setSelectedWorkerForView(null);
    setPortal('selector');
  };

  // Worker Clock Actions (Kiosk / Portal)
  const handleWorkerClock = (
    workerId: string, 
    method: ClockLog['method']
  ): { success: boolean; isClockIn: boolean; error?: string } => {
    const workerLogs = logs.filter(log => log.workerId === workerId);
    const lastLog = workerLogs.length > 0 ? workerLogs[workerLogs.length - 1] : null;

    const workerObj = workers.find(w => w.id === workerId);
    if (!workerObj || workerObj.status !== 'active') {
      return { success: false, isClockIn: false, error: 'Worker is deactivated or not found.' };
    }

    if (!lastLog || lastLog.clockOut) {
      // CLOCK IN
      const newLog: ClockLog = {
        id: 'log-' + Math.random().toString(36).substring(2, 9),
        workerId,
        clockIn: new Date().toISOString(),
        method
      };
      const updatedLogs = [...logs, newLog];
      saveLogs(updatedLogs);
      return { success: true, isClockIn: true };
    } else {
      // CLOCK OUT
      const clockInTime = new Date(lastLog.clockIn).getTime();
      const clockOutTime = new Date().getTime();
      const diffMs = clockOutTime - clockInTime;
      const hours = diffMs / (1000 * 60 * 60);

      const updatedLogs = logs.map(log => {
        if (log.id === lastLog.id) {
          return {
            ...log,
            clockOut: new Date().toISOString(),
            totalHours: hours > 0.001 ? hours : 0.05 // default minimum test time
          };
        }
        return log;
      });
      saveLogs(updatedLogs);
      return { success: true, isClockIn: false };
    }
  };

  // Supervisor Crew Bulk Clock Actions
  const handleBulkClock = (
    workerIds: string[], 
    actionType: 'clock_in' | 'clock_out'
  ): { success: boolean; count: number; error?: string } => {
    let processedCount = 0;
    const nowStr = new Date().toISOString();
    let updatedLogs = [...logs];

    workerIds.forEach(id => {
      const workerLogs = updatedLogs.filter(log => log.workerId === id);
      const lastLog = workerLogs.length > 0 ? workerLogs[workerLogs.length - 1] : null;

      if (actionType === 'clock_in') {
        if (!lastLog || lastLog.clockOut) {
          const newLog: ClockLog = {
            id: 'log-' + Math.random().toString(36).substring(2, 9),
            workerId: id,
            clockIn: nowStr,
            method: 'supervisor_group'
          };
          updatedLogs.push(newLog);
          processedCount++;
        }
      } else {
        if (lastLog && !lastLog.clockOut) {
          const clockInTime = new Date(lastLog.clockIn).getTime();
          const clockOutTime = new Date().getTime();
          const hours = (clockOutTime - clockInTime) / (1000 * 60 * 60);

          updatedLogs = updatedLogs.map(log => {
            if (log.id === lastLog.id) {
              return {
                ...log,
                clockOut: nowStr,
                totalHours: hours > 0.001 ? hours : 0.05
              };
            }
            return log;
          });
          processedCount++;
        }
      }
    });

    if (processedCount > 0) {
      saveLogs(updatedLogs);
      return { success: true, count: processedCount };
    }
    return { success: false, count: 0, error: 'All selected workers already in requested state.' };
  };

  // Payment Release Handler
  const handleProcessPayment = (workerId: string, hours: number, rate: number) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return { success: false, error: 'Worker not found' };

    const newPayment: PaymentHistory = {
      id: 'pay-' + Math.random().toString(36).substring(2, 9),
      workerId,
      workerName: `${worker.name} ${worker.surname}`,
      totalHours: hours,
      rate,
      amountPaid: parseFloat((hours * rate).toFixed(2)),
      dateProcessed: new Date().toISOString(),
      status: 'completed',
      referenceId: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase()
    };

    savePayments([...payments, newPayment]);
    return { success: true };
  };

  // Add worker
  const handleAddWorker = (newW: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...newW,
      id: 'worker-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };
    saveWorkers([...workers, newWorker]);
  };

  // Update worker
  const handleUpdateWorker = (updatedW: Worker) => {
    const updated = workers.map(w => w.id === updatedW.id ? updatedW : w);
    saveWorkers(updated);
  };

  // Delete worker
  const handleDeleteWorker = (id: string) => {
    const updated = workers.filter(w => w.id !== id);
    saveWorkers(updated);
  };

  // Add announcement
  const handleAddAnnouncement = (newA: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement: Announcement = {
      ...newA,
      id: 'ann-' + Date.now(),
      date: new Date().toISOString()
    };
    saveAnnouncements([...announcements, newAnnouncement]);
  };

  // Delete announcement
  const handleDeleteAnnouncement = (id: string) => {
    saveAnnouncements(announcements.filter(a => a.id !== id));
  };

  // ── Loading screen while auth bootstraps ──────────────────────────────────
  if (isInitializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '1rem' }}>
        <span className="auth-spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Starting Chronix…</p>
      </div>
    );
  }

  // ── Not authenticated → show Login / Register page ─────────────────────────
  if (!currentSession) {
    return (
      <LoginPage
        workers={workers}
        onLogin={handleLogin}
        lang={lang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        companyLogo={companyLogo}
        companyName={companyName}
      />
    );
  }

  const isAdmin = currentSession.role === 'admin';
  const isSupervisor = currentSession.role === 'supervisor';
  const isWorker = currentSession.role === 'worker';

  const navBtn = (label: string, icon: React.ReactNode, target: typeof portal) => (
    <button
      onClick={() => { setPortal(target); setMobileSidebarOpen(false); }}
      className="btn btn-outline"
      style={{
        justifyContent: 'flex-start',
        borderLeft: portal === target ? '4px solid var(--accent-primary)' : '1px solid var(--border-color)',
        background: portal === target ? 'rgba(99,102,241,0.07)' : 'transparent',
        gap: '0.6rem',
      }}
    >
      {icon} {label}
    </button>
  );

  // ── Authenticated app shell ─────────────────────────────────────────────────
  return (
    <div className="app-container">

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Mobile Top Header */}
      <div className="mobile-top-header">
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem' }}
        >
          <Menu size={22} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={companyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.5px' }}>CHRONIX</span>
        </div>
        <span className={`badge ${isAdmin ? 'badge-info' : isSupervisor ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.55rem', padding: '0.15rem 0.45rem', textTransform: 'uppercase' }}>
          {currentSession.role}
        </span>
      </div>

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid var(--accent-primary)' }}>
              <img src={companyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.5px' }}>CHRONIX</h1>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>WORKFORCE SYSTEM</p>
            </div>
          </div>

          {/* Logged-in user pill */}
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: '10px', padding: '0.7rem 0.9rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentSession.userName}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                {currentSession.userEmail}
              </span>
              <span className={`badge ${isAdmin ? 'badge-info' : isSupervisor ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.58rem', padding: '0.15rem 0.45rem', textTransform: 'uppercase', letterSpacing: '0.3px', flexShrink: 0 }}>
                {currentSession.role}
              </span>
            </div>
          </div>

          {/* Language / Theme */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button onClick={handleToggleLang} className="btn btn-outline" style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px' }}>
              <Globe size={13} /> {lang === 'en' ? 'FR' : 'EN'}
            </button>
            <button onClick={handleToggleTheme} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', borderRadius: '8px' }}>
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>

          {/* Role-based portal navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Portals
            </span>

            {isAdmin && navBtn('Admin Panel', <Building2 size={15} />, 'admin')}
            {(isAdmin || isSupervisor) && navBtn('Supervisor Hub', <Users size={15} />, 'supervisor')}
            {(isAdmin || isSupervisor) && navBtn('Kiosk Terminal', <Smartphone size={15} />, 'kiosk')}
            {isWorker && navBtn('My Portal', <User size={15} />, 'worker')}

            {/* Admin-only: quick worker session switcher */}
            {isAdmin && workers.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Preview Workers
                </span>
                {workers.filter(w => w.status === 'active').slice(0, 4).map(w => (
                  <button
                    key={w.id}
                    onClick={() => { setSelectedWorkerForView(w); setPortal('worker'); setMobileSidebarOpen(false); }}
                    className="btn btn-outline"
                    style={{
                      justifyContent: 'flex-start',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.73rem',
                      borderLeft: portal === 'worker' && selectedWorkerForView?.id === w.id ? '3px solid var(--accent-secondary)' : '1px solid var(--border-color)',
                      background: portal === 'worker' && selectedWorkerForView?.id === w.id ? 'rgba(16,185,129,0.05)' : 'transparent',
                      gap: '0.4rem',
                    }}
                  >
                    <User size={11} /> {w.name} {w.surname}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar footer */}
        <div>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ width: '100%', padding: '0.6rem', fontSize: '0.8rem', borderRadius: '8px', color: 'var(--accent-danger)', borderColor: 'rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <LogOut size={15} /> Sign Out
          </button>
          <p style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
            © 2026 Chronix Pro · Mauritius
          </p>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <main className="main-content">

        {/* Selector screen (admin welcome) */}
        {portal === 'selector' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--accent-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '2px solid var(--accent-primary)' }}>
              <UserCheck2 size={40} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {currentSession.userName}!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '480px', lineHeight: 1.6 }}>
              Use the left sidebar to navigate between portals. You are logged in as <strong>{currentSession.role}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {(isAdmin || isSupervisor) && (
                <button onClick={() => setPortal('kiosk')} className="btn btn-primary">
                  Launch Kiosk Terminal
                </button>
              )}
              {isAdmin && (
                <button onClick={() => setPortal('admin')} className="btn btn-outline">
                  Open Admin Panel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Admin Portal — only for admin role */}
        {portal === 'admin' && isAdmin && (
          <AdminPortal
            workers={workers}
            logs={logs}
            announcements={announcements}
            payments={payments}
            companyName={companyName}
            companyLogo={companyLogo}
            onUpdateCompanyName={(name) => { setCompanyName(name); localStorage.setItem('chronix_company_name', name); }}
            onUpdateCompanyLogo={(logo) => { setCompanyLogo(logo); localStorage.setItem('chronix_company_logo', logo); }}
            onAddWorker={handleAddWorker}
            onUpdateWorker={handleUpdateWorker}
            onDeleteWorker={handleDeleteWorker}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onProcessPayment={handleProcessPayment}
            currentUserId={currentSession.userId}
            currentUserName={currentSession.userName}
            t={t}
          />
        )}

        {/* Worker Portal */}
        {portal === 'worker' && selectedWorkerForView && (
          <WorkerPortal
            worker={selectedWorkerForView}
            logs={logs}
            announcements={announcements}
            payments={payments}
            onClockAction={handleWorkerClock}
            t={t}
          />
        )}

        {/* Kiosk Terminal */}
        {portal === 'kiosk' && (isAdmin || isSupervisor) && (
          <KioskPortal
            workers={workers}
            onClockAction={handleWorkerClock}
            t={t}
          />
        )}

        {/* Supervisor Hub */}
        {portal === 'supervisor' && (isAdmin || isSupervisor) && (
          <SupervisorPortal
            workers={workers}
            logs={logs}
            onBulkClockAction={handleBulkClock}
            onUpdateWorker={handleUpdateWorker}
            currentUserId={currentSession.userId}
            currentUserName={currentSession.userName}
            t={t}
          />
        )}

      </main>
    </div>
  );
}
