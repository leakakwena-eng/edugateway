import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardList, FileWarning, Users } from "lucide-react";
import { Avatar, Button, Card, CardTitle, EmptyState, ErrorState, StatCard, StatusBadge } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import { BackpackArt, SunriseScene } from "../../components/Illustrations.jsx";
import ApplicationsTable from "../../components/ApplicationsTable.jsx";
import { applicationApi, documentApi, learnerApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

const OPEN = ["SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "WAITLISTED"];

export default function GuardianDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi(
    () => Promise.all([learnerApi.list(), applicationApi.list(), documentApi.list()]),
    []
  );

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const [learners, applications, documents] = data;
  const open = applications.filter((a) => OPEN.includes(a.status));
  const needsAttention = documents.filter((d) => d.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-brand-900 text-white shadow-lift animate-fade-up">
        <SunriseScene className="absolute inset-y-0 right-0 h-full w-full sm:w-3/5 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/85 to-brand-950/10" />
        <div className="relative p-6 sm:p-9 max-w-lg">
          <div className="text-sm font-medium text-sun-200">{greeting()},</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-0.5">{user.name.split(" ")[0]}</h1>
          <p className="text-brand-100/80 text-sm sm:text-base mt-2">
            {open.length
              ? `You have ${open.length} application${open.length === 1 ? "" : "s"} in progress. We'll notify you at every step.`
              : "Ready to find the right school? Start an application in a few minutes."}
          </p>
          <Button variant="accent" className="mt-5" onClick={() => navigate("/guardian/new-application")}>
            Start an application <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard index={0} label="Learners" value={learners.length} icon={Users} onClick={() => navigate("/guardian/learners")} />
        <StatCard index={1} label="In progress" value={open.length} icon={ClipboardList} tone="sky" onClick={() => navigate("/guardian/applications")} />
        <StatCard
          index={2}
          label="To re-upload"
          value={needsAttention}
          icon={FileWarning}
          tone={needsAttention ? "rose" : "sun"}
          hint={needsAttention ? "A school asked for a new copy" : "Nothing needs your attention"}
          onClick={() => navigate("/guardian/documents")}
        />
      </div>

      <div>
        <CardTitle action={<Link to="/guardian/learners" className="text-sm font-semibold text-brand-700 hover:underline">Manage</Link>}>
          My learners
        </CardTitle>
        {learners.length === 0 ? (
          <Card>
            <EmptyState art={BackpackArt} title="No learners yet" body="Add your child's details to start applying.">
              <Button onClick={() => navigate("/guardian/learners")}>Add a learner</Button>
            </EmptyState>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {learners.map((l, i) => (
              <Card key={l.id} style={{ "--i": i }} className="p-4 flex items-center gap-3.5 animate-fade-up stagger">
                <Avatar name={l.name} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-stone-900 truncate">{l.name}</div>
                  <div className="text-xs text-stone-500 truncate mb-1.5">
                    {l.currentSchoolName ? `${l.currentGrade} · ${l.currentSchoolName}` : "Not enrolled yet"}
                  </div>
                  <StatusBadge
                    status={l.currentSchoolName ? "ENROLLED" : "DRAFT"}
                    label={l.currentSchoolName ? "Enrolled" : "Not enrolled"}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <CardTitle action={<Link to="/guardian/applications" className="text-sm font-semibold text-brand-700 hover:underline">View all</Link>}>
          Recent applications
        </CardTitle>
        <ApplicationsTable
          applications={applications.slice(0, 5)}
          basePath="/guardian/applications"
          columns={["learner", "type", "school", "status", "submitted"]}
          filters={false}
          emptyText="No applications yet. Start one to see it here."
        />
      </div>
    </div>
  );
}
