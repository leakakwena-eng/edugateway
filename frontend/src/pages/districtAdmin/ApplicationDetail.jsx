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
import { applicationApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";

/** Read-only oversight view; decisions belong to the receiving school. */
export default function DistrictApplicationDetail() {
  const { appId } = useParams();
  const { data, loading, error, reload } = useApi(() => applicationApi.get(appId), [appId]);

  if (loading) return <DashboardSkeleton />;
  if (error) {
    return (
      <div>
        <BackLink to="/districtAdmin/applications" />
        <ErrorState error={error} onRetry={reload} />
      </div>
    );
  }

  const { application: app, guardian, requiredDocuments, documents, history } = data;

  return (
    <div className="max-w-4xl space-y-4">
      <BackLink to="/districtAdmin/applications" />
      <ApplicationHeader app={app} />
      <RejectionBanner app={app} />
      <ProgressTimeline app={app} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DetailsCard app={app} guardian={guardian} />
        <DocumentsCard required={requiredDocuments} documents={documents} />
      </div>
      <HistoryCard history={history} />
    </div>
  );
}
