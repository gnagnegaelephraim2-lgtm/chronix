// Screen C6 — Admin Settings detail (generic shell keyed by :sectionId)
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { ADMIN_SETTINGS_SECTIONS } from '../../data/settingsSections';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { uid } from '../../store/storeReducer';
import type { CheckInMethod, Shift } from '../../types';

const CHECK_IN_OPTIONS: Array<{ value: CheckInMethod; label: string }> = [
  { value: 'gps_face', label: 'GPS Check-In' },
  { value: 'qr', label: 'QR Code' },
  { value: 'kiosk', label: 'Shared Kiosk Terminal' },
];

const emptyShiftDraft = { name: '', start: '09:00', end: '17:00', type: 'general' as Shift['type'], graceMinutes: '10' };

export function AdminSettingsDetail() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { state } = useStore();
  const { updateSettings } = useStoreActions();
  const section = ADMIN_SETTINGS_SECTIONS.find((s) => s.id === sectionId);
  const [shiftDraft, setShiftDraft] = useState(emptyShiftDraft);

  if (!section) return <div className="empty-state">Section not found.</div>;

  function handleAddShift(e: React.FormEvent) {
    e.preventDefault();
    if (!shiftDraft.name.trim()) return;
    const newShift: Shift = {
      id: uid('shift'),
      name: shiftDraft.name.trim(),
      start: shiftDraft.start,
      end: shiftDraft.end,
      type: shiftDraft.type,
      graceMinutes: Number(shiftDraft.graceMinutes) || 0,
    };
    updateSettings({ shifts: [...state.settings.shifts, newShift] });
    setShiftDraft(emptyShiftDraft);
  }

  function handleRemoveShift(id: string) {
    updateSettings({ shifts: state.settings.shifts.filter((s) => s.id !== id) });
  }

  return (
    <div>
      <div className="page-header">
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
            {state.settings.shifts.length === 0 && (
              <p className="empty-state" style={{ marginBottom: '1rem' }}>No shifts yet — add your first one below.</p>
            )}
            {state.settings.shifts.map((shift) => (
              <div key={shift.id} className="side-panel-row">
                <div className="side-panel-row-main">
                  <div className="side-panel-name">{shift.name}</div>
                  <div className="side-panel-sub">
                    {shift.start} – {shift.end} · grace {shift.graceMinutes}m
                  </div>
                </div>
                <span className="status-badge status-badge--in-review">{shift.type}</span>
                <button type="button" className="icon-btn" aria-label="Remove shift" onClick={() => handleRemoveShift(shift.id)} style={{ marginLeft: '0.5rem' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <form onSubmit={handleAddShift} style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>Add a shift</h4>
              <div className="responsive-grid-1-1">
                <div className="form-field">
                  <label className="form-label">Shift Name</label>
                  <input className="form-input" placeholder="ex: Morning Shift" value={shiftDraft.name} onChange={(e) => setShiftDraft({ ...shiftDraft, name: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={shiftDraft.type} onChange={(e) => setShiftDraft({ ...shiftDraft, type: e.target.value as Shift['type'] })}>
                    <option value="general">General</option>
                    <option value="night">Night</option>
                    <option value="split">Split</option>
                  </select>
                </div>
              </div>
              <div className="responsive-grid-1-1">
                <div className="form-field">
                  <label className="form-label">Start Time</label>
                  <input className="form-input" type="time" value={shiftDraft.start} onChange={(e) => setShiftDraft({ ...shiftDraft, start: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">End Time</label>
                  <input className="form-input" type="time" value={shiftDraft.end} onChange={(e) => setShiftDraft({ ...shiftDraft, end: e.target.value })} />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Grace Period (minutes)</label>
                <input className="form-input" type="number" min="0" value={shiftDraft.graceMinutes} onChange={(e) => setShiftDraft({ ...shiftDraft, graceMinutes: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary-navy">Add Shift</button>
            </form>
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
