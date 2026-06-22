import React, { useState } from 'react';
import type { Worker, ClockLog, Announcement, PaymentHistory } from '../types';
import type { InviteCode } from '../types/auth';
import type { TFunction } from '../data/translations';
import { getInviteCodes, generateInviteCode, revokeInviteCode } from '../utils/authUtils';
import {
  Users,
  DollarSign,
  Bell,
  Settings,
  TrendingUp,
  FileText,
  Clock,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertTriangle,
  Smartphone,
  Send,
  Upload,
  Mail,
  MessageSquare,
  Key,
  Copy,
  RefreshCw,
  Trash,
  Eye,
  EyeOff
} from 'lucide-react';
import { exportPayrollToPdf, exportPayrollToExcel } from '../utils/reportGenerator';

interface AdminPortalProps {
  workers: Worker[];
  logs: ClockLog[];
  announcements: Announcement[];
  payments: PaymentHistory[];
  companyName: string;
  companyLogo: string;
  onUpdateCompanyName: (name: string) => void;
  onUpdateCompanyLogo: (logo: string) => void;
  onAddWorker: (worker: Omit<Worker, 'id'>) => void;
  onUpdateWorker: (worker: Worker) => void;
  onDeleteWorker: (id: string) => void;
  onAddAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onProcessPayment: (workerId: string, hours: number, rate: number) => { success: boolean; error?: string };
  currentUserId: string;
  currentUserName: string;
  t: TFunction;
}

export default function AdminPortal({
  workers,
  logs,
  announcements,
  payments,
  companyName,
  companyLogo,
  onUpdateCompanyName,
  onUpdateCompanyLogo,
  onAddWorker,
  onUpdateWorker,
  onDeleteWorker,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onProcessPayment,
  currentUserId,
  currentUserName,
  t
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workers' | 'payroll' | 'announcements' | 'settings' | 'access-codes'>('dashboard');

  // Worker credentials modal
  const [credentialsWorker, setCredentialsWorker] = useState<Worker | null>(null);
  const [credPinVisible, setCredPinVisible] = useState(false);
  const [credPwdVisible, setCredPwdVisible] = useState(false);
  const [credCopied, setCredCopied] = useState<'pin' | 'pwd' | null>(null);

  const copyCredential = (val: string, type: 'pin' | 'pwd') => {
    navigator.clipboard.writeText(val);
    setCredCopied(type);
    setTimeout(() => setCredCopied(null), 2000);
  };

  // Payroll date range filter
  const [reportStart, setReportStart] = useState('');
  const [reportEnd, setReportEnd] = useState('');

  const filteredLogs = logs.filter(l => {
    if (!reportStart && !reportEnd) return true;
    const d = new Date(l.clockIn).getTime();
    const s = reportStart ? new Date(reportStart).getTime() : -Infinity;
    const e = reportEnd ? new Date(reportEnd + 'T23:59:59').getTime() : Infinity;
    return d >= s && d <= e;
  });

  // Invite codes state
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>(() => getInviteCodes());
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const refreshCodes = () => setInviteCodes(getInviteCodes());

  const handleGenerateSupervisorCode = () => {
    generateInviteCode('supervisor', currentUserId, currentUserName);
    refreshCodes();
  };

  const handleRevokeCode = (id: string) => {
    revokeInviteCode(id);
    refreshCodes();
  };

  const handleCopyCode = (code: InviteCode) => {
    navigator.clipboard.writeText(code.code);
    setCopiedCodeId(code.id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const [isEditingWorker, setIsEditingWorker] = useState<boolean>(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [workerForm, setWorkerForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    hourlySalary: 450,
    passportOrNcid: '',
    department: 'Operations',
    pin: '',
    password: '',
    status: 'active' as 'active' | 'inactive',
    isSupervisor: false,
    supervisorCode: '',
    permitDetails: {
      workPermitExpiry: '',
      entryPermitDetails: '',
      studentPermitDetails: '',
      contractorAssignment: '',
      permittedWorkCategories: ''
    }
  });

  // Invite Worker Modal/Simulator states
  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);
  const [inviteTargetWorker, setInviteTargetWorker] = useState<Worker | null>(null);
  const [inviteMethod, setInviteMethod] = useState<'sms' | 'whatsapp' | 'email'>('sms');
  const [inviteSimulated, setInviteSimulated] = useState<boolean>(false);

  // Announcement Form states
  const [annTitle, setAnnTitle] = useState<string>('');
  const [annContent, setAnnContent] = useState<string>('');
  const [annType, setAnnType] = useState<Announcement['type']>('news');
  const [annSuccessMsg, setAnnSuccessMsg] = useState<string>('');

  // Payment process visual confirmation
  const [payrollNotice, setPayrollNotice] = useState<string>('');

  // Delete confirmation state for workers
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Settings save confirmation
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // Calculation helpers
  const getWorkerTotalHours = (workerId: string) => {
    return logs
      .filter(log => log.workerId === workerId && log.clockOut)
      .reduce((sum, log) => sum + (log.totalHours || 0), 0);
  };

  const getFilteredHours = (workerId: string) => {
    return filteredLogs
      .filter(log => log.workerId === workerId && log.clockOut)
      .reduce((sum, log) => sum + (log.totalHours || 0), 0);
  };

  const getUnpaidHours = (workerId: string) => {
    const totalHours = getWorkerTotalHours(workerId);
    // Find all completed payments for this worker
    const paidHours = payments
      .filter(p => p.workerId === workerId && p.status === 'completed')
      .reduce((sum, p) => sum + p.totalHours, 0);
    return Math.max(0, totalHours - paidHours);
  };

  // 30 days expiry checker
  const getExpiringPermitsList = () => {
    const today = new Date();
    return workers.filter(w => {
      if (!w.permitDetails?.workPermitExpiry || w.status !== 'active') return false;
      const expiry = new Date(w.permitDetails.workPermitExpiry);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30; // Expired or expiring within 30 days
    });
  };

  const expiringPermits = getExpiringPermitsList();

  const totalPayrollDue = workers.reduce((sum, w) => {
    const unpaid = getUnpaidHours(w.id);
    return sum + (unpaid * w.hourlySalary);
  }, 0);

  const totalHoursWorked = logs
    .filter(log => log.clockOut)
    .reduce((sum, log) => sum + (log.totalHours || 0), 0);

  const totalSalaryPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amountPaid, 0);

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateCompanyLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit worker form
  const handleWorkerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanForm = {
      ...workerForm,
      hourlySalary: Number(workerForm.hourlySalary)
    };

    if (editingWorkerId) {
      onUpdateWorker({
        ...cleanForm,
        id: editingWorkerId
      });
    } else {
      onAddWorker(cleanForm);
    }

    setIsEditingWorker(false);
    setEditingWorkerId(null);
    resetWorkerForm();
  };

  const startAddWorker = () => {
    resetWorkerForm();
    setEditingWorkerId(null);
    setIsEditingWorker(true);
  };

  const startEditWorker = (w: Worker) => {
    setEditingWorkerId(w.id);
    setWorkerForm({
      name: w.name,
      surname: w.surname,
      email: w.email,
      phone: w.phone,
      hourlySalary: w.hourlySalary,
      passportOrNcid: w.passportOrNcid,
      department: w.department,
      pin: w.pin,
      password: w.password || '',
      status: w.status,
      isSupervisor: w.isSupervisor || false,
      supervisorCode: w.supervisorCode || '',
      permitDetails: {
        workPermitExpiry: w.permitDetails?.workPermitExpiry || '',
        entryPermitDetails: w.permitDetails?.entryPermitDetails || '',
        studentPermitDetails: w.permitDetails?.studentPermitDetails || '',
        contractorAssignment: w.permitDetails?.contractorAssignment || '',
        permittedWorkCategories: w.permitDetails?.permittedWorkCategories || ''
      }
    });
    setIsEditingWorker(true);
  };

  const resetWorkerForm = () => {
    setWorkerForm({
      name: '',
      surname: '',
      email: '',
      phone: '',
      hourlySalary: 450,
      passportOrNcid: '',
      department: 'Operations',
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      password: Math.random().toString(36).substring(2, 10),
      status: 'active',
      isSupervisor: false,
      supervisorCode: '',
      permitDetails: {
        workPermitExpiry: '',
        entryPermitDetails: '',
        studentPermitDetails: '',
        contractorAssignment: '',
        permittedWorkCategories: ''
      }
    });
  };

  // Simulated invitations
  const triggerInvite = (worker: Worker) => {
    setInviteTargetWorker(worker);
    setInviteSimulated(false);
    setInviteModalOpen(true);
  };

  const handleSendInviteSim = () => {
    setInviteSimulated(true);
    setTimeout(() => {
      setInviteModalOpen(false);
      setInviteTargetWorker(null);
    }, 3500);
  };

  // Submit announcement
  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAnnouncement({
      title: annTitle,
      content: annContent,
      type: annType,
      sender: 'HR Administrator'
    });
    setAnnTitle('');
    setAnnContent('');
    setAnnSuccessMsg('Announcement broadcasted successfully to all workers.');
    setTimeout(() => setAnnSuccessMsg(''), 4000);
  };

  // Release payment
  const handlePayWorker = (workerId: string) => {
    const unpaidHours = getUnpaidHours(workerId);
    const worker = workers.find(w => w.id === workerId);
    if (!worker || unpaidHours <= 0) return;

    const res = onProcessPayment(workerId, unpaidHours, worker.hourlySalary);
    if (res.success) {
      setPayrollNotice(`${t('paymentSuccess')} ${worker.name} ${worker.surname}!`);
      setTimeout(() => setPayrollNotice(''), 4000);
    }
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      
      {/* Top statistics banners */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('dashboard')} className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
          <TrendingUp size={16} /> {t('dashboard')}
        </button>
        <button onClick={() => setActiveTab('workers')} className={`btn ${activeTab === 'workers' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
          <Users size={16} /> {t('workers')}
        </button>
        <button onClick={() => setActiveTab('payroll')} className={`btn ${activeTab === 'payroll' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
          <DollarSign size={16} /> {t('payroll')}
        </button>
        <button onClick={() => setActiveTab('announcements')} className={`btn ${activeTab === 'announcements' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
          <Bell size={16} /> {t('announcements')}
        </button>
        <button onClick={() => setActiveTab('settings')} className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
          <Settings size={16} /> {t('companySettings')}
        </button>
        <button onClick={() => { setActiveTab('access-codes'); refreshCodes(); }} className={`btn ${activeTab === 'access-codes' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
          <Key size={16} /> Access Codes
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div>
          {/* HR Warning Center */}
          {expiringPermits.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: 'var(--accent-danger)', fontWeight: 'bold' }}>
                <AlertTriangle size={20} />
                Critical Permit Warnings ({expiringPermits.length})
              </h3>
              <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {expiringPermits.map(w => {
                  const expiry = w.permitDetails?.workPermitExpiry;
                  return (
                    <li key={w.id} style={{ marginBottom: '0.4rem' }}>
                      Worker <strong>{w.name} {w.surname}</strong> ({w.passportOrNcid}) - Permit Expires: <span style={{ color: 'var(--accent-danger)', fontWeight: 'bold' }}>{expiry}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Quick stats cards grid */}
          <div className="dashboard-grid">
            <div className="glass-panel stats-card">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('activeWorkers')}</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  {workers.filter(w => w.status === 'active').length}
                </h3>
              </div>
              <Users size={32} style={{ color: 'var(--accent-primary)', opacity: 0.8 }} />
            </div>

            <div className="glass-panel stats-card">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('hoursClocked')}</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  {totalHoursWorked.toFixed(1)}h
                </h3>
              </div>
              <Clock size={32} style={{ color: 'var(--accent-info)', opacity: 0.8 }} />
            </div>

            <div className="glass-panel stats-card">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('payrollDue')}</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--accent-warning)' }}>
                  MUR {totalPayrollDue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h3>
              </div>
              <DollarSign size={32} style={{ color: 'var(--accent-warning)', opacity: 0.8 }} />
            </div>

            <div className="glass-panel stats-card">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('totalSalaryPaid')}</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--accent-secondary)' }}>
                  MUR {totalSalaryPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h3>
              </div>
              <TrendingUp size={32} style={{ color: 'var(--accent-secondary)', opacity: 0.8 }} />
            </div>
          </div>

          {/* Activity Logs & Permit Details feed */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('recentActivity')}</h3>
              
              <div className="table-container" style={{ marginTop: '0' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Time</th>
                      <th>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice(-6).reverse().map(log => {
                      const w = workers.find(work => work.id === log.workerId);
                      return (
                        <tr key={log.id}>
                          <td>{w ? `${w.name} ${w.surname}` : 'Unknown'}</td>
                          <td>
                            <div style={{ fontSize: '0.85rem' }}>
                              In: {new Date(log.clockIn).toLocaleTimeString()}
                              {log.clockOut && ` - Out: ${new Date(log.clockOut).toLocaleTimeString()}`}
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                              {log.method.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>{t('noActivity')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Permit Alarm Overview */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
                Permit Expiry Alarms
              </h3>
              {expiringPermits.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {t('noPermitsExpiring')}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {expiringPermits.map(w => (
                    <div key={w.id} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{w.name} {w.surname}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        Expiry: {w.permitDetails?.workPermitExpiry}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WORKERS TAB */}
      {activeTab === 'workers' && (
        <div>
          {isEditingWorker ? (
            /* WORKER FORM (ADD/EDIT) WITH PERMIT TRACKER DETAILS */
            <form onSubmit={handleWorkerFormSubmit} className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                {editingWorkerId ? t('editWorker') : t('addWorker')}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-primary)', marginBottom: '1rem', fontWeight: 600 }}>{t('workerDetails')}</h4>
                  <div className="form-group">
                    <label>{t('firstName')}</label>
                    <input 
                      type="text" 
                      value={workerForm.name} 
                      onChange={e => setWorkerForm({...workerForm, name: e.target.value})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('lastName')}</label>
                    <input 
                      type="text" 
                      value={workerForm.surname} 
                      onChange={e => setWorkerForm({...workerForm, surname: e.target.value})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('emailAddress')}</label>
                    <input 
                      type="email" 
                      value={workerForm.email} 
                      onChange={e => setWorkerForm({...workerForm, email: e.target.value})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('phoneNumber')}</label>
                    <input 
                      type="text" 
                      value={workerForm.phone} 
                      onChange={e => setWorkerForm({...workerForm, phone: e.target.value})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('passportOrNcid')}</label>
                    <input 
                      type="text" 
                      value={workerForm.passportOrNcid} 
                      onChange={e => setWorkerForm({...workerForm, passportOrNcid: e.target.value})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('hourlyRate')}</label>
                    <input 
                      type="number" 
                      value={workerForm.hourlySalary} 
                      onChange={e => setWorkerForm({...workerForm, hourlySalary: Number(e.target.value)})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('department')}</label>
                    <input 
                      type="text" 
                      value={workerForm.department} 
                      onChange={e => setWorkerForm({...workerForm, department: e.target.value})} 
                      className="form-input" 
                      required 
                    />
                  </div>
                </div>

                {/* Permit Tracker fields */}
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-secondary)', marginBottom: '1rem', fontWeight: 600 }}>{t('permitTracker')}</h4>
                  <div className="form-group">
                    <label>{t('workPermitExpiry')}</label>
                    <input 
                      type="date" 
                      value={workerForm.permitDetails.workPermitExpiry} 
                      onChange={e => setWorkerForm({
                        ...workerForm, 
                        permitDetails: { ...workerForm.permitDetails, workPermitExpiry: e.target.value }
                      })} 
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('entryPermitDetails')}</label>
                    <input 
                      type="text" 
                      value={workerForm.permitDetails.entryPermitDetails} 
                      onChange={e => setWorkerForm({
                        ...workerForm, 
                        permitDetails: { ...workerForm.permitDetails, entryPermitDetails: e.target.value }
                      })} 
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('studentPermitDetails')}</label>
                    <input 
                      type="text" 
                      value={workerForm.permitDetails.studentPermitDetails} 
                      onChange={e => setWorkerForm({
                        ...workerForm, 
                        permitDetails: { ...workerForm.permitDetails, studentPermitDetails: e.target.value }
                      })} 
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('laborContractor')}</label>
                    <input 
                      type="text" 
                      value={workerForm.permitDetails.contractorAssignment} 
                      onChange={e => setWorkerForm({
                        ...workerForm, 
                        permitDetails: { ...workerForm.permitDetails, contractorAssignment: e.target.value }
                      })} 
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('workCategories')}</label>
                    <input 
                      type="text" 
                      value={workerForm.permitDetails.permittedWorkCategories} 
                      onChange={e => setWorkerForm({
                        ...workerForm, 
                        permitDetails: { ...workerForm.permitDetails, permittedWorkCategories: e.target.value }
                      })} 
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      value={workerForm.status} 
                      onChange={e => setWorkerForm({...workerForm, status: e.target.value as any})}
                      className="form-input"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', marginBottom: '1rem' }}>
                    <input 
                      type="checkbox" 
                      id="isSupervisorCheckbox"
                      checked={workerForm.isSupervisor} 
                      onChange={e => setWorkerForm({...workerForm, isSupervisor: e.target.checked})} 
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="isSupervisorCheckbox" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 600 }}>
                      Appoint as Site Supervisor
                    </label>
                  </div>

                  {workerForm.isSupervisor && (
                    <div className="form-group">
                      <label>Supervisor Access Code</label>
                      <input 
                        type="text" 
                        value={workerForm.supervisorCode} 
                        onChange={e => setWorkerForm({...workerForm, supervisorCode: e.target.value})} 
                        className="form-input" 
                        placeholder="e.g. SUP-9921"
                        required={workerForm.isSupervisor}
                      />
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        This code will be used by the supervisor to log in to the Supervisor Hub.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setIsEditingWorker(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  {t('cancel')}
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {t('saveWorker')}
                </button>
              </div>
            </form>
          ) : (
            /* WORKERS DIRECTORY LISTING */
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem' }}>{t('workers')} Directory</h3>
                <button onClick={startAddWorker} className="btn btn-primary">
                  <Plus size={18} /> {t('addWorker')}
                </button>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Passport/NCID</th>
                      <th>Rate</th>
                      <th>Department</th>
                      <th>Work Permit Expiry</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map(w => {
                      const today = new Date();
                      const expiryDate = w.permitDetails?.workPermitExpiry ? new Date(w.permitDetails.workPermitExpiry) : null;
                      let permitBadgeClass = 'badge-success';
                      
                      if (expiryDate) {
                        const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        if (daysLeft <= 0) permitBadgeClass = 'badge-danger';
                        else if (daysLeft <= 30) permitBadgeClass = 'badge-warning';
                      }

                      return (
                        <tr key={w.id}>
                          <td style={{ fontWeight: 600 }}>
                            <div>{w.name} {w.surname}</div>
                            {w.isSupervisor && (
                              <div style={{ marginTop: '0.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span className="badge badge-warning" style={{ fontSize: '0.58rem', padding: '0.1rem 0.35rem', textTransform: 'uppercase' }}>
                                  Supervisor
                                </span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                  Code: {w.supervisorCode}
                                </span>
                              </div>
                            )}
                          </td>
                          <td>{w.passportOrNcid}</td>
                          <td>MUR {w.hourlySalary}/hr</td>
                          <td>{w.department}</td>
                          <td>
                            {w.permitDetails?.workPermitExpiry ? (
                              <span className={`badge ${permitBadgeClass}`}>
                                {w.permitDetails.workPermitExpiry}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>-</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${w.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                              {w.status}
                            </span>
                          </td>
                          <td>
                            {confirmDeleteId === w.id ? (
                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--accent-danger)', fontWeight: 600, whiteSpace: 'nowrap' }}>Confirm?</span>
                                <button
                                  onClick={() => { onDeleteWorker(w.id); setConfirmDeleteId(null); }}
                                  className="btn btn-danger"
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', borderRadius: '6px' }}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="btn btn-outline"
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', borderRadius: '6px' }}
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => startEditWorker(w)} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Edit worker">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => { setCredentialsWorker(w); setCredPinVisible(false); setCredPwdVisible(false); }} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--accent-primary)' }} title="View credentials">
                                  <Key size={14} />
                                </button>
                                <button onClick={() => triggerInvite(w)} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--accent-secondary)' }} title="Send Invite">
                                  <Send size={14} />
                                </button>
                                <button onClick={() => setConfirmDeleteId(w.id)} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--accent-danger)' }}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAYROLL & PAYMENTS TAB */}
      {activeTab === 'payroll' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Process Success alert */}
          {payrollNotice && (
            <div className="badge badge-success" style={{ width: '100%', padding: '0.8rem 1.5rem', fontSize: '0.95rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={18} />
              {payrollNotice}
            </div>
          )}

          {/* Date range filter + Export */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{t('payroll')} Calculations</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{t('payrollFormula')}</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>From</label>
                  <input type="date" value={reportStart} onChange={e => setReportStart(e.target.value)} className="form-input" style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>To</label>
                  <input type="date" value={reportEnd} onChange={e => setReportEnd(e.target.value)} className="form-input" style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }} />
                </div>
                {(reportStart || reportEnd) && (
                  <button onClick={() => { setReportStart(''); setReportEnd(''); }} className="btn btn-outline" style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', borderRadius: '8px', alignSelf: 'flex-end' }}>
                    Clear Filter
                  </button>
                )}
              </div>
              {(reportStart || reportEnd) && (
                <p style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)', marginTop: '0.5rem' }}>
                  Showing {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} in selected range
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-end' }}>
              <button
                onClick={() => exportPayrollToExcel(workers, filteredLogs, companyName)}
                className="btn btn-outline"
              >
                <FileText size={18} /> {t('exportExcel')}
              </button>

              <button
                onClick={() => exportPayrollToPdf(workers, filteredLogs, companyName, companyLogo, t)}
                className="btn btn-primary"
              >
                <FileText size={18} /> {t('exportPdf')}
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Detailed Active Payroll Due</h4>
            
            <div className="table-container" style={{ marginTop: '0' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Worker Name</th>
                    <th>Passport / NCID</th>
                    <th>Hourly Rate</th>
                    <th>Hours Worked</th>
                    <th>Gross Due</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map(w => {
                    const hoursInRange = (reportStart || reportEnd) ? getFilteredHours(w.id) : getUnpaidHours(w.id);
                    const grossDue = hoursInRange * w.hourlySalary;

                    return (
                      <tr key={w.id}>
                        <td style={{ fontWeight: 600 }}>{w.name} {w.surname}</td>
                        <td>{w.passportOrNcid}</td>
                        <td>MUR {w.hourlySalary}/hr</td>
                        <td>
                          {hoursInRange.toFixed(2)} hrs
                          {(reportStart || reportEnd) && <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', marginLeft: '0.3rem' }}>(filtered)</span>}
                        </td>
                        <td style={{ fontWeight: 700, color: grossDue > 0 ? 'var(--accent-warning)' : 'var(--text-muted)' }}>
                          MUR {grossDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td>
                          <button 
                            onClick={() => handlePayWorker(w.id)}
                            className="btn btn-secondary"
                            disabled={grossDue <= 0}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px', opacity: grossDue <= 0 ? 0.5 : 1, cursor: grossDue <= 0 ? 'not-allowed' : 'pointer' }}
                          >
                            {t('processPayment')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments History log */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{t('paymentHistory')}</h4>
            
            <div className="table-container" style={{ marginTop: '0' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee Name</th>
                    <th>Ref ID</th>
                    <th>Hours Settled</th>
                    <th>Amount Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice().reverse().map(p => (
                    <tr key={p.id}>
                      <td>{new Date(p.dateProcessed).toLocaleString()}</td>
                      <td style={{ fontWeight: 600 }}>{p.workerName}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.referenceId}</td>
                      <td>{p.totalHours.toFixed(2)} hrs</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>
                        MUR {p.amountPaid.toLocaleString()}
                      </td>
                      <td>
                        <span className="badge badge-success">
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                        {t('noPaymentHistory')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Create Announcement Form */}
          <form onSubmit={handleAnnouncementSubmit} className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{t('createAnnouncement')}</h3>

            {annSuccessMsg && (
              <div className="badge badge-success" style={{ width: '100%', padding: '0.6rem 1rem', marginBottom: '1rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <Check size={16} />
                {annSuccessMsg}
              </div>
            )}

            <div className="form-group">
              <label>{t('announcementTitle')}</label>
              <input 
                type="text" 
                value={annTitle} 
                onChange={e => setAnnTitle(e.target.value)} 
                className="form-input" 
                placeholder="E.g. Safety Briefing / Shift Changes"
                required 
              />
            </div>

            <div className="form-group">
              <label>{t('announcementType')}</label>
              <select 
                value={annType} 
                onChange={e => setAnnType(e.target.value as any)} 
                className="form-input"
              >
                <option value="shift">{t('typeShift')}</option>
                <option value="news">{t('typeNews')}</option>
                <option value="safety">{t('typeSafety')}</option>
                <option value="payroll">{t('typePayroll')}</option>
                <option value="urgent">{t('typeUrgent')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('announcementContent')}</label>
              <textarea 
                value={annContent} 
                onChange={e => setAnnContent(e.target.value)} 
                className="form-input" 
                rows={5}
                placeholder="Write message broadcast details..."
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Bell size={18} /> {t('publishBtn')}
            </button>
          </form>

          {/* Historical Announcements feed */}
          <div className="glass-panel" style={{ padding: '1.5rem', maxHeight: '550px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Broadcast History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {announcements.slice().reverse().map(ann => (
                <div key={ann.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    <span className="badge badge-info">{ann.type.toUpperCase()}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span>{new Date(ann.date).toLocaleString()}</span>
                      <button
                        onClick={() => onDeleteAnnouncement(ann.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-danger)', padding: '0.2rem', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                        title="Delete announcement"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{ann.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                    {ann.content}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>By: {ann.sender}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>{t('noAnnouncements')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '650px' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>{t('companySettings')}</h3>

          {settingsSaved && (
            <div className="badge badge-success" style={{ width: '100%', padding: '0.6rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={16} /> Settings saved successfully.
            </div>
          )}

          <div className="form-group">
            <label>{t('companyName')}</label>
            <input
              type="text"
              value={companyName}
              onChange={e => {
                onUpdateCompanyName(e.target.value);
                setSettingsSaved(false);
              }}
              className="form-input"
              placeholder="E.g. Mauritius Agro Foods Ltd"
            />
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label>{t('companyLogo')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                {companyLogo ? (
                  <img src={companyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  id="logo-upload-input" 
                  onChange={handleLogoUpload} 
                  style={{ display: 'none' }} 
                />
                <label htmlFor="logo-upload-input" className="btn btn-outline" style={{ display: 'inline-flex', cursor: 'pointer' }}>
                  <Upload size={16} /> Choose Image Logo
                </label>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  Upload a PNG/JPG. This logo will automatically format into your Excel and PDF payroll reports.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSettingsSaved(true);
              setTimeout(() => setSettingsSaved(false), 4000);
            }}
            className="btn btn-primary"
            style={{ marginTop: '2rem' }}
          >
            <Check size={16} /> Save Settings
          </button>
        </div>
      )}

      {/* ACCESS CODES TAB */}
      {activeTab === 'access-codes' && (
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={22} style={{ color: 'var(--accent-primary)' }} /> Supervisor Access Codes
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Generate one-time codes for supervisors to self-register. Each code expires in 7 days and can only be used once.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => refreshCodes()} className="btn btn-outline" style={{ padding: '0.5rem 0.9rem', borderRadius: '8px' }}>
                <RefreshCw size={15} />
              </button>
              <button onClick={handleGenerateSupervisorCode} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
                <Plus size={16} /> Generate Code
              </button>
            </div>
          </div>

          {inviteCodes.filter(c => c.targetRole === 'supervisor').length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <Key size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No supervisor codes generated yet.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Click "Generate Code" to create one and share it with your supervisors.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {inviteCodes.filter(c => c.targetRole === 'supervisor').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(code => {
                const isExpired = new Date(code.expiresAt).getTime() < Date.now();
                return (
                  <div key={code.id} className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', opacity: code.used || isExpired ? 0.6 : 1 }}>
                    <code style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.15rem', fontFamily: 'monospace', color: code.used ? 'var(--text-muted)' : 'var(--text-primary)', minWidth: '110px' }}>
                      {code.code}
                    </code>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Created {new Date(code.createdAt).toLocaleDateString()} · Expires {new Date(code.expiresAt).toLocaleDateString()}
                      </div>
                      {code.used && <div style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)', marginTop: '0.15rem' }}>Used by: {code.usedByName}</div>}
                    </div>
                    <span className={`badge ${code.used ? 'badge-info' : isExpired ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.7rem' }}>
                      {code.used ? 'Used' : isExpired ? 'Expired' : 'Active'}
                    </span>
                    {!code.used && !isExpired && (
                      <button onClick={() => handleCopyCode(code)} className="btn btn-outline" style={{ padding: '0.35rem 0.7rem', borderRadius: '7px', color: copiedCodeId === code.id ? 'var(--accent-secondary)' : undefined }}>
                        {copiedCodeId === code.id ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    )}
                    {!code.used && (
                      <button onClick={() => handleRevokeCode(code.id)} className="btn btn-outline" style={{ padding: '0.35rem 0.7rem', borderRadius: '7px', color: 'var(--accent-danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
                        <Trash size={15} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* WORKER CREDENTIALS MODAL */}
      {credentialsWorker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '420px', width: '100%', position: 'relative' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Login Credentials</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Share these with <strong>{credentialsWorker.name} {credentialsWorker.surname}</strong> so they can sign in.
            </p>

            {/* PIN row */}
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Employee PIN (for login &amp; kiosk)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <code style={{ flex: 1, fontSize: '1.6rem', fontWeight: 900, letterSpacing: '0.4rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                  {credPinVisible ? credentialsWorker.pin || '—' : '••••'}
                </code>
                <button type="button" onClick={() => setCredPinVisible(!credPinVisible)} className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', borderRadius: '7px' }}>
                  {credPinVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {credentialsWorker.pin && (
                  <button type="button" onClick={() => copyCredential(credentialsWorker.pin, 'pin')} className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', borderRadius: '7px', color: credCopied === 'pin' ? 'var(--accent-secondary)' : undefined }}>
                    {credCopied === 'pin' ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                )}
              </div>
            </div>

            {/* Supervisor code (if supervisor) */}
            {credentialsWorker.isSupervisor && credentialsWorker.supervisorCode && (
              <div style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Supervisor Access Code (for Supervisor portal)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <code style={{ flex: 1, fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.15rem', fontFamily: 'monospace' }}>{credentialsWorker.supervisorCode}</code>
                  <button type="button" onClick={() => copyCredential(credentialsWorker.supervisorCode!, 'pwd')} className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', borderRadius: '7px', color: credCopied === 'pwd' ? 'var(--accent-secondary)' : undefined }}>
                    {credCopied === 'pwd' ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              On the Login page, {credentialsWorker.isSupervisor ? 'the supervisor selects the Supervisor tab and enters their Access Code.' : 'the employee selects the Employee tab and enters their PIN on the numpad.'}
            </p>

            <button onClick={() => setCredentialsWorker(null)} className="btn btn-outline" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      {/* WORKER INVITATION PHONE SIMULATOR MODAL */}
      {inviteModalOpen && inviteTargetWorker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', maxWidth: '780px', width: '100%', position: 'relative' }}>
            <button 
              onClick={() => { setInviteModalOpen(false); setInviteTargetWorker(null); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              Close
            </button>

            {/* Invite options left side */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                {t('inviteWorker')}: {inviteTargetWorker.name} {inviteTargetWorker.surname}
              </h3>
              
              <div className="form-group">
                <label>{t('inviteMethod')}</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setInviteMethod('sms')} 
                    className={`btn ${inviteMethod === 'sms' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '0.5rem' }}
                  >
                    <Smartphone size={16} /> SMS
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setInviteMethod('whatsapp')} 
                    className={`btn ${inviteMethod === 'whatsapp' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '0.5rem' }}
                  >
                    <MessageSquare size={16} /> WhatsApp
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setInviteMethod('email')} 
                    className={`btn ${inviteMethod === 'email' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '0.5rem' }}
                  >
                    <Mail size={16} /> Email
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Message Content Template</label>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {t('inviteSmsMsg', { 
                    Name: inviteTargetWorker.name, 
                    PIN: inviteTargetWorker.pin, 
                    Password: inviteTargetWorker.password || '1234',
                    Link: 'https://chronix.mu/join'
                  })}
                </div>
              </div>

              <button 
                onClick={handleSendInviteSim} 
                className="btn btn-secondary" 
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={inviteSimulated}
              >
                <Send size={16} /> {inviteSimulated ? 'Invitation Dispatched...' : t('sendInvite')}
              </button>
            </div>

            {/* Simulated Mauritian smartphone display right side */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="phone-header">
                    <span>9:41 AM</span>
                    <span>100% 🔋</span>
                  </div>

                  {/* WhatsApp/SMS chat wrapper */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '0.5rem' }}>
                    {inviteSimulated && (
                      <div 
                        style={{
                          backgroundColor: inviteMethod === 'whatsapp' ? '#075e54' : '#1e293b',
                          padding: '0.75rem',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '0.75rem',
                          maxWidth: '90%',
                          alignSelf: 'flex-start',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                          borderLeft: inviteMethod === 'whatsapp' ? '4px solid #128c7e' : 'none'
                        }}
                      >
                        <p style={{ fontWeight: 'bold', fontSize: '0.65rem', color: '#38bdf8', marginBottom: '0.2rem' }}>
                          {inviteMethod === 'whatsapp' ? 'Chronix Mauritius' : 'CHRONIX_PRO'}
                        </p>
                        <p style={{ lineHeight: '1.3' }}>
                          {t('inviteSmsMsg', { 
                            Name: inviteTargetWorker.name, 
                            PIN: inviteTargetWorker.pin, 
                            Password: inviteTargetWorker.password || '1234',
                            Link: 'https://chronix.mu/join'
                          })}
                        </p>
                      </div>
                    )}

                    {!inviteSimulated && (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', margin: 'auto' }}>
                        Waiting to send invitation...
                      </div>
                    )}
                  </div>

                  <div style={{ height: '3px', width: '120px', background: '#fff', borderRadius: '2px', alignSelf: 'center', marginBottom: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
