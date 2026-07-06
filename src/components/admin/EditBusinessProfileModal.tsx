import { useState } from 'react';
import { Modal } from '../common/Modal';
import { FormField } from '../common/FormField';
import { AvatarUpload } from '../common/AvatarUpload';
import { useStoreActions } from '../../hooks/useStore';
import type { BusinessSettings } from '../../types';

export function EditBusinessProfileModal({ settings, onClose }: { settings: BusinessSettings; onClose: () => void }) {
  const { updateSettings } = useStoreActions();
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [employeeCount, setEmployeeCount] = useState(String(settings.employeeCount));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateSettings({ companyName, logoUrl, employeeCount: Math.max(1, Number(employeeCount) || 1) });
    onClose();
  }

  return (
    <Modal title="Edit Business Profile" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <AvatarUpload src={logoUrl} name={companyName} size={80} onChange={setLogoUrl} />
        </div>
        <FormField label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        <FormField label="Number of Employees" type="number" min="1" value={employeeCount} onChange={(e) => setEmployeeCount(e.target.value)} required />
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
