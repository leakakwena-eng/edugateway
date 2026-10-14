import { Download } from "lucide-react";
import { Card } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { downloadCSV } from "../../utils/csv";
import { SCHOOLS } from "../../data/seed";

export default function DistrictReports() {
  const { applications, learners } = useApp();

  const byType = {
    NEW: applications.filter((a) => a.type === "NEW").length,
    TRANSFER: applications.filter((a) => a.type === "TRANSFER").length,
  };

  const learnerName = (id) => learners.find((l) => l.id === id)?.name || "—";
  const schoolName = (id) => SCHOOLS.find((s) => s.id === id)?.name || "—";

  const handleExport = () => {
    const headers = ["ID", "Learner", "Type", "Grade", "School", "Status", "Date"];
    const rows = applications.map((a) => [
      a.id,
      learnerName(a.learnerId),
      a.type === "NEW" ? "New Admission" : "Transfer",
      a.grade,
      schoolName(a.schoolId),
      a.status,
      a.submitted,
    ]);
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(`edugateway-all-applications-${date}.csv`, rows, headers);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-slate-800">District Reports</h1>
        <button
          onClick={handleExport}
          disabled={applications.length === 0}
          className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 px-3.5 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500 mb-1">Total Applications</div>
          <div className="text-2xl font-semibold text-slate-800">{applications.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 mb-1">New Admissions</div>
          <div className="text-2xl font-semibold text-slate-800">{byType.NEW}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 mb-1">Transfers</div>
          <div className="text-2xl font-semibold text-slate-800">{byType.TRANSFER}</div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Applications by Status</h2>
        <div className="space-y-3">
          {["Enrolled", "Under Review", "Submitted", "Waitlisted", "Rejected"].map((st) => {
            const count = applications.filter((a) => a.status === st).length;
            const pct = applications.length
              ? Math.round((count / applications.length) * 100)
              : 0;
            return (
              <div key={st}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{st}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}