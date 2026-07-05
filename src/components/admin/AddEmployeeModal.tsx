import { useState } from 'react';
import { Modal } from '../common/Modal';
import { FormField, FormSelect } from '../common/FormField';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { localDateString } from '../../utils/format';
import type { EmploymentType } from '../../types';

const DEPARTMENTS = ['Sales', 'Operations', 'Housekeeping', 'Front Office', 'Warehouse', 'Admin'];

export function AddEmployeeModal({ onClose }: { onClose: () => void }) {
  const { state } = useStore();
  const { addEmployee } = useStoreActions();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addEmployee({
      firstName,
      lastName,
      email,
      phone,
      avatarUrl: `https://i.pravatar.cc/150?u=${firstName}${lastName}${Date.now()}`,
      role: 'employee',
      department,
      employmentType,
      joinedAt: localDateString(),
      workLocationId: state.settings.workLocations[0]?.id ?? '',
      allowedCheckInMethods: ['gps_face'],
      leaveBalance: 14,
    });
    onClose();
  }

  return (
    <Modal title="Add New Employee" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="responsive-grid-1-1">
          <FormField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <FormField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FormField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <div className="responsive-grid-1-1">
          <FormSelect
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
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
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary-navy">
            Save Employee
          </button>
        </div>
      </form>
    </Modal>
  );
}
