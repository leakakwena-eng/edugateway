import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, ClipboardList, GraduationCap, Hourglass } from "lucide-react";
import { Card, ErrorState } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import MonthlyBarChart from "../../components/BarChart.jsx";
import ApplicationsTable from "../../components/ApplicationsTable.jsx";
import { applicationApi, reportApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function SchoolAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useApi(
    () => Promise.all([reportApi.summary(), applicationApi.list()]),
    []
  );

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const [summary, applications] = data;
  const s = summary.byStatus;

  const kpis = [
    { label: "Awaiting review", value: s.SUBMITTED + s.UNDER_REVIEW, icon: Hourglass, color: "bg-amber-600", to: "applications" },
    { label: "Transfers awaiting records", value: summary.pendingTransfers, icon: ArrowLeftRight, color: "bg-indigo-600", to: "transfers" },
    { label: "Accepted, not yet enrolled", value: s.ACCEPTED, icon: ClipboardList, color: "bg-blue-600", to: "applications" },
    { label: "Learners enrolled", value: summary.totalLearners, icon: GraduationCap, color: "bg-green-600", to: "learners" },
  ];
  const needsAction = applications.filter((a) => ["SUBMITTED", "UNDER_REVIEW"].includes(a.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{user.schoolName}</h1>
        <p className="text-sm text-slate-500 mt-0.5">School Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4 cursor-pointer hover:border-blue-300" onClick={() => navigate(`/schoolAdmin/${k.to}`)}>
            <div className={`w-9 h-9 rounded-lg ${k.color} flex items-center justify-center text-white mb-3`}>
              <k.icon size={16} />
            </div>
            <div className="text-2xl font-semibold text-slate-800">{k.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Applications received in {summary.year}</h2>
        <MonthlyBarChart values={summary.byMonth} />
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Needs your review</h2>
        <ApplicationsTable
          applications={needsAction}
          basePath="/schoolAdmin/applications"
          columns={["reference", "learner", "grade", "type", "status", "submitted"]}
          filters={false}
          emptyText="Nothing waiting for review."
        />
      </div>
    </div>
  );
}
