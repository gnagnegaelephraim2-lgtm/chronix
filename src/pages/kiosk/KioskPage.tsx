// Shared-terminal check-in — turns any tablet/computer at a site entrance
// into a check-in station employees use without a personal login. Physical
// access to the device is the trust boundary here, same as a real punch
// clock or badge reader: whoever is standing at it taps their own name.
import { useEffect, useState } from 'react';
import { Search, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { Avatar } from '../../components/common/Avatar';
import { localDateString } from '../../utils/format';
import logoWhite from '../../assets/chronix_logo_white.png';

export function KioskPage() {
  const { state } = useStore();
  const { clockIn, clockOut } = useStoreActions();
  const [now, setNow] = useState(() => new Date());
  const [search, setSearch] = useState('');
  const [confirmed, setConfirmed] = useState<{ name: string; action: 'in' | 'out' } | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!confirmed) return;
    const t = window.setTimeout(() => setConfirmed(null), 2500);
    return () => window.clearTimeout(t);
  }, [confirmed]);

  const employees = state.employees.filter(
    (e) => e.allowedCheckInMethods.includes('kiosk') && `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  function isClockedIn(employeeId: string) {
    const today = localDateString();
    return state.attendance.some((r) => r.employeeId === employeeId && r.date === today && r.live);
  }

  function handleTap(employeeId: string, firstName: string, lastName: string) {
    const clockedIn = isClockedIn(employeeId);
    if (clockedIn) {
      clockOut(employeeId);
      setConfirmed({ name: firstName, action: 'out' });
    } else {
      const workLocationId = state.employees.find((e) => e.id === employeeId)?.workLocationId ?? state.settings.workLocations[0]?.id ?? '';
      clockIn(employeeId, 'kiosk', workLocationId);
      setConfirmed({ name: firstName, action: 'in' });
    }
    setSearch('');
    void lastName;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, var(--chronix-navy) 0%, #0f2438 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.25rem' }}>
      <img src={logoWhite} alt="Chronix" style={{ height: 40, marginBottom: '1.5rem' }} />

      <div style={{ textAlign: 'center', color: '#fff', marginBottom: '2rem' }}>
        <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '1px' }}>
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div style={{ fontSize: '1.05rem', opacity: 0.85 }}>
          {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {confirmed ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: '2.5rem 3rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <CheckCircle2 size={56} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
            {confirmed.name}, you're clocked {confirmed.action === 'in' ? 'in' : 'out'}!
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Have a great {confirmed.action === 'in' ? 'shift' : 'rest'}.</p>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              autoFocus
              className="form-input"
              placeholder="Search your name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '3rem', height: 56, fontSize: '1.1rem', borderRadius: 16 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', maxHeight: '55vh', overflowY: 'auto' }}>
            {employees.map((emp) => {
              const clockedIn = isClockedIn(emp.id);
              return (
                <button
                  key={emp.id}
                  onClick={() => handleTap(emp.id, emp.firstName, emp.lastName)}
                  style={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: 16,
                    padding: '1.25rem 0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.6rem',
                    cursor: 'pointer',
                    minHeight: 44,
                  }}
                >
                  <Avatar src={emp.avatarUrl} name={`${emp.firstName} ${emp.lastName}`} size={56} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>
                    {emp.firstName} {emp.lastName}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: clockedIn ? 'var(--success)' : 'var(--text-secondary)',
                    }}
                  >
                    {clockedIn ? <LogOut size={12} /> : <LogIn size={12} />}
                    {clockedIn ? 'Clock Out' : 'Clock In'}
                  </span>
                </button>
              );
            })}
            {employees.length === 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>No matching employee.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
