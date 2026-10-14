import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { Card, StatusBadge, initials } from "../../components/ui.jsx";
import { SCHOOLS, GUARDIAN } from "../../data/seed";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";

export default function GuardianDashboard() {
  const navigate = useNavigate();
  const { applications, learners } = useApp();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 400);
  return () => clearTimeout(timer);
}, []);

  const myApps = applications.filter((a) => learners.some((l) => l.id === a.learnerId));
  const recent = myApps.slice(0, 4);

  const schoolName = (id) => SCHOOLS.find((s) => s.id === id)?.name || "—";
  const learnerName = (id) => learners.find((l) => l.id === id)?.name || "—";
  const learnerGrade = (id) => learners.find((l) => l.id === id)?.grade || "—";


return (
  <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          Good morning, {GUARDIAN.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Here's what's happening with your learners.
        </p>
      </div>

      <Card className="p-6 flex items-center justify-between">
        <div>
          <div className="font-medium text-slate-800 mb-1">Ready to apply?</div>
          <div className="text-sm text-slate-500">
            Start a new application for your learner or manage an existing one.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {learners.map((l) => (
            <Card key={l.id} className="p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold shrink-0">
                {initials(l.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-800 truncate">{l.name}</div>
                <div className="text-xs text-slate-500">
                  {l.grade} {l.schoolId ? `· ${schoolName(l.schoolId)}` : ""}
                </div>
              </div>
              <StatusBadge status={l.schoolId ? "Enrolled" : "Pending Review"} />
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Recent Applications</h2>
        <Card className="overflow-hidden">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No applications yet. Start one to see it here.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">Learner</th>
                  <th className="text-left font-medium px-4 py-2.5">Type</th>
                  <th className="text-left font-medium px-4 py-2.5">School</th>
                  <th className="text-left font-medium px-4 py-2.5">Status</th>
                  <th className="text-left font-medium px-4 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => navigate(`/guardian/applications/${a.id}`)}
                    className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-2.5 text-slate-700">{learnerName(a.learnerId)}</td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {a.type === "NEW" ? "New Admission" : "Transfer"}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{schoolName(a.schoolId)}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{a.submitted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}