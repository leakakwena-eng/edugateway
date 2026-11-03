import { Link } from "react-router-dom";
import { Card, ErrorState, Table } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import MonthlyBarChart from "../../components/BarChart.jsx";
import { reportApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { actionLabel, formatRelative, schoolTypeLabel } from "../../utils/format.js";

export default function DistrictDashboard() {
  const { data, loading, error, reload } = useApi(
    () => Promise.all([reportApi.summary(), reportApi.schools(), reportApi.audit(6)]),
    []
  );

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const [summary, schools, audit] = data;

  const tiles = [
    ["Total Applications", summary.totalApplications],
    ["Transfers Awaiting Records", summary.pendingTransfers],
    ["Schools Onboarded", summary.totalSchools],
    ["Learners Enrolled", summary.totalLearners],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Multi-School Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">All participating schools, applications and transfers.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(([label, value]) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-slate-500 mb-1">{label}</div>
            <div className="text-2xl font-semibold text-slate-800">{value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Applications submitted in {summary.year}</h2>
        <MonthlyBarChart values={summary.byMonth} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-700">Participating Schools</h2>
            <Link to="/districtAdmin/schools" className="text-xs text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <Table headers={["School", "Type", "Applications", "Enrolled"]}>
            {schools.map((s) => (
              <tr key={s.schoolId} className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-700">{s.schoolName}</td>
                <td className="px-4 py-2 text-slate-500">{schoolTypeLabel(s.schoolType)}</td>
                <td className="px-4 py-2 text-slate-500">{s.applications}</td>
                <td className="px-4 py-2 text-slate-500">{s.enrolled}</td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card className="p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Recent Audit Activity</h2>
            <Link to="/districtAdmin/auditLog" className="text-xs text-blue-600 hover:underline">
              Full log
            </Link>
          </div>
          {audit.length === 0 ? (
            <div className="text-sm text-slate-500">No activity yet.</div>
          ) : (
            <div className="space-y-2.5">
              {audit.map((e) => (
                <div key={e.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <span className="text-slate-700">{actionLabel(e.action)}</span>
                    <span className="text-slate-400"> · {e.entityRef}</span>
                    <div className="text-xs text-slate-400 truncate">{e.actorName}</div>
                  </div>
                  <div className="text-xs text-slate-400 shrink-0">{formatRelative(e.timestamp)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
