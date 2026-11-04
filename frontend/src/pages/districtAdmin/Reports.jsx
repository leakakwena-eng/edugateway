import { Download } from "lucide-react";
import { Button, Card, ErrorState, PageHeader, Table } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import StatusBreakdown from "../../components/StatusBreakdown.jsx";
import { applicationApi, reportApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { exportApplications } from "../../utils/csv.js";

export default function DistrictReports() {
  const { data, loading, error, reload } = useApi(
    () => Promise.all([reportApi.summary(), reportApi.schools(), applicationApi.list()]),
    []
  );

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const [summary, schools, applications] = data;

  const tiles = [
    ["Total Applications", summary.totalApplications],
    ["New Admissions", summary.byType.NEW],
    ["Transfers", summary.byType.TRANSFER],
    ["Registered Guardians", summary.totalGuardians],
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="District Reports">
        <Button disabled={applications.length === 0} onClick={() => exportApplications("edugateway-all-applications", applications)}>
          <Download size={15} /> Export CSV
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(([label, value]) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-stone-500 mb-1">{label}</div>
            <div className="text-2xl font-semibold text-stone-800">{value}</div>
          </Card>
        ))}
      </div>

      <StatusBreakdown byStatus={summary.byStatus} total={summary.totalApplications} />

      <Card className="overflow-hidden">
        <h2 className="text-sm font-semibold text-stone-700 px-5 pt-5 pb-3">Per-school breakdown</h2>
        <Table headers={["School", "Applications", "Pending", "Accepted", "Enrolled", "Rejected", "Fill rate"]}>
          {schools.map((s) => (
            <tr key={s.schoolId} className="border-t border-stone-100">
              <td className="px-4 py-2.5 text-stone-700">{s.schoolName}</td>
              <td className="px-4 py-2.5 text-stone-500">{s.applications}</td>
              <td className="px-4 py-2.5 text-stone-500">{s.pending}</td>
              <td className="px-4 py-2.5 text-stone-500">{s.accepted}</td>
              <td className="px-4 py-2.5 text-stone-500">{s.enrolled}</td>
              <td className="px-4 py-2.5 text-stone-500">{s.rejected}</td>
              <td className="px-4 py-2.5 text-stone-500">
                {s.capacity ? `${Math.round(((s.accepted + s.enrolled) / s.capacity) * 100)}%` : "—"}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
