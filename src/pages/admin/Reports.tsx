// Screen C5 — Admin Reports
import { useState } from 'react';
import { ReportCard } from '../../components/admin/ReportCard';
import { PayrollTeaserBanner } from '../../components/admin/PayrollTeaserBanner';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { getReportsAggregates } from '../../store/selectors';
import { downloadCsv } from '../../utils/csvExport';
import { downloadPdf } from '../../utils/pdfExport';
import { localDateString } from '../../utils/format';
import type { ReportCardDef } from '../../types';

const REPORT_DEFS: ReportCardDef[] = [
  { id: 'overtime', title: 'Overtime Report', description: 'Overtime hours logged within the date range.', icon: 'overtime' },
  { id: 'absence', title: 'Absence Report', description: 'Absences, leaves, and attendance trends.', icon: 'absence' },
  { id: 'qr', title: 'QR Code Attendance Report', description: 'Attendance captured via QR check-ins.', icon: 'qr' },
  { id: 'department', title: 'Department Performance Report', description: 'Department-wise metrics side by side.', icon: 'department' },
];

export function Reports() {
  const { t } = useLanguage();
  const { state } = useStore();
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return localDateString(d);
  });
  const [to, setTo] = useState(() => localDateString());

  function handleExportAll() {
    const rows = state.attendance
      .filter((r) => r.date >= from && r.date <= to)
      .map((r) => {
        const emp = state.employees.find((e) => e.id === r.employeeId);
        return {
          Employee: emp ? `${emp.firstName} ${emp.lastName}` : '',
          Department: emp?.department ?? '',
          Date: r.date,
          ClockIn: r.clockIn,
          ClockOut: r.clockOut ?? '',
          Hours: r.hours ?? '',
          Status: r.status,
        };
      });
    downloadCsv(`chronix-report-${from}-to-${to}.csv`, rows);
  }

  function reportRows(id: string): Array<Record<string, string | number>> {
    const aggregates = getReportsAggregates(state, { from, to });
    if (id === 'overtime') return [{ 'Overtime Hours': aggregates.overtimeHours }];
    if (id === 'absence') return [{ 'Absence Count': aggregates.absenceCount }];
    if (id === 'qr') return [{ 'QR Check-ins': aggregates.qrCheckIns }];
    return aggregates.departmentBreakdown.map((d) => ({ Department: d.department, 'On-time %': d.onTimePct, 'Avg Hours': d.avgHours }));
  }

  const REPORT_TITLES: Record<string, string> = {
    overtime: 'Overtime Report',
    absence: 'Absence Report',
    qr: 'QR Code Attendance Report',
    department: 'Department Performance Report',
  };

  function handleGenerate(id: string) {
    downloadCsv(`${id}-report.csv`, reportRows(id));
  }

  function handleExportPdf(id: string) {
    downloadPdf(`${id}-report.pdf`, `${REPORT_TITLES[id]} (${from} to ${to})`, reportRows(id));
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{t('reportsTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('reportsSubtitle')}</p>
        </div>
        <button className="btn btn-primary-amber" onClick={handleExportAll}>
          {t('exportCsv')}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="date-range-picker">
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('fromDate')}</label>
            <input type="date" className="form-input" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('toDate')}</label>
            <input type="date" className="form-input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="features-grid" style={{ marginBottom: '1.5rem' }}>
        {REPORT_DEFS.map((def) => (
          <ReportCard key={def.id} def={def} onGenerate={() => handleGenerate(def.id)} onExportPdf={() => handleExportPdf(def.id)} />
        ))}
      </div>

      <PayrollTeaserBanner />
    </div>
  );
}
