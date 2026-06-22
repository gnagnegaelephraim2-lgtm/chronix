import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import type { Worker, ClockLog } from '../types';
import type { TFunction } from '../data/translations';

// Helper to format ISO date strings to readable local strings
const formatDate = (isoStr?: string) => {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface ReportDataRow {
  name: string;
  surname: string;
  passportOrNcid: string;
  clockIn: string;
  clockOut: string;
  hoursWorked: number;
  hourlySalary: number;
  totalPay: number;
}

export function prepareReportData(
  workers: Worker[],
  logs: ClockLog[]
): { rows: ReportDataRow[]; grandTotal: number } {
  let grandTotal = 0;
  const rows: ReportDataRow[] = [];

  // Group logs by worker
  workers.forEach(w => {
    const workerLogs = logs.filter(log => log.workerId === w.id && log.clockOut);
    
    if (workerLogs.length === 0) {
      // Even if no logs, include them with 0 hours
      rows.push({
        name: w.name,
        surname: w.surname,
        passportOrNcid: w.passportOrNcid,
        clockIn: '-',
        clockOut: '-',
        hoursWorked: 0,
        hourlySalary: w.hourlySalary,
        totalPay: 0,
      });
    } else {
      workerLogs.forEach(log => {
        const hours = log.totalHours || 0;
        const totalPay = hours * w.hourlySalary;
        grandTotal += totalPay;
        rows.push({
          name: w.name,
          surname: w.surname,
          passportOrNcid: w.passportOrNcid,
          clockIn: formatDate(log.clockIn),
          clockOut: formatDate(log.clockOut),
          hoursWorked: parseFloat(hours.toFixed(2)),
          hourlySalary: w.hourlySalary,
          totalPay: parseFloat(totalPay.toFixed(2)),
        });
      });
    }
  });

  return { rows, grandTotal };
}

export function exportPayrollToPdf(
  workers: Worker[],
  logs: ClockLog[],
  companyName: string,
  companyLogoUrl: string,
  t: TFunction
) {
  const { rows, grandTotal } = prepareReportData(workers, logs);
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString();

  // Draw Header background banner
  doc.setFillColor(19, 27, 46); // var(--bg-secondary) #131b2e
  doc.rect(0, 0, 210, 40, 'F');

  // Vector Logo Design (Draw a beautiful abstract clock logo in PDF)
  // Outer circle
  doc.setFillColor(99, 102, 241); // #6366f1
  doc.ellipse(25, 20, 8, 8, 'F');
  // Inner core
  doc.setFillColor(16, 185, 129); // #10b981
  doc.ellipse(25, 20, 4, 4, 'F');
  // Clock hands
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  doc.line(25, 20, 25, 16);
  doc.line(25, 20, 28, 20);

  // App Name Brand
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CHRONIX', 38, 22);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('WORKFORCE INTELLIGENCE', 38, 28);

  // User Branding Logo
  if (companyLogoUrl && companyLogoUrl.startsWith('data:image')) {
    try {
      doc.addImage(companyLogoUrl, 'PNG', 165, 8, 24, 24);
    } catch (e) {
      console.warn('Failed to render company logo in PDF:', e);
    }
  } else {
    // Default placeholder logo shape for company
    doc.setFillColor(16, 185, 129);
    doc.rect(170, 10, 20, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('CO', 176, 23);
  }

  // Report title & Metadata
  doc.setTextColor(19, 27, 46);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(t('detailedPayroll'), 14, 52);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`${t('companyName')}: ${companyName || 'Chronix Client'}`, 14, 60);
  doc.text(`${t('reportDate')}: ${dateStr}`, 14, 65);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 70, 196, 70);

  // Table Headers
  const headers = [
    { name: 'Name/Surname', x: 14 },
    { name: 'ID/Passport', x: 60 },
    { name: 'Clock In', x: 92 },
    { name: 'Clock Out', x: 124 },
    { name: 'Hours', x: 154 },
    { name: 'Rate (MUR)', x: 168 },
    { name: 'Total (MUR)', x: 186 }
  ];

  doc.setFillColor(241, 245, 249);
  doc.rect(14, 74, 182, 8, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  headers.forEach(h => {
    doc.text(h.name, h.x, 80);
  });

  // Table Body Rows
  let y = 88;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  rows.forEach((row, idx) => {
    // Page overflow handler
    if (y > 275) {
      doc.addPage();
      y = 20;
      // Re-draw headers on new page
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y - 6, 182, 8, 'F');
      doc.setFont('Helvetica', 'bold');
      headers.forEach(h => {
        doc.text(h.name, h.x, y - 1);
      });
      doc.setFont('Helvetica', 'normal');
      y += 8;
    }

    // Zebra striping
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 4, 182, 6, 'F');
    }

    const fullName = `${row.name} ${row.surname}`;
    const truncatedName = fullName.length > 22 ? fullName.substring(0, 20) + '..' : fullName;

    doc.text(truncatedName, 14, y);
    doc.text(row.passportOrNcid, 60, y);
    doc.text(row.clockIn, 92, y);
    doc.text(row.clockOut, 124, y);
    doc.text(row.hoursWorked.toString(), 154, y);
    doc.text(row.hourlySalary.toString(), 168, y);
    doc.text(row.totalPay.toString(), 186, y);

    y += 6;
  });

  // Grand Total section
  y += 6;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 10, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 27, 46);
  doc.text(`${t('grandTotal')}:`, 18, y + 6.5);
  doc.text(`MUR ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 150, y + 6.5);

  // Footer note
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated dynamically by Chronix Pro Workforce System.', 14, 290);

  doc.save(`Chronix-Payroll-${dateStr.replace(/\//g, '-')}.pdf`);
}

export function exportPayrollToExcel(
  workers: Worker[],
  logs: ClockLog[],
  companyName: string
) {
  const { rows, grandTotal } = prepareReportData(workers, logs);
  const dateStr = new Date().toLocaleDateString();

  // Create customized worksheet matrix
  const tableData = [
    ['CHRONIX PRO - PAYROLL REPORT'],
    [`Company Name: ${companyName || 'Chronix Client'}`],
    [`Report Date: ${dateStr}`],
    [], // Blank row
    [
      'First Name',
      'Last Name',
      'Passport / NCID',
      'Clock In Time',
      'Clock Out Time',
      'Total Hours Worked',
      'Hourly Rate (MUR)',
      'Total Pay (MUR)'
    ],
  ];

  rows.forEach(r => {
    tableData.push([
      r.name,
      r.surname,
      r.passportOrNcid,
      r.clockIn,
      r.clockOut,
      r.hoursWorked.toString(),
      r.hourlySalary.toString(),
      r.totalPay.toString()
    ]);
  });

  tableData.push([]); // Space
  tableData.push(['Grand Total Payout:', '', '', '', '', '', '', grandTotal.toString()]);

  // Generate Sheet
  const ws = XLSX.utils.aoa_to_sheet(tableData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Payroll Summary');

  // Trigger file download
  XLSX.writeFile(wb, `Chronix-Payroll-${dateStr.replace(/\//g, '-')}.xlsx`);
}
