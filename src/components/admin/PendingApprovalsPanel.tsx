import { useNavigate } from 'react-router-dom';
import { SidePanelList, type SidePanelRowDef } from '../common/SidePanelList';
import { Avatar } from '../common/Avatar';
import { ApproveRejectActions } from '../common/ApproveRejectActions';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useSession } from '../../hooks/useSession';
import { getPendingApprovals } from '../../store/selectors';
import { useLanguage } from '../../hooks/useLanguage';

export function PendingApprovalsPanel() {
  const { t } = useLanguage();
  const { state } = useStore();
  const { decideRequest, decideReimbursement } = useStoreActions();
  const { session } = useSession();
  const navigate = useNavigate();
  const approvals = getPendingApprovals(state).slice(0, 5);

  function handleDecide(id: string, kind: string, decision: 'approved' | 'rejected') {
    if (kind === 'reimbursement') {
      decideReimbursement(id, decision);
    } else {
      decideRequest(id, decision, session?.employeeId ?? '');
    }
  }

  const rows: SidePanelRowDef[] = approvals.map((a) => {
    const emp = state.employees.find((e) => e.id === a.employeeId);
    return {
      key: a.id,
      leading: <Avatar src={emp?.avatarUrl} name={emp ? `${emp.firstName} ${emp.lastName}` : '?'} size={32} />,
      name: a.label,
      sub: emp ? `${emp.firstName} ${emp.lastName}` : '',
      trailing: (
        <ApproveRejectActions
          onApprove={() => handleDecide(a.id, a.kind, 'approved')}
          onReject={() => handleDecide(a.id, a.kind, 'rejected')}
        />
      ),
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
