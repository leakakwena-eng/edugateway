import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button, ErrorState, PageHeader } from "../../components/ui.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import ApplicationsTable from "../../components/ApplicationsTable.jsx";
import { applicationApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";

export default function GuardianApplications() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useApi(() => applicationApi.list(), []);

  return (
    <div>
      <PageHeader title="Applications">
        <Button onClick={() => navigate("/guardian/new-application")}>
          <Plus size={15} /> New Application
        </Button>
      </PageHeader>
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <ApplicationsTable
          applications={data}
          basePath="/guardian/applications"
          emptyText="You haven't submitted any applications yet."
        />
      )}
    </div>
  );
}
