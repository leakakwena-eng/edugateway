export function statusClasses(status) {
  switch (status) {
    case "Enrolled":
    case "Verified":
    case "Completed":
    case "Accepted":
    case "Approved":
    case "Released":
      return "bg-green-50 text-green-700 border border-green-200";
    case "Under Review":
    case "Submitted":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Pending":
    case "Waitlisted":
    case "Pending Review":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Draft":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    case "Rejected":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
}

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, body }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-400" />
      </div>
      <div className="text-slate-800 font-semibold mb-1">{title}</div>
      <div className="text-sm text-slate-500 max-w-xs">{body}</div>
    </div>
  );
}

export const initials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");