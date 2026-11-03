import { useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import { statusLabel } from "../utils/format.js";

const STATUS_STYLES = {
  green: "bg-green-50 text-green-700 border border-green-200",
  blue: "bg-blue-50 text-blue-700 border border-blue-200",
  amber: "bg-amber-50 text-amber-700 border border-amber-200",
  red: "bg-red-50 text-red-700 border border-red-200",
  slate: "bg-slate-100 text-slate-600 border border-slate-200",
};

const STATUS_COLOR = {
  ENROLLED: "green",
  VERIFIED: "green",
  ACCEPTED: "green",
  RELEASED: "green",
  SUBMITTED: "blue",
  UNDER_REVIEW: "blue",
  PENDING: "amber",
  WAITLISTED: "amber",
  REJECTED: "red",
  DRAFT: "slate",
};

/** Accepts an API status code (e.g. UNDER_REVIEW); `label` overrides the text. */
export function StatusBadge({ status, label }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        STATUS_STYLES[STATUS_COLOR[status] ?? "slate"]
      }`}
    >
      {label ?? statusLabel(status)}
    </span>
  );
}

export function Card({ children, className = "", ...rest }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`} {...rest}>
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

export function ErrorState({ error, onRetry }) {
  return (
    <Card className="p-6 flex items-start gap-3 border-red-200 bg-red-50">
      <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
      <div className="flex-1">
        <div className="text-sm font-medium text-red-800">Couldn't load this page</div>
        <div className="text-sm text-red-700 mt-0.5">{error?.message || "Something went wrong"}</div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-red-700 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-100"
        >
          Try again
        </button>
      )}
    </Card>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}

export function BackLink({ to, children = "Back" }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
    >
      <ChevronLeft size={15} /> {children}
    </button>
  );
}

const BUTTON_VARIANTS = {
  primary: "text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300",
  success: "text-white bg-green-600 hover:bg-green-700 disabled:bg-slate-300",
  warning: "text-white bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300",
  danger: "text-white bg-red-600 hover:bg-red-700 disabled:bg-slate-300",
  secondary: "text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 disabled:text-slate-400",
};

export function Button({ variant = "primary", className = "", busy, children, ...rest }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${className}`}
      disabled={busy || rest.disabled}
      {...rest}
    >
      {busy ? "Please wait…" : children}
    </button>
  );
}

export const inputClass =
  "mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500";

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400 mt-1">{hint}</span>}
    </label>
  );
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}

/** Wraps the standard table look; `children` are the <tr> rows. */
export function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left font-medium px-4 py-2.5 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
