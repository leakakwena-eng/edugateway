import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Card, StatusBadge } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { SCHOOLS } from "../../data/seed.js";

export default function GuardianApplicationDetail() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { applications, learners } = useApp();

  const app = applications.find((a) => a.id === appId);
  const learner = learners.find((l) => l.id === app?.learnerId);
  const schoolName = (id) => SCHOOLS.find((s) => s.id === id)?.name || "—";

  if (!app) {
    return (
      <div>
        <button
          onClick={() => navigate("/guardian/applications")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ChevronLeft size={15} /> Back to Applications
        </button>
        <Card className="p-8 text-center text-sm text-slate-500">
          Application {appId} not found.
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/guardian/applications")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ChevronLeft size={15} /> Back to Applications
      </button>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Application {app.id}</h1>
          <div className="text-sm text-slate-500">
            {learner?.name} · {schoolName(app.schoolId)}
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {app.status === "Rejected" && app.rejectionReason && (
        <Card className="p-4 mb-4 border-red-200 bg-red-50 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-medium text-red-800">Application rejected</div>
            <div className="text-sm text-red-700 mt-0.5">{app.rejectionReason}</div>
          </div>
        </Card>
      )}

      <Card className="p-5 mb-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Documents</h2>
        {app.documents?.length ? (
          <div className="space-y-2">
            {app.documents.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-2.5"
              >
                <span className="text-sm text-slate-700">{d.name}</span>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500">No documents uploaded.</div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Status History</h2>
        {app.history?.length ? (
          <div className="space-y-3">
            {app.history.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <div className="text-sm text-slate-700">{h.action}</div>
                  <div className="text-xs text-slate-400">
                    {h.actor} · {h.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500">No history yet.</div>
        )}
      </Card>
    </div>
  );
}