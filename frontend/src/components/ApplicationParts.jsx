// Building blocks shared by the guardian, school and district application pages.
import { AlertTriangle, ArrowRight, Check, FileText, X } from "lucide-react";
import { Avatar, Card, CardTitle, StatusBadge } from "./ui.jsx";
import { documentApi } from "../api/index.js";
import { actionLabel, formatBytes, formatDate, formatDateTime, typeLabel } from "../utils/format.js";
import { useToast } from "../context/ToastContext.jsx";

export function ApplicationHeader({ app }) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-2 animate-fade-up">
      <Avatar name={app.learnerName} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-sun-600 mb-0.5">
          {typeLabel(app.type)} · {app.reference}
        </div>
        <h1 className="font-display text-2xl sm:text-[28px] font-semibold text-stone-900 leading-tight">
          {app.learnerName}
        </h1>
        <div className="text-sm text-stone-500">
          {app.schoolName} · {app.grade} {app.year}
        </div>
      </div>
      <StatusBadge status={app.status} />
    </div>
  );
}

export function RejectionBanner({ app }) {
  if (app.status !== "REJECTED" || !app.rejectionReason) return null;
  return (
    <Card className="p-4 border-rose-200 bg-rose-50/70 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
        <AlertTriangle size={17} />
      </div>
      <div>
        <div className="text-sm font-semibold text-rose-800">Application unsuccessful</div>
        <div className="text-sm text-rose-700 mt-0.5">{app.rejectionReason}</div>
      </div>
    </Card>
  );
}

export function DetailsCard({ app, guardian }) {
  const rows = [
    ["Type", typeLabel(app.type)],
    ["School", app.schoolName],
    ["Grade / Year", `${app.grade} · ${app.year}`],
    app.sendingSchoolName && ["Transferring from", app.sendingSchoolName],
    ["Submitted", formatDateTime(app.submittedAt)],
    app.decidedAt && ["Decided", formatDateTime(app.decidedAt)],
  ].filter(Boolean);
  return (
    <Card className="p-6">
      <CardTitle>Application details</CardTitle>
      <dl className="divide-y divide-stone-100 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-6 py-2.5 first:pt-0">
            <dt className="text-stone-500">{k}</dt>
            <dd className="text-stone-900 font-medium text-right break-words">{v}</dd>
          </div>
        ))}
      </dl>
      {guardian && (
        <div className="mt-4 p-3.5 rounded-xl bg-stone-50 flex items-center gap-3">
          <Avatar name={guardian.name} size="sm" />
          <div className="min-w-0 text-sm">
            <div className="font-semibold text-stone-900">{guardian.name}</div>
            <div className="text-stone-500 truncate">
              {[guardian.phone, guardian.email].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * Lists each required document with its upload status. `renderActions(doc, type)` lets
 * a page add role-specific controls (upload for guardians, verify/reject for schools).
 */
export function DocumentsCard({ required, documents, renderActions, title = "Documents" }) {
  const byType = Object.fromEntries(documents.map((d) => [d.type, d]));
  const types = [...required, ...documents.map((d) => d.type).filter((t) => !required.includes(t))];
  const verified = types.filter((t) => byType[t]?.status === "VERIFIED").length;
  const toast = useToast();

  const open = (doc) =>
    documentApi.open(doc.id).catch((e) => toast.error("Couldn't open document", e.message));

  return (
    <Card className="p-6">
      <CardTitle
        action={
          types.length > 0 && (
            <span className="text-xs font-semibold text-stone-500">
              {verified}/{types.length} verified
            </span>
          )
        }
      >
        {title}
      </CardTitle>
      {types.length > 0 && (
        <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden -mt-1 mb-4">
          <div className="h-full bg-sunrise transition-all duration-700" style={{ width: `${(verified / types.length) * 100}%` }} />
        </div>
      )}
      {types.length === 0 ? (
        <div className="text-sm text-stone-500">No documents required for this intake.</div>
      ) : (
        <div className="space-y-2">
          {types.map((type) => {
            const doc = byType[type];
            return (
              <div key={type} className="rounded-xl ring-1 ring-stone-200 px-3.5 py-3 hover:ring-stone-300 transition">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        doc ? "bg-brand-50 text-brand-600" : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-stone-900">{type}</div>
                      {doc ? (
                        <button
                          onClick={() => open(doc)}
                          className="text-xs text-brand-700 hover:underline truncate max-w-[14rem] block text-left"
                        >
                          {doc.fileName} · {formatBytes(doc.sizeBytes)}
                        </button>
                      ) : (
                        <div className="text-xs text-stone-400">Not uploaded yet</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {doc ? <StatusBadge status={doc.status} /> : <StatusBadge status="DRAFT" label="Missing" />}
                    {renderActions?.(doc, type)}
                  </div>
                </div>
                {doc?.status === "REJECTED" && doc.rejectionReason && (
                  <div className="text-xs text-rose-700 bg-rose-50 rounded-lg px-2.5 py-1.5 mt-2.5">
                    Rejected: {doc.rejectionReason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export function HistoryCard({ history }) {
  return (
    <Card className="p-6">
      <CardTitle>Activity</CardTitle>
      {history.length === 0 ? (
        <div className="text-sm text-stone-500">No activity yet.</div>
      ) : (
        <ol className="relative ml-1.5">
          {history.map((h, i) => (
            <li key={h.id} className="relative pl-6 pb-5 last:pb-0">
              {i < history.length - 1 && <span className="absolute left-[3px] top-3 bottom-0 w-px bg-stone-200" />}
              <span
                className={`absolute left-0 top-1.5 w-[7px] h-[7px] rounded-full ring-4 ${
                  i === history.length - 1 ? "bg-sun-500 ring-sun-100" : "bg-brand-500 ring-brand-50"
                }`}
              />
              <div className="text-sm text-stone-900 font-medium">
                {actionLabel(h.action)}
                {h.details && <span className="font-normal text-stone-500"> — {h.details}</span>}
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {h.actorName} · {formatDateTime(h.timestamp)}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

/** Progress of an application through its lifecycle; transfers include the record-release step. */
export function ProgressTimeline({ app }) {
  const isTransfer = app.type === "TRANSFER";
  const rejected = app.status === "REJECTED";
  const order = ["SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "ENROLLED"];
  const reached = Math.max(order.indexOf(app.status === "WAITLISTED" ? "UNDER_REVIEW" : app.status), 0);

  const steps = [
    { label: "Submitted", done: true, date: formatDate(app.submittedAt) },
    { label: app.status === "WAITLISTED" ? "Waitlisted" : "In review", done: reached >= 1 || rejected },
    rejected
      ? { label: "Rejected", done: true, failed: true, date: formatDate(app.decidedAt) }
      : { label: "Accepted", done: reached >= 2, date: reached >= 2 ? formatDate(app.decidedAt) : "" },
    isTransfer && !rejected && { label: "Records released", done: app.releaseStatus === "RELEASED" },
    !rejected && { label: "Enrolled", done: app.status === "ENROLLED" },
  ].filter(Boolean);
  const current = steps.findIndex((s) => !s.done);
  // The track runs between the centres of the first and last step circles.
  const inset = 50 / steps.length;
  const span = 100 - 2 * inset;
  const filled = current === -1 ? 1 : Math.max(0, current - 0.5) / (steps.length - 1);

  return (
    <Card className="px-4 sm:px-8 py-6">
      <div className="relative">
        <div className="absolute top-4 h-1 rounded-full bg-stone-100" style={{ left: `${inset}%`, width: `${span}%` }} />
        <div
          className={`absolute top-4 h-1 rounded-full transition-all duration-700 ${rejected ? "bg-rose-400" : "bg-sunrise"}`}
          style={{ left: `${inset}%`, width: `${span * filled}%` }}
        />
        <div className="relative flex">
          {steps.map((s, i) => {
            const isCurrent = i === current;
            return (
              <div key={s.label} className="flex-1 flex flex-col items-center text-center px-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white transition ${
                    s.failed
                      ? "bg-rose-500 text-white"
                      : s.done
                      ? "bg-brand-600 text-white"
                      : isCurrent
                      ? "bg-white text-sun-600 ring-sun-100 border-2 border-sun-400"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {s.failed ? <X size={16} /> : s.done ? <Check size={16} /> : i + 1}
                </div>
                <div className={`text-xs font-semibold mt-2 ${s.done || isCurrent ? "text-stone-800" : "text-stone-400"}`}>
                  {s.label}
                </div>
                <div className="text-[11px] text-stone-400 h-4">
                  {s.date || (isCurrent ? "In progress" : "")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export function TransferRoute({ from, to }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {from} <ArrowRight size={13} className="text-sun-500" /> {to}
    </span>
  );
}
