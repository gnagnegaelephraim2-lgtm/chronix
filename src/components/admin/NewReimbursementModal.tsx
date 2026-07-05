import { useState } from 'react';
import { Modal } from '../common/Modal';
import { FormField, FormSelect, FormTextarea } from '../common/FormField';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { localDateString } from '../../utils/format';
import type { ExpenseType } from '../../types';

export function NewReimbursementModal({ onClose }: { onClose: () => void }) {
  const { state } = useStore();
  const { submitReimbursement } = useStoreActions();
  const [employeeId, setEmployeeId] = useState(state.employees[0]?.id ?? '');
  const [expenseType, setExpenseType] = useState<ExpenseType>('transport');
  const [description, setDescription] = useState('');
  const [amountMUR, setAmountMUR] = useState(0);
  const [date, setDate] = useState(localDateString());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitReimbursement({ employeeId, expenseType, description, date, amountMUR, receiptUrl: null });
    onClose();
  }

  return (
    <Modal title="New Reimbursement" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormSelect
          label="Employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          options={state.employees.map((emp) => ({ value: emp.id, label: `${emp.firstName} ${emp.lastName}` }))}
        />
        <FormSelect
          label="Expense Type"
          value={expenseType}
          onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
          options={[
            { value: 'transport', label: 'Transport' },
            { value: 'meals', label: 'Meals' },
            { value: 'supplies', label: 'Supplies' },
            { value: 'accommodation', label: 'Accommodation' },
          ]}
        />
        <FormTextarea label="Description" maxLength={250} value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="responsive-grid-1-1">
          <FormField label="Amount (MUR)" type="number" min={0} value={amountMUR} onChange={(e) => setAmountMUR(Number(e.target.value))} />
          <FormField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary-navy">
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
}
