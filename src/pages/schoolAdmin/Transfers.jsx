import { useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import { Card, StatusBadge, EmptyState } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { SCHOOLS } from "../../data/seed";

export default function AdminTransfers() {
  const navigate = useNavigate();
  const { session, applications, learners } = useApp();
  const mySchoolId = session.schoolId;

  const transfers = applications.filter(
    (a) => a.type === "TRANSFER" && (a.schoolId === mySchoolId || a.sendingSchoolId === mySchoolId)
  );
  const learnerName = (id) => learners.find((l) => l.id === id)?.name || "—";
  const schoolName = (id) => SCHOOLS.find((s) => s.id === id)?.name || "—";

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Transfers</h1>
      <Card className="overflow-hidden">
        {transfers.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transfers yet"
            body="Transfer requests involving your school will appear here."
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">ID</th>
                <th className="text-left font-medium px-4 py-2.5">Learner</th>
                <th className="text-left font-medium px-4 py-2.5">Role</th>
                <th className="text-left font-medium px-4 py-2.5">Sending → Receiving</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => navigate(`/schoolAdmin/transfers/${a.id}`)}
                  className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-4 py-2.5 text-slate-500">{a.id}</td>
                  <td className="px-4 py-2.5 text-slate-700">{learnerName(a.learnerId)}</td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {a.sendingSchoolId === mySchoolId ? "Sending School" : "Receiving School"}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {schoolName(a.sendingSchoolId)} → {schoolName(a.schoolId)}
                  </td>
                  <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}