// Building blocks shared by the guardian, school and district application pages.
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, Clock, FileText, XCircle } from "lucide-react";
import { Card, StatusBadge } from "./ui.jsx";
import { documentApi } from "../api/index.js";
import { actionLabel, formatBytes, formatDate, formatDateTime, typeLabel } from "../utils/format.js";
import { useToast } from "../context/ToastContext.jsx";

export function ApplicationHeader({ app }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Application {app.reference}</h1>
        <div className="text-sm text-slate-500">
          {app.learnerName} · {typeLabel(app.type)} · {app.schoolName} · {app.grade} {app.year}
        </div>
      </div>
      <StatusBadge status={app.status} />
    </div>
  );
}

export function RejectionBanner({ app }) {
  if (app.status !== "REJECTED" || !app.rejectionReason) return null;
  return (
    <Card className="p-4 mb-4 border-red-200 bg-red-50 flex items-start gap-3">
      <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
      <div>
        <div className="text-sm font-medium text-red-800">Application unsuccessful</div>
        <div className="text-sm text-red-700 mt-0.5">{app.rejectionReason}</div>
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
    guardian && ["Guardian", guardian.name],
    guardian?.phone && ["Phone", guardian.phone],
    guardian && ["Email", guardian.email],
  ].filter(Boolean);
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Application Details</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-slate-500">{k}</dt>
            <dd className="text-slate-800 break-words">{v}</dd>
          </div>
        ))}
      </dl>
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
  const toast = useToast();

  const open = (doc) =>
    documentApi.open(doc.id).catch((e) => toast.error("Couldn't open document", e.message));

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">{title}</h2>
      {types.length === 0 ? (
        <div className="text-sm text-slate-500">No documents required for this intake.</div>
      ) : (
        <div className="space-y-2">
          {types.map((type) => {
            const doc = byType[type];
            return (
              <div key={type} className="border border-slate-200 rounded-lg px-3 py-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={15} className="text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm text-slate-700">{type}</div>
                      {doc ? (
                        <button
                          onClick={() => open(doc)}
                          className="text-xs text-blue-600 hover:underline truncate max-w-[16rem] block text-left"
                        >
                          {doc.fileName} · {formatBytes(doc.sizeBytes)}
                        </button>
                      ) : (
                        <div className="text-xs text-slate-400">Not uploaded</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc ? <StatusBadge status={doc.status} /> : <StatusBadge status="DRAFT" label="Missing" />}
                    {renderActions?.(doc, type)}
                  </div>
                </div>
                {doc?.status === "REJECTED" && doc.rejectionReason && (
                  <div className="text-xs text-red-600 mt-1.5">Rejected: {doc.rejectionReason}</div>
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
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Status History</h2>
      {history.length === 0 ? (
        <div className="text-sm text-slate-500">No history yet.</div>
      ) : (
        <ol className="space-y-3">
          {history.map((h) => (
            <li key={h.id} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <div>
                <div className="text-sm text-slate-700">
                  {actionLabel(h.action)}
                  {h.details && <span className="text-slate-400"> — {h.details}</span>}
                </div>
                <div className="text-xs text-slate-400">
                  {h.actorName} · {formatDateTime(h.timestamp)}
                </div>
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
    { label: app.status === "WAITLISTED" ? "Waitlisted" : "Under Review", done: reached >= 1 || rejected },
    rejected
      ? { label: "Rejected", done: true, failed: true, date: formatDate(app.decidedAt) }
      : { label: "Accepted", done: reached >= 2, date: reached >= 2 ? formatDate(app.decidedAt) : "" },
    isTransfer && !rejected && { label: "Records Released", done: app.releaseStatus === "RELEASED" },
    !rejected && { label: "Enrolled", done: app.status === "ENROLLED" },
  ].filter(Boolean);
  const current = steps.findIndex((s) => !s.done);

  return (
    <Card className="p-5">
      <div className="flex">
        {steps.map((s, i) => {
          const Icon = s.failed ? XCircle : s.done ? CheckCircle2 : i === current ? Clock : Circle;
          const color = s.failed
            ? "text-red-600"
            : s.done
            ? "text-green-600"
            : i === current
            ? "text-amber-600"
            : "text-slate-300";
          return (
            <div key={s.label} className="flex-1 flex flex-col items-center text-center">
              <Icon size={20} className={color} />
              <div className="text-xs font-medium text-slate-700 mt-1.5">{s.label}</div>
              <div className="text-[11px] text-slate-400">{s.date || (i === current ? "Pending" : "")}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function TransferRoute({ from, to }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {from} <ArrowRight size={13} className="text-slate-400" /> {to}
    </span>
  );
}
