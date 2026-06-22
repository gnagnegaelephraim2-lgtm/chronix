import { useState } from 'react';
import type { Worker, ClockLog } from '../types';
import type { InviteCode } from '../types/auth';
import type { TFunction } from '../data/translations';
import { getInviteCodes, generateInviteCode, revokeInviteCode } from '../utils/authUtils';
import { Users, CheckSquare, Square, Check, LogIn, LogOut, Search, AlertTriangle, Key, Plus, Copy, RefreshCw, Trash } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SupervisorPortalProps {
  workers: Worker[];
  logs: ClockLog[];
  onBulkClockAction: (
    workerIds: string[], 
    actionType: 'clock_in' | 'clock_out'
  ) => { success: boolean; count: number; error?: string };
  onUpdateWorker: (worker: Worker) => void;
  currentUserId: string;
  currentUserName: string;
  t: TFunction;
}

export default function SupervisorPortal({ workers, logs, onBulkClockAction, onUpdateWorker, currentUserId, currentUserName, t }: SupervisorPortalProps) {
  const [activeTab, setActiveTab] = useState<'crew' | 'access-codes'>('crew');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
  const [notificationMsg, setNotificationMsg] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  // PIN editing states
  const [editingWorkerForPin, setEditingWorkerForPin] = useState<Worker | null>(null);

  // Invite codes
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>(() => getInviteCodes());
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const refreshCodes = () => setInviteCodes(getInviteCodes());

  const handleGenerateWorkerCode = () => {
    generateInviteCode('worker', currentUserId, currentUserName);
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
  const [newPinValue, setNewPinValue] = useState<string>('');

  // Departments list for filtering
  const departments = ['all', ...Array.from(new Set(workers.map(w => w.department))).filter(Boolean)];

  // Filtered workers list
  const filteredWorkers = workers.filter(w => {
    if (w.status !== 'active') return false;
    const matchDept = selectedDept === 'all' || w.department === selectedDept;
    const nameStr = `${w.name} ${w.surname}`.toLowerCase();
    const matchSearch = nameStr.includes(searchQuery.toLowerCase()) || w.passportOrNcid.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  // Get current clock status of a worker ('in' or 'out')
  const getWorkerClockStatus = (workerId: string): 'in' | 'out' => {
    const workerLogs = logs.filter(log => log.workerId === workerId);
    if (workerLogs.length === 0) return 'out';
    const lastLog = workerLogs[workerLogs.length - 1];
    return lastLog.clockOut ? 'out' : 'in';
  };

  // Toggle individual selection
  const handleToggleSelect = (workerId: string) => {
    if (selectedWorkerIds.includes(workerId)) {
      setSelectedWorkerIds(selectedWorkerIds.filter(id => id !== workerId));
    } else {
      setSelectedWorkerIds([...selectedWorkerIds, workerId]);
    }
  };

  // Toggle select all visible workers
  const handleSelectAllVisible = () => {
    const allVisibleIds = filteredWorkers.map(w => w.id);
    const areAllSelected = allVisibleIds.every(id => selectedWorkerIds.includes(id));

    if (areAllSelected) {
      // Unselect all visible workers
      setSelectedWorkerIds(selectedWorkerIds.filter(id => !allVisibleIds.includes(id)));
    } else {
      // Select all visible workers
      const newSelection = Array.from(new Set([...selectedWorkerIds, ...allVisibleIds]));
      setSelectedWorkerIds(newSelection);
    }
  };

  // Handle bulk action
  const handleBulkAction = (actionType: 'clock_in' | 'clock_out') => {
    if (selectedWorkerIds.length === 0) {
      setNotificationMsg(t('noWorkersSelected'));
      setIsError(true);
      return;
    }

    const res = onBulkClockAction(selectedWorkerIds, actionType);
    if (res.success) {
      setNotificationMsg(`${t('bulkClockSuccess')} (${res.count} workers)`);
      setIsError(false);
      setSelectedWorkerIds([]);
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
      setTimeout(() => setNotificationMsg(''), 5000);
    } else {
      // Keep selection so user can retry without reselecting
      setNotificationMsg(res.error || 'Bulk clock operation failed. Workers may already be in the requested state.');
      setIsError(true);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={28} style={{ color: 'var(--accent-primary)' }} />
          {t('supervisorPortal')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{t('supervisorSelectCrew')}</p>
      </header>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveTab('crew')} className={`btn ${activeTab === 'crew' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.45rem 1.1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
          <Users size={15} /> Crew Management
        </button>
        <button onClick={() => { setActiveTab('access-codes'); refreshCodes(); }} className={`btn ${activeTab === 'access-codes' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.45rem 1.1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
          <Key size={15} /> Access Codes
        </button>
      </div>

      {/* ACCESS CODES TAB */}
      {activeTab === 'access-codes' && (
        <div style={{ maxWidth: '750px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Worker Registration Codes</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Generate one-time codes for your employees to self-register. Valid 7 days, single use.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={refreshCodes} className="btn btn-outline" style={{ padding: '0.5rem 0.9rem', borderRadius: '8px' }}>
                <RefreshCw size={15} />
              </button>
              <button onClick={handleGenerateWorkerCode} className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', borderRadius: '8px' }}>
                <Plus size={15} /> Generate Code
              </button>
            </div>
          </div>

          {inviteCodes.filter(c => c.targetRole === 'worker' && c.createdBy === currentUserId).length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <Key size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No worker codes generated yet.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>Click "Generate Code" and share it with your team members.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {inviteCodes.filter(c => c.targetRole === 'worker' && c.createdBy === currentUserId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(code => {
                const isExpired = new Date(code.expiresAt).getTime() < Date.now();
                return (
                  <div key={code.id} className="glass-panel" style={{ padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', opacity: code.used || isExpired ? 0.55 : 1 }}>
                    <code style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15rem', fontFamily: 'monospace', color: code.used ? 'var(--text-muted)' : 'var(--text-primary)', minWidth: '100px' }}>
                      {code.code}
                    </code>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
                        Created {new Date(code.createdAt).toLocaleDateString()} · Expires {new Date(code.expiresAt).toLocaleDateString()}
                      </div>
                      {code.used && <div style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', marginTop: '0.1rem' }}>Registered: {code.usedByName}</div>}
                    </div>
                    <span className={`badge ${code.used ? 'badge-info' : isExpired ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.68rem' }}>
                      {code.used ? 'Used' : isExpired ? 'Expired' : 'Active'}
                    </span>
                    {!code.used && !isExpired && (
                      <button onClick={() => handleCopyCode(code)} className="btn btn-outline" style={{ padding: '0.3rem 0.65rem', borderRadius: '7px', color: copiedCodeId === code.id ? 'var(--accent-secondary)' : undefined }}>
                        {copiedCodeId === code.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                    {!code.used && (
                      <button onClick={() => handleRevokeCode(code.id)} className="btn btn-outline" style={{ padding: '0.3rem 0.65rem', borderRadius: '7px', color: 'var(--accent-danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREW MANAGEMENT TAB */}
      {activeTab === 'crew' && notificationMsg && (
        <div
          className={`badge ${isError ? 'badge-danger' : 'badge-success'}`}
          style={{ width: '100%', padding: '0.8rem 1.5rem', marginBottom: '1.5rem', fontSize: '0.95rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isError ? <AlertTriangle size={18} /> : <Check size={18} />}
          {notificationMsg}
        </div>
      )}

      {activeTab === 'crew' && <div>
      {/* Control panel card */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
          {/* Department filter */}
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '180px' }}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? t('allDepartments') : dept}
              </option>
            ))}
          </select>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--button-radius)', padding: '0 1rem', background: 'rgba(0,0,0,0.15)', flex: 1 }}>
            <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />
            <input 
              type="text"
              placeholder={t('searchWorker')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleSelectAllVisible}
            className="btn btn-outline"
            style={{ padding: '0.6rem 1rem' }}
          >
            {filteredWorkers.length > 0 && filteredWorkers.every(w => selectedWorkerIds.includes(w.id)) ? 'Deselect All' : 'Select All'}
          </button>
          
          <button 
            onClick={() => handleBulkAction('clock_in')}
            className="btn btn-secondary"
            disabled={selectedWorkerIds.length === 0}
            style={{ opacity: selectedWorkerIds.length === 0 ? 0.6 : 1 }}
          >
            <LogIn size={18} />
            {t('bulkClockIn')} ({selectedWorkerIds.length})
          </button>
          
          <button 
            onClick={() => handleBulkAction('clock_out')}
            className="btn btn-danger"
            disabled={selectedWorkerIds.length === 0}
            style={{ opacity: selectedWorkerIds.length === 0 ? 0.6 : 1 }}
          >
            <LogOut size={18} />
            {t('bulkClockOut')} ({selectedWorkerIds.length})
          </button>
        </div>
      </div>

      {/* Workers selection grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filteredWorkers.map(w => {
          const isSelected = selectedWorkerIds.includes(w.id);
          const clockStatus = getWorkerClockStatus(w.id);
          
          return (
            <div 
              key={w.id}
              onClick={() => handleToggleSelect(w.id)}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                boxShadow: isSelected ? '0 0 12px var(--accent-primary-glow)' : 'var(--card-shadow)',
                background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Custom Checkbox */}
                <div style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  {isSelected ? <CheckSquare size={22} /> : <Square size={22} />}
                </div>

                {/* Worker Avatar & Name */}
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  {w.avatar ? (
                    <img src={w.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Users size={22} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{w.name} {w.surname}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {w.department}
                  </p>
                </div>
              </div>

              {/* Status Badge & PIN management */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span className={`badge ${clockStatus === 'in' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                  {clockStatus === 'in' ? 'Clocked In' : 'Clocked Out'}
                </span>
                <div 
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card selection toggle
                    setEditingWorkerForPin(w);
                    setNewPinValue(w.pin || '');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                  title="Assign/Change Employee PIN Code"
                >
                  <Key size={12} style={{ color: 'var(--accent-secondary)' }} />
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>PIN: {w.pin || 'None'}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredWorkers.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }} className="glass-panel">
            No crew members match the search query or selected department filter.
          </div>
        )}
      </div>

      {/* Change PIN Modal */}
      </div>}{/* end activeTab === 'crew' */}

      {editingWorkerForPin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '400px', width: '100%', position: 'relative' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Assign Employee PIN Code
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Assign or change the secure Kiosk & Portal PIN for <strong>{editingWorkerForPin.name} {editingWorkerForPin.surname}</strong>.
            </p>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Employee PIN Code (4-6 digits)
              </label>
              <input 
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={6}
                value={newPinValue} 
                onChange={e => setNewPinValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-input" 
                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.5rem', fontWeight: 'bold' }}
                placeholder="1234"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
              <button 
                type="button" 
                onClick={() => setEditingWorkerForPin(null)} 
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (!/^\d{4,6}$/.test(newPinValue)) {
                    alert("PIN must be between 4 and 6 digits.");
                    return;
                  }
                  onUpdateWorker({
                    ...editingWorkerForPin,
                    pin: newPinValue
                  });
                  setEditingWorkerForPin(null);
                }} 
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Save PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
