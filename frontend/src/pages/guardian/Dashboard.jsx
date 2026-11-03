import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, ErrorState, StatusBadge } from "../../components/ui.jsx";
import { initials } from "../../utils/format.js";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import ApplicationsTable from "../../components/ApplicationsTable.jsx";
import { applicationApi, learnerApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function GuardianDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi(
    () => Promise.all([learnerApi.list(), applicationApi.list()]),
    []
  );

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const [learners, applications] = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          {greeting()}, {user.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your learners.</p>
      </div>

      <Card className="p-6 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <div className="font-medium text-slate-800 mb-1">Ready to apply?</div>
          <div className="text-sm text-slate-500">
            Start a new admission or transfer application for one of your learners.
          </div>
        </div>
        <button
          onClick={() => navigate("/guardian/new-application")}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700"
        >
          Start Application <ArrowRight size={15} />
        </button>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">My Learners</h2>
        {learners.length === 0 ? (
          <Card className="p-6 text-sm text-slate-500">
            No learners yet.{" "}
            <button onClick={() => navigate("/guardian/learners")} className="text-blue-600 hover:underline">
              Add your first learner
            </button>
            .
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {learners.map((l) => (
              <Card key={l.id} className="p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold shrink-0">
                  {initials(l.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-800 truncate">{l.name}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {l.currentSchoolName ? `${l.currentGrade} · ${l.currentSchoolName}` : "Not enrolled yet"}
                  </div>
                </div>
                <StatusBadge
                  status={l.currentSchoolName ? "ENROLLED" : "DRAFT"}
                  label={l.currentSchoolName ? "Enrolled" : "Not enrolled"}
                />
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Recent Applications</h2>
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
