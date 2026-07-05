import { useState } from 'react';
import { Modal } from '../common/Modal';
import { FormField, FormSelect, FormTextarea } from '../common/FormField';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { localDateString } from '../../utils/format';
import type { LeaveType } from '../../types';

export function NewLeaveRequestModal({ onClose }: { onClose: () => void }) {
  const { state } = useStore();
  const { submitRequest } = useStoreActions();
  const [employeeId, setEmployeeId] = useState(state.employees[0]?.id ?? '');
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [dateFrom, setDateFrom] = useState(localDateString());
  const [dateTo, setDateTo] = useState(localDateString());
  const [reason, setReason] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const days = Math.max(1, Math.round((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000) + 1);
    submitRequest({ employeeId, type: 'leave', leaveType, dateFrom, dateTo, days, reason, attachmentUrl: null });
    onClose();
  }

  return (
    <Modal title="New Leave Request" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormSelect
          label="Employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          options={state.employees.map((emp) => ({ value: emp.id, label: `${emp.firstName} ${emp.lastName}` }))}
        />
        <FormSelect
          label="Leave Type"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as LeaveType)}
          options={[
            { value: 'annual', label: 'Annual' },
            { value: 'sick', label: 'Sick' },
            { value: 'personal', label: 'Personal' },
          ]}
        />
        <div className="responsive-grid-1-1">
          <FormField label="From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <FormField label="To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <FormTextarea label="Reason" maxLength={250} value={reason} onChange={(e) => setReason(e.target.value)} />
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary-navy">
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
}
