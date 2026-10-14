import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Check, X, Clock } from "lucide-react";
import { Card, StatusBadge, initials } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { SCHOOLS, SCHOOL_ADMINS, GUARDIAN } from "../../data/seed";
import { useToast } from "../../context/ToastContext.jsx";

export default function AdminApplicationDetail() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { applications, learners, session, decideApplication } = useApp();

  const [confirming, setConfirming] = useState(null);
  const [notes, setNotes] = useState("");
  const toast = useToast();

  const app = applications.find((a) => a.id === appId);
  const learner = learners.find((l) => l.id === app?.learnerId);
  const schoolName = (id) => SCHOOLS.find((s) => s.id === id)?.name || "—";

  if (!app) {
    return (
      <div>
        <button
          onClick={() => navigate("/schoolAdmin/applications")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ChevronLeft size={15} /> Back
        </button>
        <Card className="p-8 text-center text-sm text-slate-500">
          Application {appId} not found.
        </Card>
      </div>
    );
  }

  const actorName = SCHOOL_ADMINS[session.schoolId]?.name || "School Admin";
  const canDecide = app.status !== "Enrolled" && app.status !== "Rejected";

 const handleDecide = (decision) => {
  decideApplication(app.id, decision, `${actorName} (School Admin)`);
  setConfirming(null);
  toast.success(
    `Application ${decision.toLowerCase()}`,
    `Guardian has been notified about ${app.id}.`
  );
};

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/schoolAdmin/applications")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ChevronLeft size={15} /> Back
      </button>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Application {app.id}</h1>
          <div className="text-sm text-slate-500">
            {app.type === "NEW" ? "New Admission" : "Transfer"} · {app.grade} · {app.submitted}
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Learner Information</h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
              {initials(learner?.name || "")}
            </div>
            <div>
              <div className="font-medium text-slate-800">{learner?.name}</div>
              <div className="text-xs text-slate-500">{app.grade}</div>
            </div>
          </div>
          <div className="text-sm text-slate-500">Guardian: {GUARDIAN.name}</div>
          <div className="text-sm text-slate-500">{GUARDIAN.phone}</div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Application Details</h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-slate-500">Type</div>
            <div className="text-slate-800">{app.type === "NEW" ? "New Admission" : "Transfer"}</div>
            <div className="text-slate-500">Intake</div>
            <div className="text-slate-800">{app.year}</div>
            <div className="text-slate-500">School</div>
            <div className="text-slate-800">{schoolName(app.schoolId)}</div>
            {app.sendingSchoolId && (
              <>
                <div className="text-slate-500">From</div>
                <div className="text-slate-800">{schoolName(app.sendingSchoolId)}</div>
              </>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Submitted Documents</h2>
          {app.documents?.length ? (
            <div className="space-y-2">
              {app.documents.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2"
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
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Internal Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            className="w-full h-28 border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </Card>
      </div>

      {canDecide && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setConfirming("Accepted")}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-green-600 px-4 py-2.5 rounded-lg hover:bg-green-700"
          >
            <Check size={15} /> Approve
          </button>
          <button
            onClick={() => setConfirming("Waitlisted")}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-amber-600 px-4 py-2.5 rounded-lg hover:bg-amber-700"
          >
            <Clock size={15} /> Waitlist
          </button>
          <button
            onClick={() => setConfirming("Rejected")}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-600 px-4 py-2.5 rounded-lg hover:bg-red-700"
          >
            <X size={15} /> Reject
          </button>
        </div>
      )}

      {confirming && (
        <div
          className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50"
          onClick={() => setConfirming(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm"
          >
            <h3 className="font-semibold text-slate-800 mb-2">Confirm Decision</h3>
            <p className="text-sm text-slate-500 mb-5">
              Are you sure you want to mark this application as <strong>{confirming}</strong>?
              This will notify the learner's guardian.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirming(null)}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecide(confirming)}
                className={`px-3.5 py-2 text-sm font-medium text-white rounded-lg ${
                  confirming === "Accepted"
                    ? "bg-green-600 hover:bg-green-700"
                    : confirming === "Rejected"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {confirming === "Accepted" ? "Approve" : confirming}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}