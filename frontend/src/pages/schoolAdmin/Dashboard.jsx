import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, ClipboardList, GraduationCap, Hourglass } from "lucide-react";
import { Card, CardTitle, ErrorState, PageHeader, StatCard } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import { SchoolArt } from "../../components/Illustrations.jsx";
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
  const go = (to) => () => navigate(`/schoolAdmin/${to}`);
  const needsAction = applications.filter((a) => ["SUBMITTED", "UNDER_REVIEW"].includes(a.status));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <PageHeader eyebrow="School dashboard" title={user.schoolName} subtitle={`Welcome back, ${user.name}.`} />
        <SchoolArt className="hidden sm:block w-36 h-24 -mb-2 shrink-0 animate-fade-up" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} label="Awaiting review" value={s.SUBMITTED + s.UNDER_REVIEW} icon={Hourglass} tone="sun" onClick={go("applications")} />
        <StatCard index={1} label="Transfers awaiting records" value={summary.pendingTransfers} icon={ArrowLeftRight} tone="violet" onClick={go("transfers")} />
        <StatCard index={2} label="Accepted, not enrolled" value={s.ACCEPTED} icon={ClipboardList} tone="sky" onClick={go("applications")} />
        <StatCard index={3} label="Learners enrolled" value={summary.totalLearners} icon={GraduationCap} onClick={go("learners")} />
      </div>

      <Card className="p-6">
        <CardTitle action={<span className="text-xs text-stone-400">{summary.totalApplications} total</span>}>
          Applications received in {summary.year}
        </CardTitle>
        <MonthlyBarChart values={summary.byMonth} year={summary.year} />
      </Card>

      <div>
        <CardTitle>Needs your review</CardTitle>
        <ApplicationsTable
          applications={needsAction}
          basePath="/schoolAdmin/applications"
          columns={["reference", "learner", "grade", "type", "status", "submitted"]}
          filters={false}
          emptyText="You're all caught up. Nothing is waiting for review."
        />
      </div>
    </div>
  );
}
