import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Clock, Eye, GraduationCap, X } from "lucide-react";
import { BackLink, Button, Card, ErrorState, Modal, inputClass } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import {
  ApplicationHeader,
  DetailsCard,
  DocumentsCard,
  HistoryCard,
  ProgressTimeline,
  RejectionBanner,
} from "../../components/ApplicationParts.jsx";
import { applicationApi, documentApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { statusLabel } from "../../utils/format.js";

const DECISIONS = {
  ACCEPTED: { label: "Approve", variant: "success", icon: Check },
  WAITLISTED: { label: "Waitlist", variant: "warning", icon: Clock },
  REJECTED: { label: "Reject", variant: "danger", icon: X },
};

const CAN_DECIDE = { SUBMITTED: true, UNDER_REVIEW: true, WAITLISTED: true };

export default function AdminApplicationDetail() {
  const { appId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload, setData } = useApi(() => applicationApi.get(appId), [appId]);

  const [confirming, setConfirming] = useState(null); // decision code
  const [reason, setReason] = useState("");
  const [rejectingDoc, setRejectingDoc] = useState(null);
  const [docReason, setDocReason] = useState("");
  const [notesDraft, setNotesDraft] = useState(null); // null = unedited, show saved notes
  const [busy, setBusy] = useState(false);

  if (loading) return <DashboardSkeleton />;
  if (error) {
    return (
      <div>
        <BackLink to="/schoolAdmin/applications" />
        <ErrorState error={error} onRetry={reload} />
      </div>
    );
  }

  const { application: app, guardian, requiredDocuments, documents, history } = data;
  const isReceiving = app.schoolId === user.schoolId;
  const isOpen = !["REJECTED", "ENROLLED"].includes(app.status);
  const savedNotes = data.reviewNotes ?? "";
  const notes = notesDraft ?? savedNotes;

  /** Runs an action that returns the updated application detail. */
  const run = async (action, success) => {
    setBusy(true);
    try {
      setData(await action());
      if (success) toast.success(...success);
      return true;
    } catch (e) {
      toast.error("Action failed", e.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const decide = async () => {
    const ok = await run(() => applicationApi.decide(app.id, confirming, reason), [
      `Application ${statusLabel(confirming).toLowerCase()}`,
      `${app.learnerName}'s guardian has been notified.`,
    ]);
    if (ok) {
      setConfirming(null);
      setReason("");
    }
  };

  const reviewDoc = async (doc, status, why) => {
    setBusy(true);
    try {
      await documentApi.review(doc.id, status, why);
      toast.success(`Document ${status === "VERIFIED" ? "verified" : "rejected"}`, doc.type);
      setRejectingDoc(null);
      setDocReason("");
      reload();
    } catch (e) {
      toast.error("Couldn't update document", e.message);
    } finally {
      setBusy(false);
    }
  };

  const outstanding = requiredDocuments.filter(
    (t) => !documents.some((d) => d.type === t && d.status === "VERIFIED")
  );
  const waitingForRecords = app.type === "TRANSFER" && app.releaseStatus !== "RELEASED";
  const enrolBlocker = waitingForRecords
    ? `Waiting for ${app.sendingSchoolName} to release records.`
    : outstanding.length
    ? `Verify documents first: ${outstanding.join(", ")}.`
    : null;

  return (
    <div className="max-w-4xl space-y-4">
      <BackLink to="/schoolAdmin/applications" />
      <ApplicationHeader app={app} />
      <RejectionBanner app={app} />

      {!isReceiving && (
        <Card className="p-4 text-sm text-slate-600 bg-slate-50">
          You're the sending school for this transfer. Manage the record release from the{" "}
          <Link to={`/schoolAdmin/transfers/${app.transferId}`} className="text-blue-600 hover:underline">
            transfer page
          </Link>
          .
        </Card>
      )}

      <ProgressTimeline app={app} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DetailsCard app={app} guardian={guardian} />
        <DocumentsCard
          required={requiredDocuments}
          documents={documents}
          renderActions={(doc) =>
            isReceiving &&
            isOpen &&
            doc?.status === "PENDING" && (
              <span className="flex gap-2">
                <button
                  disabled={busy}
                  onClick={() => reviewDoc(doc, "VERIFIED")}
                  className="text-xs font-medium text-green-700 hover:underline"
                >
                  Verify
                </button>
                <button
                  disabled={busy}
                  onClick={() => setRejectingDoc(doc)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Reject
                </button>
              </span>
            )
          }
        />
      </div>

      {isReceiving && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Internal Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Only visible to staff at your school…"
            className={`${inputClass} h-24 resize-none`}
          />
          <div className="flex justify-end mt-2">
            <Button
              variant="secondary"
              busy={busy}
              disabled={notes === savedNotes}
              onClick={async () => {
                if (await run(() => applicationApi.saveNotes(app.id, notes), ["Notes saved"])) setNotesDraft(null);
              }}
            >
              Save notes
            </Button>
          </div>
        </Card>
      )}

      {isReceiving && isOpen && (
        <div className="flex flex-wrap items-center gap-3">
          {app.status === "SUBMITTED" && (
            <Button
              variant="secondary"
              busy={busy}
              onClick={() => run(() => applicationApi.startReview(app.id), ["Review started", "The guardian can see the application is being reviewed."])}
            >
              <Eye size={15} /> Start review
            </Button>
          )}
          {CAN_DECIDE[app.status] &&
            Object.entries(DECISIONS)
              .filter(([code]) => code !== app.status)
              .map(([code, d]) => (
                <Button key={code} variant={d.variant} onClick={() => setConfirming(code)}>
                  <d.icon size={15} /> {d.label}
                </Button>
              ))}
          {app.status === "ACCEPTED" && (
            <>
              <Button
                variant="success"
                busy={busy}
                disabled={Boolean(enrolBlocker)}
                onClick={() => run(() => applicationApi.enrol(app.id), ["Learner enrolled", `${app.learnerName} is now enrolled.`])}
              >
                <GraduationCap size={15} /> Confirm enrolment
              </Button>
              {enrolBlocker && <span className="text-xs text-slate-500">{enrolBlocker}</span>}
            </>
          )}
        </div>
      )}

      <HistoryCard history={history} />

      {confirming && (
        <Modal title="Confirm decision" onClose={() => setConfirming(null)}>
          <p className="text-sm text-slate-500 mb-4">
            Mark this application as <strong>{statusLabel(confirming)}</strong>? The guardian will be notified.
          </p>
          {confirming === "REJECTED" && (
            <textarea
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (required, shown to the guardian)"
              className={`${inputClass} h-20 resize-none mb-4`}
            />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirming(null)}>
              Cancel
            </Button>
            <Button
              variant={DECISIONS[confirming].variant}
              busy={busy}
              disabled={confirming === "REJECTED" && !reason.trim()}
              onClick={decide}
            >
              {DECISIONS[confirming].label}
            </Button>
          </div>
        </Modal>
      )}

      {rejectingDoc && (
        <Modal title={`Reject ${rejectingDoc.type}`} onClose={() => setRejectingDoc(null)}>
          <p className="text-sm text-slate-500 mb-3">The guardian will be asked to upload a new copy.</p>
          <textarea
            autoFocus
            value={docReason}
            onChange={(e) => setDocReason(e.target.value)}
            placeholder="What's wrong with this document?"
            className={`${inputClass} h-20 resize-none mb-4`}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRejectingDoc(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              busy={busy}
              disabled={!docReason.trim()}
              onClick={() => reviewDoc(rejectingDoc, "REJECTED", docReason)}
            >
              Reject document
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
