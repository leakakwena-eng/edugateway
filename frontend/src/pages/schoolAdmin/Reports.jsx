import { Download } from "lucide-react";
import { Button, Card, ErrorState, PageHeader } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import StatusBreakdown from "../../components/StatusBreakdown.jsx";
import { applicationApi, reportApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { exportApplications } from "../../utils/csv.js";

export default function AdminReports() {
  const { data, loading, error, reload } = useApi(
    () => Promise.all([reportApi.summary(), applicationApi.list()]),
    []
  );

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const [summary, applications] = data;

  const tiles = [
    ["Total Applications", summary.totalApplications],
    ["New Admissions", summary.byType.NEW],
    ["Transfers", summary.byType.TRANSFER],
    ["Open Intakes", summary.openIntakes],
  ];

  return (
    <div>
      <PageHeader title="Reports & Analytics">
        <Button disabled={applications.length === 0} onClick={() => exportApplications("edugateway-applications", applications)}>
          <Download size={15} /> Export CSV
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {tiles.map(([label, value]) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-slate-500 mb-1">{label}</div>
            <div className="text-2xl font-semibold text-slate-800">{value}</div>
          </Card>
        ))}
      </div>

      <StatusBreakdown byStatus={summary.byStatus} total={summary.totalApplications} />
    </div>
  );
}
