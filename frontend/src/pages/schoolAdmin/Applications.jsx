import { ErrorState, PageHeader } from "../../components/ui.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import ApplicationsTable from "../../components/ApplicationsTable.jsx";
import { applicationApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminApplications() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi(() => applicationApi.list(), []);

  return (
    <div>
      <PageHeader title="Applications" subtitle={`Applications made to ${user.schoolName}`} />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <ApplicationsTable
          applications={data}
          basePath="/schoolAdmin/applications"
          columns={["reference", "learner", "guardian", "grade", "type", "status", "submitted"]}
          emptyText={`No applications for ${user.schoolName} yet.`}
        />
      )}
    </div>
  );
}
