import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Menu } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useSession } from '../../hooks/useSession';
import { useStore } from '../../hooks/useStore';
import { Avatar } from '../common/Avatar';
import { NotificationBell } from './NotificationBell';
import { GlobalSearch } from './GlobalSearch';
import { EditProfileModal } from '../employee/EditProfileModal';
import logoWhite from '../../assets/chronix_logo_white.png';

interface TopBarProps {
  variant: 'admin' | 'employee';
  onOpenMobile: () => void;
}

export function TopBar({ variant, onOpenMobile }: TopBarProps) {
  const { lang, toggleLang } = useLanguage();
  const { session } = useSession();
  const { state } = useStore();
  const employee = state.employees.find((e) => e.id === session?.employeeId);

  return (
    <div className="mobile-top-header">
      <button className="icon-btn" onClick={onOpenMobile} aria-label="Open menu" style={{ background: 'transparent', border: 'none', color: '#fff' }}>
        <Menu size={22} />
      </button>
      <img src={logoWhite} alt="Chronix" style={{ height: 100, width: 100, objectFit: 'contain', margin: '-35px 0', display: 'block' }} />
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button className="icon-btn" onClick={toggleLang} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.75rem', width: 'auto' }}>
          {lang.toUpperCase()}
        </button>
        {variant === 'admin' ? (
          <NotificationBell color="#fff" />
        ) : (
          employee && <Avatar src={employee.avatarUrl} name={`${employee.firstName} ${employee.lastName}`} size={28} />
        )}
      </div>
    </div>
  );
}

export function DesktopTopBar({ variant }: { variant: 'admin' | 'employee' }) {
  const { t, lang, toggleLang } = useLanguage();
  const { session, logout } = useSession();
  const { state } = useStore();
  const navigate = useNavigate();
  const employee = state.employees.find((e) => e.id === session?.employeeId);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? 'Good afternoon' : 'Good evening';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className={`topbar topbar--${variant}`}>
      {variant === 'admin' ? (
        <GlobalSearch />
      ) : (
        <div>
          <div style={{ fontWeight: 700 }}>
            {greeting}, {employee?.firstName} 👋
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={toggleLang} style={{ padding: '0.4rem 0.8rem', minHeight: 32 }}>
          {lang === 'en' ? 'FR' : 'EN'}
        </button>
        {variant === 'admin' && <NotificationBell />}
        
        {employee && (
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '8px', transition: 'background 0.2s' }}
              className="topbar-profile-btn"
            >
              <Avatar src={employee.avatarUrl} name={`${employee.firstName} ${employee.lastName}`} size={34} />
              <div style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {employee.firstName} {employee.lastName}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{employee.role}</div>
              </div>
              <ChevronDown size={16} color="var(--text-secondary)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {dropdownOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setDropdownOpen(false)} />
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--card-shadow-hover)',
                  padding: '0.5rem',
                  minWidth: '180px',
                  zIndex: 999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <button 
                    className="dropdown-item" 
                    onClick={() => { setDropdownOpen(false); setShowEditProfile(true); }}
                    style={{ background: 'transparent', border: 'none', padding: '0.6rem 0.8rem', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}
                  >
                    <span>👤</span> Edit Profile
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={() => { setDropdownOpen(false); navigate(variant === 'admin' ? '/admin/settings' : '/employee/settings'); }}
                    style={{ background: 'transparent', border: 'none', padding: '0.6rem 0.8rem', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}
                  >
                    <span>⚙️</span> {t('settingsTitle')}
                  </button>
                  <div style={{ borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />
                  <button 
                    className="dropdown-item logout-btn" 
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    style={{ background: 'transparent', border: 'none', padding: '0.6rem 0.8rem', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}
                  >
                    <span>🚪</span> {t('logout')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showEditProfile && employee && (
        <EditProfileModal employee={employee} onClose={() => setShowEditProfile(false)} />
      )}
    </div>
  );
}
