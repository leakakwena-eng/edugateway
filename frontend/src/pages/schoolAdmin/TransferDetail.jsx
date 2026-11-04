import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Upload } from "lucide-react";
import { Avatar, BackLink, Button, Card, ErrorState, Modal, StatusBadge } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import { DocumentsCard, HistoryCard, ProgressTimeline, TransferRoute } from "../../components/ApplicationParts.jsx";
import { applicationApi, transferApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDateTime } from "../../utils/format.js";

export default function AdminTransferDetail() {
  const { transferId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const { data, loading, error, reload } = useApi(async () => {
    const transfer = await transferApi.get(transferId);
    return { transfer, detail: await applicationApi.get(transfer.applicationId) };
  }, [transferId]);

  if (loading) return <DashboardSkeleton />;
  if (error) {
    return (
      <div>
        <BackLink to="/schoolAdmin/transfers">Back to Transfers</BackLink>
        <ErrorState error={error} onRetry={reload} />
      </div>
    );
  }

  const { transfer: t, detail } = data;
  const app = detail.application;
  const isSending = t.sendingSchoolId === user.schoolId;
  const released = t.releaseStatus === "RELEASED";
  const canRelease = isSending && !released && t.applicationStatus === "ACCEPTED";

  const release = async () => {
    setBusy(true);
    try {
      await transferApi.release(t.id);
      toast.success("Records released", `${t.receivingSchoolName} can now enrol ${t.learnerName}.`);
      setConfirming(false);
      reload();
    } catch (e) {
      toast.error("Couldn't release records", e.message);
    } finally {
      setBusy(false);
    }
  };

  const statusText = isSending
    ? released
      ? `Records were released on ${formatDateTime(t.releasedAt)}.`
      : t.applicationStatus === "ACCEPTED"
      ? `${t.receivingSchoolName} has accepted this transfer. Release ${t.learnerName}'s academic records so they can be enrolled.`
      : `Records can be released once ${t.receivingSchoolName} accepts the transfer.`
    : released
    ? "Academic records have been received. You can confirm enrolment from the application page."
    : "The sending school will release academic records after you accept the transfer.";

  return (
    <div className="max-w-4xl space-y-4">
      <BackLink to="/schoolAdmin/transfers">Back to Transfers</BackLink>

      <div>
        <h1 className="text-lg font-semibold text-stone-800">
          {isSending ? "Record Release" : "Incoming Transfer"} — {t.applicationRef}
        </h1>
        <p className="text-sm text-stone-500">
          You are the {isSending ? "sending" : "receiving"} school for this transfer.
        </p>
      </div>

      <Card className="p-5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={t.learnerName} size="lg" />
          <div>
            <div className="font-medium text-stone-800">{t.learnerName}</div>
            <div className="text-xs text-stone-500">
              {t.grade} · Guardian {detail.guardian.name}
            </div>
          </div>
        </div>
        <div className="text-sm text-stone-500">
          <TransferRoute from={t.sendingSchoolName} to={t.receivingSchoolName} />
        </div>
      </Card>

      <ProgressTimeline app={app} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DocumentsCard title="Application Documents" required={detail.requiredDocuments} documents={detail.documents} />
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-3">Record Release</h2>
          <div className="mb-3">
            <StatusBadge status={t.releaseStatus} />
          </div>
          <p className="text-sm text-stone-600 mb-4">{statusText}</p>
          {isSending ? (
            <Button className="w-full" disabled={!canRelease} onClick={() => setConfirming(true)}>
              {released ? (
                <>
                  <Check size={15} /> Released
                </>
              ) : (
                <>
                  <Upload size={15} /> Release Records
                </>
              )}
            </Button>
          ) : (
            <Link
              to={`/schoolAdmin/applications/${t.applicationId}`}
              className="block text-center text-sm font-medium text-brand-600 border border-brand-200 rounded-lg px-4 py-2 hover:bg-brand-50"
            >
              Open application
            </Link>
          )}
        </Card>
      </div>

      <HistoryCard history={detail.history} />

      {confirming && (
        <Modal title="Release records?" onClose={() => setConfirming(false)}>
          <p className="text-sm text-stone-500 mb-5">
            {t.learnerName}'s academic records will be released to {t.receivingSchoolName}. This can't be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button busy={busy} onClick={release}>
              Release
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
