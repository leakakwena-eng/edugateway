import { ErrorState, PageHeader } from "../../components/ui.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import ApplicationsTable from "../../components/ApplicationsTable.jsx";
import { applicationApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";

export default function DistrictApplications() {
  const { data, loading, error, reload } = useApi(() => applicationApi.list(), []);

  return (
    <div>
      <PageHeader title="All Applications" subtitle="Every application across participating schools." />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <ApplicationsTable
          applications={data}
          basePath="/districtAdmin/applications"
          columns={["reference", "learner", "type", "school", "grade", "status", "submitted"]}
          emptyText="No applications in the system yet."
        />
      )}
    </div>
  );
}
