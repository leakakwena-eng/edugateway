import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, StatusBadge } from "../../components/ui.jsx";
import { SearchInput, StatusFilter } from "../../components/TableControls.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { SCHOOLS } from "../../data/seed";

const STATUSES = ["Submitted", "Under Review", "Enrolled", "Waitlisted", "Rejected"];

export default function DistrictApplications() {
  const navigate = useNavigate();
  const { applications, learners } = useApp();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const learnerName = (id) => learners.find((l) => l.id === id)?.name || "—";
  const schoolName = (id) => SCHOOLS.find((s) => s.id === id)?.name || "—";

  const filtered = applications
    .filter((a) => (status ? a.status === status : true))
    .filter((a) =>
      search
        ? learnerName(a.learnerId).toLowerCase().includes(search.toLowerCase()) ||
          a.id.toLowerCase().includes(search.toLowerCase())
        : true
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-slate-800">All Applications</h1>
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search learner or ID..." />
          <StatusFilter value={status} onChange={setStatus} statuses={STATUSES} />
        </div>
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {search || status
              ? "No applications match your filters."
              : "No applications in the system yet."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">ID</th>
                <th className="text-left font-medium px-4 py-2.5">Learner</th>
                <th className="text-left font-medium px-4 py-2.5">Type</th>
                <th className="text-left font-medium px-4 py-2.5">School</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
                <th className="text-left font-medium px-4 py-2.5">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => navigate(`/districtAdmin/applications/${a.id}`)}
                  className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-4 py-2.5 text-slate-500">{a.id}</td>
                  <td className="px-4 py-2.5 text-slate-700">{learnerName(a.learnerId)}</td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {a.type === "NEW" ? "New Admission" : "Transfer"}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{schoolName(a.schoolId)}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-2.5 text-slate-500">{a.submitted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}