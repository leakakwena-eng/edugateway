import { useParams } from "react-router-dom";
import { BackLink, ErrorState } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import {
  ApplicationHeader,
  DetailsCard,
  DocumentsCard,
  HistoryCard,
  ProgressTimeline,
  RejectionBanner,
} from "../../components/ApplicationParts.jsx";
import FileUploadButton from "../../components/FileUploadButton.jsx";
import { applicationApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useToast } from "../../context/ToastContext.jsx";

const OPEN_STATUSES = ["SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "WAITLISTED"];

export default function GuardianApplicationDetail() {
  const { appId } = useParams();
  const toast = useToast();
  const { data, loading, error, reload } = useApi(() => applicationApi.get(appId), [appId]);

  if (loading) return <DashboardSkeleton />;
  if (error) {
    return (
      <div>
        <BackLink to="/guardian/applications">Back to Applications</BackLink>
        <ErrorState error={error} onRetry={reload} />
      </div>
    );
  }

  const { application: app, requiredDocuments, documents, history } = data;
  const canUpload = OPEN_STATUSES.includes(app.status);

  const upload = async (type, file) => {
    try {
      await applicationApi.uploadDocument(app.id, type, file);
      toast.success("Document uploaded", `${type} was sent to ${app.schoolName}.`);
      reload();
    } catch (e) {
      toast.error("Upload failed", e.message);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <BackLink to="/guardian/applications">Back to Applications</BackLink>
      <ApplicationHeader app={app} />
      <RejectionBanner app={app} />
      <ProgressTimeline app={app} />
      <DetailsCard app={app} />
      <DocumentsCard
        required={requiredDocuments}
        documents={documents}
        renderActions={(doc, type) =>
          canUpload &&
          doc?.status !== "VERIFIED" && (
            <FileUploadButton
              label={doc ? "Replace" : "Upload"}
              onFile={(file) => upload(type, file)}
              onError={(msg) => toast.error("Can't upload this file", msg)}
            />
          )
        }
      />
      <HistoryCard history={history} />
    </div>
  );
}
