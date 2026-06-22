import { useState, useEffect, useRef } from 'react';
import type { Worker, ClockLog, Announcement, PaymentHistory } from '../types';
import type { TFunction } from '../data/translations';
import { 
  Clock, 
  Send, 
  MessageSquare, 
  Bell, 
  FileText, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface WorkerPortalProps {
  worker: Worker;
  logs: ClockLog[];
  announcements: Announcement[];
  payments: PaymentHistory[];
  onClockAction: (
    workerId: string,
    method: ClockLog['method']
  ) => { success: boolean; isClockIn: boolean; error?: string };
  t: TFunction;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function WorkerPortal({ worker, logs, announcements, payments, onClockAction, t }: WorkerPortalProps) {
  const [activeTab, setActiveTab] = useState<'clock' | 'announcements' | 'permits' | 'payslip' | 'help'>('clock');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Welcome to Chronix Help! How can we assist you today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [customMsg, setCustomMsg] = useState<string>('');
  const [clockError, setClockError] = useState<string>('');
  const [clockSuccess, setClockSuccess] = useState<string>('');
  const [isHelpSimulating, setIsHelpSimulating] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Filter & sort logs chronologically so status is always accurate
  const workerLogs = logs
    .filter(log => log.workerId === worker.id)
    .sort((a, b) => new Date(a.clockIn).getTime() - new Date(b.clockIn).getTime());

  const currentStatus = workerLogs.length > 0 && !workerLogs[workerLogs.length - 1].clockOut ? 'in' : 'out';
  const lastActiveLog = workerLogs.length > 0 ? workerLogs[workerLogs.length - 1] : null;

  // Worker-specific payment history
  const workerPayments = payments.filter(p => p.workerId === worker.id).slice().reverse();

  // Calculate stats
  const totalWorkedHours = workerLogs.reduce((acc, log) => {
    if (log.clockOut && log.totalHours) {
      return acc + log.totalHours;
    }
    return acc;
  }, 0);

  const estimatedEarnings = totalWorkedHours * worker.hourlySalary;

  // Live elapsed timer for current active shift
  useEffect(() => {
    if (currentStatus !== 'in' || !lastActiveLog) {
      setElapsedTime('');
      return;
    }
    const tick = () => {
      const diff = Date.now() - new Date(lastActiveLog.clockIn).getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsedTime(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [currentStatus, lastActiveLog]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle Clock Action
  const handleClockPress = () => {
    setClockError('');
    setClockSuccess('');
    
    const res = onClockAction(worker.id, 'worker_portal');
    if (res.success) {
      setClockSuccess(res.isClockIn ? t('clockInSuccess') : t('clockOutSuccess'));
      setTimeout(() => setClockSuccess(''), 3000);
    } else {
      setClockError(res.error || 'Operation failed');
    }
  };

  // Chat message simulator logic
  const handleSendChat = (messageText: string) => {
    if (!messageText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { sender: 'user', text: messageText, timestamp: time };
    
    setChatMessages(prev => [...prev, userMsg]);
    setCustomMsg('');
    setIsHelpSimulating(true);

    // Bot Auto-Response
    setTimeout(() => {
      let replyText = t('chatbotResponse');
      if (messageText.toLowerCase().includes('password') || messageText.toLowerCase().includes('pin')) {
        replyText = `Chronix Gate: Hello ${worker.name}, we have sent a secure SMS to ${worker.phone} with your login details. If this was not requested, contact HR.`;
      } else if (messageText.toLowerCase().includes('dead') || messageText.toLowerCase().includes('internet')) {
        replyText = `Chronix Assist: Understood. If your phone has no connection, please use the Kiosk Tablet at Mauritius HQ site. Your supervisor can also clock you in using the supervisor bulk tool.`;
      }
      
      setChatMessages(prev => [...prev, {
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsHelpSimulating(false);
    }, 1200);
  };

  // Check if permit is expiring (< 30 days)
  const getPermitStatus = () => {
    if (!worker.permitDetails?.workPermitExpiry) return 'none';
    const expiry = new Date(worker.permitDetails.workPermitExpiry);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'expired';
    if (diffDays <= 30) return 'warning';
    return 'valid';
  };

  const permitStatus = getPermitStatus();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Welcome header */}
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
            {t('welcomeBack')} {worker.name}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {worker.department} | {worker.passportOrNcid}
          </p>
        </div>

        {/* Status indicator pill */}
        <span className={`badge ${currentStatus === 'in' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
          <Clock size={16} />
          {currentStatus === 'in' ? 'Clocked In' : 'Clocked Out'}
        </span>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('clock')}
          className={`btn ${activeTab === 'clock' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}
        >
          <Clock size={16} /> {t('dashboard')}
        </button>
        <button 
          onClick={() => setActiveTab('announcements')}
          className={`btn ${activeTab === 'announcements' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', position: 'relative' }}
        >
          <Bell size={16} /> {t('announcements')}
          {announcements.length > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-danger)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {announcements.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('permits')}
          className={`btn ${activeTab === 'permits' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}
        >
          <FileText size={16} /> {t('permitTracker')}
        </button>
        <button
          onClick={() => setActiveTab('payslip')}
          className={`btn ${activeTab === 'payslip' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', position: 'relative' }}
        >
          <FileText size={16} /> Payslip
          {workerPayments.length > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-secondary)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {workerPayments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className={`btn ${activeTab === 'help' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}
        >
          <MessageSquare size={16} /> {t('whatsappHelp')}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'clock' && (
        <div className="responsive-grid-main-sidebar">
          
          {/* Main Console */}
          <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
            
            {/* Clock animation */}
            <div 
              onClick={handleClockPress}
              className={currentStatus === 'in' ? 'pulse-clock' : ''}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: currentStatus === 'in' 
                  ? 'radial-gradient(circle, var(--accent-secondary) 0%, #065f46 100%)'
                  : 'radial-gradient(circle, var(--accent-primary) 0%, #312e81 100%)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                border: '4px solid rgba(255,255,255,0.1)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Clock size={48} style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {currentStatus === 'in' ? 'Clock Out' : 'Clock In'}
              </span>
            </div>

            {/* Live elapsed timer */}
            {currentStatus === 'in' && elapsedTime && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Shift Duration
                </span>
                <p style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-secondary)', marginTop: '0.2rem', letterSpacing: '2px' }}>
                  {elapsedTime}
                </p>
              </div>
            )}

            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
              {lastActiveLog ? (
                <>
                  {currentStatus === 'in'
                    ? `${t('clockedInAt')} ${new Date(lastActiveLog.clockIn).toLocaleTimeString()}`
                    : `${t('clockedOutAt')} ${new Date(lastActiveLog.clockOut || '').toLocaleTimeString()}`
                  }
                </>
              ) : (
                'No clock entries registered yet.'
              )}
            </p>

            {/* Error notifications */}
            {clockError && (
              <div className="badge badge-danger" style={{ marginTop: '1.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                <AlertTriangle size={16} style={{ marginRight: '0.4rem' }} />
                {clockError}
              </div>
            )}

            {clockSuccess && (
              <div className="badge badge-success" style={{ marginTop: '1.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                <CheckCircle size={16} style={{ marginRight: '0.4rem' }} />
                {clockSuccess}
              </div>
            )}
          </div>

          {/* Individual Salary Dashboard Widget */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Individual Attendance Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL HOURS WORKED</span>
                  <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--accent-info)' }}>
                    {totalWorkedHours.toFixed(2)} hrs
                  </p>
                </div>
                
                <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />
                
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HOURLY RATE</span>
                  <p style={{ fontSize: '1.3rem', fontWeight: 600 }}>
                    MUR {worker.hourlySalary}/hr
                  </p>
                </div>
                
                <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESTIMATED PAY (PENDING)</span>
                  <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                    MUR {estimatedEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Calculated: Hours Worked × Hourly Salary
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Support Card */}
            <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <HelpCircle style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Offline Clock-In</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Phone dead or no internet? Ask your supervisor to clock you in via their crew list, or use the tablet at the entrance.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{t('announcements')}</h3>
          
          {announcements.map(ann => {
            let badgeClass = 'badge-info';
            if (ann.type === 'safety') badgeClass = 'badge-warning';
            if (ann.type === 'urgent') badgeClass = 'badge-danger';
            if (ann.type === 'payroll') badgeClass = 'badge-success';

            return (
              <div key={ann.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className={`badge ${badgeClass}`}>
                    {ann.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(ann.date).toLocaleString()}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>{ann.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {ann.content}
                </p>
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  By: {ann.sender}
                </div>
              </div>
            );
          })}

          {announcements.length === 0 && (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              {t('noAnnouncements')}
            </div>
          )}
        </div>
      )}

      {activeTab === 'permits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              {t('permitTracker')}
            </h3>

            {permitStatus === 'expired' && (
              <div className="badge badge-danger" style={{ width: '100%', padding: '0.8rem 1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <AlertTriangle size={16} style={{ marginRight: '0.5rem' }} />
                {t('permitExpired')}
              </div>
            )}

            {permitStatus === 'warning' && (
              <div className="badge badge-warning" style={{ width: '100%', padding: '0.8rem 1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <AlertTriangle size={16} style={{ marginRight: '0.5rem' }} />
                {t('permitWarning')}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('workPermitExpiry')}</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem', color: permitStatus === 'valid' ? 'var(--accent-secondary)' : 'var(--accent-danger)' }}>
                  {worker.permitDetails?.workPermitExpiry || 'Not Loaded'}
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('workCategories')}</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  {worker.permitDetails?.permittedWorkCategories || 'Not Configured'}
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('laborContractor')}</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  {worker.permitDetails?.contractorAssignment || 'None'}
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('entryPermitDetails')}</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  {worker.permitDetails?.entryPermitDetails || 'N/A'}
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('studentPermitDetails')}</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  {worker.permitDetails?.studentPermitDetails || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payslip' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Payment History</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Total earned (all time): <strong style={{ color: 'var(--accent-secondary)' }}>
                MUR {workerPayments.reduce((s, p) => s + p.amountPaid, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </strong>
            </p>

            {workerPayments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <FileText size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p>No payments processed yet. Your payslips will appear here once admin releases payment.</p>
              </div>
            ) : (
              <div className="table-container" style={{ marginTop: 0 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Ref ID</th>
                      <th>Hours Settled</th>
                      <th>Rate</th>
                      <th>Amount Paid</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workerPayments.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontSize: '0.82rem' }}>{new Date(p.dateProcessed).toLocaleString()}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.referenceId}</td>
                        <td>{p.totalHours.toFixed(2)} hrs</td>
                        <td>MUR {p.rate}/hr</td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>
                          MUR {p.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td><span className="badge badge-success">{p.status.toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'help' && (
        <div className="responsive-grid-main-sidebar">
          
          {/* Interactive Chat Console (Simulated WhatsApp UI) */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '480px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} style={{ color: 'var(--accent-secondary)' }} />
              {t('helpCenter')}
            </h3>

            {/* Message Stream */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    backgroundColor: msg.sender === 'user' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    color: '#fff',
                    position: 'relative'
                  }}
                >
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{msg.text}</p>
                  <span style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem', textAlign: 'right' }}>
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isHelpSimulating && (
                <div style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <RefreshCw size={14} className="pulse-clock" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gateway sending...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Custom Input */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat(customMsg)}
                placeholder={t('mockMessagePlaceholder')}
                className="form-input"
                style={{ flex: 1, padding: '0.6rem 1rem' }}
              />
              <button 
                onClick={() => handleSendChat(customMsg)}
                className="btn btn-primary"
                style={{ padding: '0 1rem' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Quick FAQ Shortcuts */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Quick FAQ Actions
            </h4>
            
            <button 
              onClick={() => handleSendChat(t('askLoginHelp'))}
              className="btn btn-outline" 
              style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.6rem 0.8rem', textAlign: 'left' }}
            >
              🔑 {t('askLoginHelp')}
            </button>

            <button 
              onClick={() => handleSendChat(t('askPasswordReset'))}
              className="btn btn-outline" 
              style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.6rem 0.8rem', textAlign: 'left' }}
            >
              📲 {t('askPasswordReset')}
            </button>

            <button 
              onClick={() => handleSendChat(t('askClockInTrouble'))}
              className="btn btn-outline" 
              style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.6rem 0.8rem', textAlign: 'left' }}
            >
              📶 {t('askClockInTrouble')}
            </button>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
              <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Help via WhatsApp/SMS</h5>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                All automated messages are routed through our mock Mauritian SMS center. Standard carrier rates do not apply.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
