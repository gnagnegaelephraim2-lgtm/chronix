import { jsPDF } from 'jspdf';

// Simple text-table PDF export — no autotable plugin, just enough to give
// admins a real downloadable PDF per report instead of only CSV.
export function downloadPdf(filename: string, title: string, rows: Array<Record<string, string | number>>) {
  const doc = new jsPDF();
  const marginX = 14;
  let y = 20;

  doc.setFontSize(16);
  doc.text(title, marginX, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleString()}`, marginX, y);
  doc.setTextColor(0);
  y += 10;

  if (rows.length === 0) {
    doc.setFontSize(11);
    doc.text('No data in the selected range.', marginX, y);
    doc.save(filename);
    return;
  }

  const headers = Object.keys(rows[0]);
  const colWidth = Math.min(45, (210 - marginX * 2) / headers.length);
  const rowHeight = 8;
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  headers.forEach((h, i) => doc.text(String(h), marginX + i * colWidth, y));
  doc.setFont('helvetica', 'normal');
  y += rowHeight;
  doc.line(marginX, y - 5, marginX + colWidth * headers.length, y - 5);

  rows.forEach((row) => {
    if (y > pageHeight - 15) {
      doc.addPage();
      y = 20;
    }
    headers.forEach((h, i) => {
      const val = String(row[h] ?? '');
      doc.text(val.length > 22 ? `${val.slice(0, 19)}...` : val, marginX + i * colWidth, y);
    });
    y += rowHeight;
  });

  doc.save(filename);
}
