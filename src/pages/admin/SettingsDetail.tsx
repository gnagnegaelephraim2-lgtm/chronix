// Screen C6 — Admin Settings detail (generic shell keyed by :sectionId)
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ADMIN_SETTINGS_SECTIONS } from '../../data/settingsSections';
import { useStore, useStoreActions } from '../../hooks/useStore';
import type { CheckInMethod } from '../../types';

const CHECK_IN_OPTIONS: Array<{ value: CheckInMethod; label: string }> = [
  { value: 'gps_face', label: 'GPS + Face Recognition' },
  { value: 'qr', label: 'QR Code' },
  { value: 'kiosk', label: 'Shared Kiosk Terminal' },
];

export function AdminSettingsDetail() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { state } = useStore();
  const { updateSettings } = useStoreActions();
  const section = ADMIN_SETTINGS_SECTIONS.find((s) => s.id === sectionId);

  if (!section) return <div className="empty-state">Section not found.</div>;

  return (
    <div>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="icon-btn" onClick={() => navigate('/admin/settings')}>
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.3rem' }}>{section.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{section.description}</p>
          </div>
        </div>
      </div>

      <div className="card">
        {section.id === 'shift-settings' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Shifts</h3>
            {state.settings.shifts.map((shift) => (
              <div key={shift.id} className="side-panel-row">
                <div className="side-panel-row-main">
                  <div className="side-panel-name">{shift.name}</div>
                  <div className="side-panel-sub">
                    {shift.start} – {shift.end} · grace {shift.graceMinutes}m
                  </div>
                </div>
                <span className="status-badge status-badge--in-review">{shift.type}</span>
              </div>
            ))}
          </div>
        )}

        {section.id === 'work-location-settings' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Work Locations</h3>
            {state.settings.workLocations.map((loc) => (
              <div key={loc.id} className="side-panel-row">
                <div className="side-panel-row-main">
                  <div className="side-panel-name">{loc.name}</div>
                  <div className="side-panel-sub">{loc.address}</div>
                </div>
                <span className="side-panel-sub">radius {loc.radiusMeters}m</span>
              </div>
            ))}
          </div>
        )}

        {section.id === 'check-in-methods' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Allowed Check-In Methods</h3>
            {CHECK_IN_OPTIONS.map((opt) => (
              <label key={opt.value} className="side-panel-row" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.settings.checkInMethods.includes(opt.value)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...state.settings.checkInMethods, opt.value]
                      : state.settings.checkInMethods.filter((m) => m !== opt.value);
                    updateSettings({ checkInMethods: next });
                  }}
                />
                <span className="side-panel-name">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {!['shift-settings', 'work-location-settings', 'check-in-methods'].includes(section.id) && (
          <div className="empty-state">This section is coming soon.</div>
        )}
      </div>
    </div>
  );
}
