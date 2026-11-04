import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { initials, statusLabel } from "../utils/format.js";

const STATUS_TONES = {
  good: "bg-brand-50 text-brand-700 ring-brand-200 [--dot:var(--color-brand-500)]",
  info: "bg-sky-50 text-sky-700 ring-sky-200 [--dot:var(--color-sky-500)]",
  warn: "bg-sun-50 text-sun-700 ring-sun-200 [--dot:var(--color-sun-500)]",
  bad: "bg-rose-50 text-rose-700 ring-rose-200 [--dot:var(--color-rose-500)]",
  muted: "bg-stone-100 text-stone-600 ring-stone-200 [--dot:var(--color-stone-400)]",
};

const STATUS_TONE = {
  ENROLLED: "good",
  VERIFIED: "good",
  ACCEPTED: "good",
  RELEASED: "good",
  SUBMITTED: "info",
  UNDER_REVIEW: "info",
  PENDING: "warn",
  WAITLISTED: "warn",
  REJECTED: "bad",
  DRAFT: "muted",
};

/** Accepts an API status code (e.g. UNDER_REVIEW); `label` overrides the text. */
export function StatusBadge({ status, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset whitespace-nowrap ${
        STATUS_TONES[STATUS_TONE[status] ?? "muted"]
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-(--dot)" />
      {label ?? statusLabel(status)}
    </span>
  );
}

export function Card({ children, className = "", ...rest }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-200/80 shadow-soft ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** Section title inside a card. */
export function CardTitle({ children, action, className = "" }) {
  return (
    <div className={`flex items-center justify-between gap-3 mb-4 ${className}`}>
      <h2 className="text-sm font-semibold text-stone-900">{children}</h2>
      {action}
    </div>
  );
}

const AVATAR_TONES = [
  "from-brand-400 to-brand-700",
  "from-sun-300 to-sun-600",
  "from-coral-400 to-rose-600",
  "from-sky-400 to-sky-700",
  "from-violet-400 to-violet-700",
  "from-lime-400 to-emerald-700",
];

/** Initials on a gradient chosen from the name, so each person keeps the same colour. */
export function Avatar({ name = "", size = "md", className = "" }) {
  // FNV-1a: spreads similar names (e.g. siblings sharing a surname) across colours.
  const hash = [...name].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-11 h-11 text-sm", lg: "w-14 h-14 text-lg" };
  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br ${AVATAR_TONES[hash % AVATAR_TONES.length]} text-white font-semibold flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white ${className}`}
    >
      {initials(name)}
    </div>
  );
}

const STAT_TONES = {
  brand: "bg-brand-50 text-brand-700",
  sun: "bg-sun-50 text-sun-600",
  sky: "bg-sky-50 text-sky-700",
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-700",
};

/** Headline number with an icon; pass `onClick` to make it a link. */
export function StatCard({ label, value, icon: Icon, tone = "brand", hint, onClick, index = 0 }) {
  return (
    <Card
      onClick={onClick}
      style={{ "--i": index }}
      className={`p-3.5 sm:p-5 animate-fade-up stagger ${
        onClick ? "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lift" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs sm:text-[13px] font-medium text-stone-500 leading-snug">{label}</div>
        {Icon && (
          <div className={`hidden sm:flex w-9 h-9 rounded-xl items-center justify-center shrink-0 ${STAT_TONES[tone]}`}>
            <Icon size={17} />
          </div>
        )}
      </div>
      <div className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 mt-1 sm:mt-2">{value}</div>
      {hint && <div className="hidden sm:block text-xs text-stone-400 mt-1">{hint}</div>}
    </Card>
  );
}

/** Pass `art` (an illustration component) for a drawn scene, or `icon` for a simple glyph. */
export function EmptyState({ art: Art, icon: Icon, title, body, children }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Art ? (
        <Art className="w-44 h-32 mb-4" />
      ) : (
        Icon && (
          <div className="w-14 h-14 rounded-2xl bg-sun-50 text-sun-600 flex items-center justify-center mb-4">
            <Icon size={24} />
          </div>
        )
      )}
      <div className="font-display text-lg font-semibold text-stone-900 mb-1">{title}</div>
      <div className="text-sm text-stone-500 max-w-xs">{body}</div>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <Card className="p-6 flex items-start gap-3 border-rose-200 bg-rose-50/60">
      <AlertTriangle size={18} className="text-rose-600 mt-0.5 shrink-0" />
      <div className="flex-1">
        <div className="text-sm font-semibold text-rose-800">Couldn't load this page</div>
        <div className="text-sm text-rose-700 mt-0.5">{error?.message || "Something went wrong"}</div>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Card>
  );
}

export function PageHeader({ title, subtitle, eyebrow, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6 animate-fade-up">
      <div>
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-sun-600 mb-1.5">{eyebrow}</div>
        )}
        <h1 className="font-display text-2xl sm:text-[28px] font-semibold text-stone-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
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
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-brand-700 mb-4"
    >
      <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" /> {children}
    </button>
  );
}

const BUTTON_VARIANTS = {
  primary:
    "text-white bg-brand-700 hover:bg-brand-800 shadow-sm shadow-brand-900/20 disabled:bg-stone-300 disabled:shadow-none",
  accent: "text-white bg-sunrise hover:brightness-105 shadow-sm shadow-sun-700/30 disabled:opacity-50",
  success: "text-white bg-brand-600 hover:bg-brand-700 shadow-sm disabled:bg-stone-300",
  warning: "text-white bg-sun-500 hover:bg-sun-600 shadow-sm disabled:bg-stone-300",
  danger: "text-white bg-rose-600 hover:bg-rose-700 shadow-sm disabled:bg-stone-300",
  secondary:
    "text-stone-700 bg-white ring-1 ring-inset ring-stone-300 hover:bg-stone-50 hover:ring-stone-400 disabled:text-stone-400",
  ghost: "text-stone-600 hover:bg-stone-100",
};

export function Button({ variant = "primary", className = "", busy, children, ...rest }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl transition active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${BUTTON_VARIANTS[variant]} ${className}`}
      disabled={busy || rest.disabled}
      {...rest}
    >
      {busy ? (
        <>
          <span className="w-4 h-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
          Please wait…
        </>
      ) : (
        children
      )}
    </button>
  );
}

export const inputClass =
  "mt-1.5 w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 disabled:bg-stone-50 disabled:text-stone-500";

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-stone-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-stone-400 mt-1.5">{hint}</span>}
    </label>
  );
}

export function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-lift p-6 w-full max-w-sm animate-pop"
      >
        <h3 className="font-display text-lg font-semibold text-stone-900 mb-2">{title}</h3>
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
        <thead>
          <tr className="bg-stone-50/80 border-b border-stone-200/80">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left text-[11px] font-semibold uppercase tracking-wider text-stone-500 px-4 py-3 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr]:transition-colors">{children}</tbody>
      </table>
    </div>
  );
}
