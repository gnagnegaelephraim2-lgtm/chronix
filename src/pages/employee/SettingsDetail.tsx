// Screen D4 — Employee Settings detail (generic shell keyed by :sectionId)
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { EMPLOYEE_SETTINGS_SECTIONS } from '../../data/settingsSections';
import { useSession } from '../../hooks/useSession';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';

export function EmployeeSettingsDetail() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguage();
  const { session } = useSession();
  const { state } = useStore();
  const employee = state.employees.find((e) => e.id === session?.employeeId);
  const section = EMPLOYEE_SETTINGS_SECTIONS.find((s) => s.id === sectionId);

  if (!section) return <div className="empty-state">Section not found.</div>;

  return (
    <div>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="icon-btn" onClick={() => navigate('/employee/settings')}>
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.3rem' }}>{section.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{section.description}</p>
          </div>
        </div>
      </div>

      <div className="card">
        {section.id === 'personal-information' && employee && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="side-panel-row">
              <div className="side-panel-row-main">
                <div className="side-panel-sub">Name</div>
                <div className="side-panel-name">
                  {employee.firstName} {employee.lastName}
                </div>
              </div>
            </div>
            <div className="side-panel-row">
              <div className="side-panel-row-main">
                <div className="side-panel-sub">Email</div>
                <div className="side-panel-name">{employee.email}</div>
              </div>
            </div>
            <div className="side-panel-row">
              <div className="side-panel-row-main">
                <div className="side-panel-sub">Phone</div>
                <div className="side-panel-name">{employee.phone}</div>
              </div>
            </div>
          </div>
        )}

        {section.id === 'app-preferences' && (
          <div>
            <div className="side-panel-row">
              <div className="side-panel-row-main">
                <div className="side-panel-name">Language</div>
                <div className="side-panel-sub">Current: {lang === 'en' ? 'English' : 'Français'}</div>
              </div>
              <button className="btn btn-outline" onClick={toggleLang}>
                Switch to {lang === 'en' ? 'Français' : 'English'}
              </button>
            </div>
          </div>
        )}

        {!['personal-information', 'app-preferences'].includes(section.id) && <div className="empty-state">This section is coming soon.</div>}
      </div>
    </div>
  );
}
