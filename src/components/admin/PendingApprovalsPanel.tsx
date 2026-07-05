import { useNavigate } from 'react-router-dom';
import { SidePanelList, type SidePanelRowDef } from '../common/SidePanelList';
import { Avatar } from '../common/Avatar';
import { useStore } from '../../hooks/useStore';
import { getPendingApprovals } from '../../store/selectors';
import { useLanguage } from '../../hooks/useLanguage';

export function PendingApprovalsPanel() {
  const { t } = useLanguage();
  const { state } = useStore();
  const navigate = useNavigate();
  const approvals = getPendingApprovals(state).slice(0, 5);

  const rows: SidePanelRowDef[] = approvals.map((a) => {
    const emp = state.employees.find((e) => e.id === a.employeeId);
    return {
      key: a.id,
      leading: <Avatar src={emp?.avatarUrl} name={emp ? `${emp.firstName} ${emp.lastName}` : '?'} size={32} />,
      name: a.label,
      sub: emp ? `${emp.firstName} ${emp.lastName}` : '',
    };
  });

  return (
    <SidePanelList
      title={t('pendingApprovals')}
      count={getPendingApprovals(state).length}
      rows={rows}
      footerLabel={t('viewAllApprovals')}
      onFooterClick={() => navigate('/admin/leave')}
      emptyMessage="No pending approvals."
    />
  );
}
