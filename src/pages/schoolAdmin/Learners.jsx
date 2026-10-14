import { Card, StatusBadge } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export default function AdminLearners() {
  const { session, applications, learners } = useApp();
  const schoolId = session.schoolId;

  const enrolled = applications.filter(
    (a) => a.schoolId === schoolId && a.status === "Enrolled"
  );
  const learnerName = (id) => learners.find((l) => l.id === id)?.name || "—";

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Enrolled Learners</h1>
      <Card className="overflow-hidden">
        {enrolled.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No learners enrolled yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Application</th>
                <th className="text-left font-medium px-4 py-2.5">Learner</th>
                <th className="text-left font-medium px-4 py-2.5">Grade</th>
                <th className="text-left font-medium px-4 py-2.5">Enrolled Date</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrolled.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 text-slate-500">{a.id}</td>
                  <td className="px-4 py-2.5 text-slate-700">{learnerName(a.learnerId)}</td>
                  <td className="px-4 py-2.5 text-slate-500">{a.grade}</td>
                  <td className="px-4 py-2.5 text-slate-500">{a.submitted}</td>
                  <td className="px-4 py-2.5"><StatusBadge status="Enrolled" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}