import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftRight, Building2, ClipboardList, GraduationCap } from "lucide-react";
import { Card, CardTitle, ErrorState, StatCard } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import { SunriseScene } from "../../components/Illustrations.jsx";
import MonthlyBarChart from "../../components/BarChart.jsx";
import { reportApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { actionLabel, formatRelative, schoolTypeLabel } from "../../utils/format.js";

export default function DistrictDashboard() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useApi(
    () => Promise.all([reportApi.summary(), reportApi.schools(), reportApi.audit(6)]),
    []
  );

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const [summary, schools, audit] = data;
  const busiest = Math.max(1, ...schools.map((s) => s.applications));

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-brand-900 shadow-lift animate-fade-up">
        <SunriseScene className="absolute inset-y-0 right-0 h-full w-full sm:w-3/5 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/85 to-brand-950/10" />
        <div className="relative p-6 sm:p-9">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-sun-300">District office</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-1">Multi-school overview</h1>
          <p className="text-brand-100/80 text-sm mt-2 max-w-md">
            Admissions and transfers across all {summary.totalSchools} participating schools.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} label="Total applications" value={summary.totalApplications} icon={ClipboardList} tone="sky" onClick={() => navigate("/districtAdmin/applications")} />
        <StatCard index={1} label="Transfers awaiting records" value={summary.pendingTransfers} icon={ArrowLeftRight} tone="violet" />
        <StatCard index={2} label="Schools onboarded" value={summary.totalSchools} icon={Building2} tone="sun" onClick={() => navigate("/districtAdmin/schools")} />
        <StatCard index={3} label="Learners enrolled" value={summary.totalLearners} icon={GraduationCap} />
      </div>

      <Card className="p-6">
        <CardTitle>Applications submitted in {summary.year}</CardTitle>
        <MonthlyBarChart values={summary.byMonth} year={summary.year} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="p-6 lg:col-span-3">
          <CardTitle action={<Link to="/districtAdmin/schools" className="text-sm font-semibold text-brand-700 hover:underline">All schools</Link>}>
            Schools by demand
          </CardTitle>
          <div className="space-y-3.5">
            {[...schools]
              .sort((a, b) => b.applications - a.applications)
              .map((s) => (
                <div key={s.schoolId}>
                  <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
                    <span className="font-medium text-stone-900 truncate">
                      {s.schoolName}
                      <span className="text-xs font-normal text-stone-400"> · {schoolTypeLabel(s.schoolType)}</span>
                    </span>
                    <span className="text-xs text-stone-500 shrink-0 tabular-nums">
                      {s.applications} applied · {s.enrolled} enrolled
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 overflow-hidden flex">
                    <div className="h-full bg-brand-600" style={{ width: `${(s.enrolled / busiest) * 100}%` }} />
                    <div className="h-full bg-brand-300" style={{ width: `${((s.applications - s.enrolled) / busiest) * 100}%` }} />
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <CardTitle action={<Link to="/districtAdmin/auditLog" className="text-sm font-semibold text-brand-700 hover:underline">Full log</Link>}>
            Recent activity
          </CardTitle>
          {audit.length === 0 ? (
            <div className="text-sm text-stone-500">No activity yet.</div>
          ) : (
            <ol className="space-y-3.5">
              {audit.map((e) => (
                <li key={e.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-sunrise shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-stone-900 font-medium">
                      {actionLabel(e.action)} <span className="font-normal text-stone-400">· {e.entityRef}</span>
                    </div>
                    <div className="text-xs text-stone-500 truncate">{e.actorName}</div>
                  </div>
                  <div className="text-xs text-stone-400 shrink-0">{formatRelative(e.timestamp)}</div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}
