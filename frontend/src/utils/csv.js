import { formatDate, statusLabel, typeLabel } from "./format.js";

export function downloadCSV(filename, rows, headers) {
  const escape = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportApplications(prefix, applications) {
  const headers = ["ID", "Learner", "Guardian", "Type", "School", "Grade", "Year", "Status", "Submitted"];
  const rows = applications.map((a) => [
    a.reference,
    a.learnerName,
    a.guardianName,
    typeLabel(a.type),
    a.schoolName,
    a.grade,
    a.year,
    statusLabel(a.status),
    formatDate(a.submittedAt),
  ]);
  const date = new Date().toISOString().slice(0, 10);
  downloadCSV(`${prefix}-${date}.csv`, rows, headers);
}
