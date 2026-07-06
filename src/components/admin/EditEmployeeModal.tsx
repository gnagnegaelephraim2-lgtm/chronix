import { useState } from 'react';
import { Modal } from '../common/Modal';
import { FormField, FormSelect } from '../common/FormField';
import { useStore, useStoreActions } from '../../hooks/useStore';
import type { CheckInMethod, Employee, EmploymentType } from '../../types';

const METHOD_LABELS: Record<CheckInMethod, string> = {
  gps_face: 'GPS Check-In',
  qr: 'QR Code',
  kiosk: 'Shared Kiosk Terminal',
};

export function EditEmployeeModal({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const { state } = useStore();
  const { updateEmployee, updateSettings } = useStoreActions();
  const [department, setDepartment] = useState(employee.department);
  const [employmentType, setEmploymentType] = useState<EmploymentType>(employee.employmentType);
  const [shiftId, setShiftId] = useState(employee.shiftId ?? '');
  const [hourlyRate, setHourlyRate] = useState(String(employee.hourlyRateMUR ?? 0));
  const [allowedMethods, setAllowedMethods] = useState<CheckInMethod[]>(employee.allowedCheckInMethods);

  const departments = state.settings.departments;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedDept = department.trim();
    updateEmployee({
      ...employee,
      department: trimmedDept,
      employmentType,
      shiftId: shiftId || null,
      hourlyRateMUR: Number(hourlyRate) || 0,
      allowedCheckInMethods: allowedMethods.length ? allowedMethods : ['gps_face'],
    });
    if (trimmedDept && !departments.includes(trimmedDept)) {
      updateSettings({ departments: [...departments, trimmedDept] });
    }
    onClose();
  }

  return (
    <Modal title={`Edit ${employee.firstName} ${employee.lastName}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="responsive-grid-1-1">
          <FormField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            list="edit-department-options"
            required
          />
          <FormSelect
            label="Employment Type"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            options={[
              { value: 'full_time', label: 'Full Time' },
              { value: 'part_time', label: 'Part Time' },
              { value: 'temporary', label: 'Temporary' },
            ]}
          />
        </div>
        <datalist id="edit-department-options">
          {departments.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>

        <div className="responsive-grid-1-1">
          <FormSelect
            label="Shift"
            value={shiftId}
            onChange={(e) => setShiftId(e.target.value)}
            options={[
              { value: '', label: state.settings.shifts.length ? 'No shift assigned' : 'No shifts configured yet' },
              ...state.settings.shifts.map((s) => ({ value: s.id, label: `${s.name} (${s.start}–${s.end})` })),
            ]}
          />
          <FormField
            label="Hourly Rate (MUR)"
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Allowed Check-In Methods</label>
          {state.settings.checkInMethods.map((method) => (
            <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={allowedMethods.includes(method)}
                onChange={(e) =>
                  setAllowedMethods(e.target.checked ? [...allowedMethods, method] : allowedMethods.filter((m) => m !== method))
                }
              />
              <span style={{ fontSize: '0.88rem' }}>{METHOD_LABELS[method]}</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary-navy">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
