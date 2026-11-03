import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, FileText, Info, X } from "lucide-react";
import { BackLink, Button, Card, ErrorState, Field, inputClass } from "../../components/ui.jsx";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";
import LearnerForm, { EMPTY_LEARNER, toLearnerRequest } from "../../components/LearnerForm.jsx";
import FileUploadButton from "../../components/FileUploadButton.jsx";
import { applicationApi, intakeApi, learnerApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import { formatBytes, formatDate } from "../../utils/format.js";

const STEPS = ["Learner", "School & Grade", "Documents", "Review & Submit"];
const NEW_LEARNER = "new";

/**
 * Four-step wizard. The application is only created on the final step; selected files
 * are held in memory and uploaded straight after the application is created.
 */
export default function NewApplication() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const { data, loading, error, reload } = useApi(
    () => Promise.all([learnerApi.list(), intakeApi.list({ open: true })]),
    []
  );

  const [step, setStep] = useState(1);
  const [learnerId, setLearnerId] = useState(params.get("learnerId") ?? "");
  const [newLearner, setNewLearner] = useState(EMPTY_LEARNER);
  const [schoolId, setSchoolId] = useState("");
  const [intakeId, setIntakeId] = useState("");
  const [files, setFiles] = useState({});
  const [stepError, setStepError] = useState("");
  const [busy, setBusy] = useState(false);

  const [learners, intakes] = data ?? [[], []];

  const schools = useMemo(() => {
    const map = new Map();
    intakes.forEach((i) => map.set(i.schoolId, i.schoolName));
    return [...map].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [intakes]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const learner = learners.find((l) => String(l.id) === String(learnerId));
  const intake = intakes.find((i) => String(i.id) === String(intakeId));
  const schoolIntakes = intakes.filter((i) => String(i.schoolId) === String(schoolId));
  const learnerName = learnerId === NEW_LEARNER ? newLearner.name : learner?.name;
  const isTransfer = learner?.currentSchoolId && intake && learner.currentSchoolId !== intake.schoolId;

  const validate = () => {
    if (step === 1) {
      if (!learnerId) return "Choose a learner or add a new one.";
      if (learnerId === NEW_LEARNER && (!newLearner.name.trim() || !newLearner.dateOfBirth))
        return "Enter the learner's name and date of birth.";
    }
    if (step === 2 && !intake) return "Choose a school and grade.";
    return "";
  };

  const next = () => {
    const problem = validate();
    setStepError(problem);
    if (!problem) setStep(step + 1);
  };

  const back = () => {
    if (step === 1) return navigate("/guardian/dashboard");
    setStepError("");
    setStep(step - 1);
  };

  const submit = async () => {
    setBusy(true);
    setStepError("");
    try {
      let id = learnerId;
      if (learnerId === NEW_LEARNER) {
        const created = await learnerApi.create(toLearnerRequest(newLearner));
        id = created.id;
        setLearnerId(String(id)); // so a retry doesn't create the learner twice
      }
      const { application } = await applicationApi.submit(Number(id), intake.id);

      const failed = [];
      for (const [type, file] of Object.entries(files)) {
        try {
          await applicationApi.uploadDocument(application.id, type, file);
        } catch {
          failed.push(type);
        }
      }
      if (failed.length) {
        toast.warning("Application submitted", `Some uploads failed (${failed.join(", ")}). Upload them from the application page.`);
      } else {
        toast.success("Application submitted", `${application.reference} was sent to ${application.schoolName}.`);
      }
      navigate(`/guardian/applications/${application.id}`, { replace: true });
    } catch (e) {
      setStepError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const pct = Math.round((step / STEPS.length) * 100);

  return (
    <div className="max-w-3xl">
      <BackLink to="/guardian/dashboard">Back to Dashboard</BackLink>

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-semibold text-slate-800">New Application</h1>
        <span className="text-xs text-slate-500">
          Step {step} of {STEPS.length}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                i + 1 < step ? "bg-green-600 text-white" : i + 1 === step ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {i + 1 < step ? <Check size={13} /> : i + 1}
            </div>
            <span className={`text-xs ${i + 1 === step ? "text-slate-800 font-medium" : "text-slate-400"} hidden sm:inline`}>
              {s}
            </span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-slate-800">Learner</h2>
              <p className="text-xs text-slate-500 mt-0.5">Who is this application for?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {learners.map((l) => (
                <ChoiceCard key={l.id} selected={String(l.id) === String(learnerId)} onClick={() => setLearnerId(String(l.id))}>
                  <div className="font-medium text-slate-800">{l.name}</div>
                  <div className="text-xs text-slate-500">
                    {l.currentSchoolName ? `${l.currentGrade} · ${l.currentSchoolName}` : "Not enrolled yet"}
                  </div>
                </ChoiceCard>
              ))}
              <ChoiceCard selected={learnerId === NEW_LEARNER} onClick={() => setLearnerId(NEW_LEARNER)}>
                <div className="font-medium text-slate-800">+ Add a new learner</div>
                <div className="text-xs text-slate-500">Saved to your learners when you submit.</div>
              </ChoiceCard>
            </div>
            {learnerId === NEW_LEARNER && (
              <div className="pt-2 border-t border-slate-100">
                <LearnerForm value={newLearner} onChange={setNewLearner} />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-slate-800">School & Grade</h2>
              <p className="text-xs text-slate-500 mt-0.5">Only intakes currently open for applications are listed.</p>
            </div>
            {intakes.length === 0 ? (
              <div className="text-sm text-slate-500">No schools are accepting applications right now.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="School *">
                  <select
                    value={schoolId}
                    onChange={(e) => {
                      setSchoolId(e.target.value);
                      setIntakeId("");
                      setFiles({});
                    }}
                    className={inputClass}
                  >
                    <option value="">Select a school</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Grade & Year *">
                  <select
                    value={intakeId}
                    onChange={(e) => {
                      setIntakeId(e.target.value);
                      setFiles({});
                    }}
                    disabled={!schoolId}
                    className={inputClass}
                  >
                    <option value="">Select a grade</option>
                    {schoolIntakes.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.grade} · {i.year}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}
            {intake && (
              <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-4 space-y-1">
                <div>Applications close {formatDate(intake.closeDate)}.</div>
                <div>
                  {Math.max(intake.capacity - intake.acceptedCount, 0)} of {intake.capacity} places still available.
                </div>
                {isTransfer && (
                  <div className="flex items-start gap-2 text-blue-700 pt-1">
                    <Info size={15} className="mt-0.5 shrink-0" />
                    This will be a transfer from {learner.currentSchoolName}. They'll be asked to release {learner.name}'s
                    records once the transfer is accepted.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-slate-800">Documents</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                PDF, JPG or PNG, max 5 MB each. You can also upload them later from the application page.
              </p>
            </div>
            {intake.requiredDocuments.length === 0 ? (
              <div className="text-sm text-slate-500">This intake doesn't require any documents.</div>
            ) : (
              <div className="space-y-2">
                {intake.requiredDocuments.map((type) => {
                  const file = files[type];
                  return (
                    <div key={type} className="flex flex-wrap items-center justify-between gap-2 border border-slate-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={16} className="text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm text-slate-700">{type}</div>
                          {file && (
                            <div className="text-xs text-slate-400 truncate">
                              {file.name} · {formatBytes(file.size)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {file && (
                          <>
                            <span className="flex items-center gap-1 text-xs text-green-700">
                              <Check size={14} /> Ready
                            </span>
                            <button
                              onClick={() =>
                                setFiles((prev) => {
                                  const next = { ...prev };
                                  delete next[type];
                                  return next;
                                })
                              }
                              className="text-slate-400 hover:text-slate-600"
                              aria-label={`Remove ${type}`}
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        <FileUploadButton
                          label={file ? "Change" : "Choose file"}
                          onFile={(f) => setFiles((prev) => ({ ...prev, [type]: f }))}
                          onError={(msg) => toast.error("Can't use this file", msg)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-slate-800">Review & Submit</h2>
              <p className="text-xs text-slate-500 mt-0.5">Check the details before you submit.</p>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-slate-500">Learner</dt>
              <dd className="text-slate-800">{learnerName}</dd>
              <dt className="text-slate-500">School</dt>
              <dd className="text-slate-800">{intake.schoolName}</dd>
              <dt className="text-slate-500">Grade / Year</dt>
              <dd className="text-slate-800">
                {intake.grade} · {intake.year}
              </dd>
              <dt className="text-slate-500">Type</dt>
              <dd className="text-slate-800">{isTransfer ? `Transfer from ${learner.currentSchoolName}` : "New admission"}</dd>
              <dt className="text-slate-500">Documents</dt>
              <dd className="text-slate-800">
                {Object.keys(files).length} of {intake.requiredDocuments.length} attached
              </dd>
            </dl>
          </div>
        )}

        {stepError && <div className="text-sm text-red-600 mt-4">{stepError}</div>}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <Button
            variant="secondary"
            onClick={back}
            disabled={busy}
          >
            {step === 1 ? "Cancel" : "Previous"}
          </Button>
          {step < STEPS.length ? (
            <Button onClick={next}>
              Next <ArrowRight size={15} />
            </Button>
          ) : (
            <Button variant="success" onClick={submit} busy={busy}>
              Submit Application
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function ChoiceCard({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border rounded-lg px-4 py-3 transition-colors ${
        selected ? "border-blue-600 ring-1 ring-blue-600 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
