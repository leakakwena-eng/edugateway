import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, Upload, Check, CheckCircle2, Clock, Circle, FileText } from "lucide-react";
import { Card, StatusBadge, initials } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { SCHOOLS } from "../../data/seed.js";
import { useToast } from "../../context/ToastContext.jsx";

function TimelineStep({ step }) {
  const Icon = step.state === "done" ? CheckCircle2 : step.state === "current" ? Clock : Circle;
  const color =
    step.state === "done"
      ? "text-green-600"
      : step.state === "current"
      ? "text-amber-600"
      : "text-slate-300";
  return (
    <div className="flex-1 flex flex-col items-center text-center">
      <Icon size={20} className={color} />
      <div className="text-xs font-medium text-slate-700 mt-1.5">{step.step}</div>
      <div className="text-[11px] text-slate-400">{step.date}</div>
    </div>
  );
}

export default function AdminTransferDetail() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { applications, learners, transferRecords, session, releaseTransferRecords } = useApp();
  const toast = useToast();

  const app = applications.find((a) => a.id === appId);
  const record = transferRecords[appId];
  const learner = learners.find((l) => l.id === app?.learnerId);
  const schoolName = (id) => SCHOOLS.find((s) => s.id === id)?.name || "—";

  if (!app || !record) {
    return (
      <div>
        <button
          onClick={() => navigate("/schoolAdmin/transfers")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ChevronLeft size={15} /> Back to Transfers
        </button>
        <Card className="p-8 text-center text-sm text-slate-500">
          Transfer {appId} not found.
        </Card>
      </div>
    );
  }

  const isSendingSchool = app.sendingSchoolId === session.schoolId;

  return (
    <div>
      <button
        onClick={() => navigate("/schoolAdmin/transfers")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ChevronLeft size={15} /> Back to Transfers
      </button>

      <h1 className="text-lg font-semibold text-slate-800">
        {isSendingSchool ? "Record Release" : "Transfer Review"} — {app.id}
      </h1>
      <p className="text-sm text-slate-500 mb-5">
        {isSendingSchool
          ? "You are the sending school for this transfer application."
          : "You are the receiving school for this transfer application."}
      </p>

      <Card className="p-5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
            {initials(learner?.name || "")}
          </div>
          <div>
            <div className="font-medium text-slate-800">{learner?.name}</div>
            <div className="text-xs text-slate-500">
              {app.grade} · Application {app.id}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {schoolName(record.sendingSchoolId)} <ArrowRight size={14} />{" "}
          {schoolName(record.receivingSchoolId)}
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <div className="flex">
          {record.timeline.map((s, i) => (
            <TimelineStep key={i} step={s} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Records to Release</h2>
          <div className="space-y-2">
            {record.records.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-slate-400" />
                  <div>
                    <div className="text-sm text-slate-700">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.file}</div>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            {isSendingSchool ? "Release Status" : "Record Release Status"}
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <StatusBadge status={record.releaseStatus} />
          </div>
          <div className="text-sm text-slate-600 mb-4">
            {isSendingSchool
              ? record.releaseStatus === "Released"
                ? "All records have been released to the receiving school."
                : "Confirm the checklist is complete, then release records to the receiving school."
              : record.releaseStatus === "Released"
              ? "Academic records have been received. This application can now proceed to a decision."
              : "The sending school has been notified to release academic records."}
          </div>
          {isSendingSchool && (
            <button
             onClick={() => {
  releaseTransferRecords(app.id, `${schoolName(session.schoolId)} Admin`);
  toast.success(
    "Records released",
    `${learner?.name}'s academic history was sent to the receiving school.`
  );
}}
              disabled={record.releaseStatus === "Released"}
              className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {record.releaseStatus === "Released" ? (
                <>
                  <Check size={15} /> Released
                </>
              ) : (
                <>
                  <Upload size={15} /> Release Records
                </>
              )}
            </button>
          )}
        </Card>
      </div>
    </div>
  );
}