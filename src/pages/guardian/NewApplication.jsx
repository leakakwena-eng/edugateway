import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Upload, FileText, ArrowRight } from "lucide-react";
import { Card } from "../../components/ui.jsx";
import { SCHOOLS } from "../../data/seed";
import { useApp } from "../../context/AppContext.jsx";

export default function NewApplication() {
  const navigate = useNavigate();
  const { submitApplication, learners } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    learnerId: learners[0]?.id || "",
    fullName: "",
    idNumber: "",
    dob: "",
    gender: "",
    schoolId: "",
    grade: "",
    year: 2027,
    docs: { "Birth Certificate": "Pending", "Proof of Residence": "Pending" },
  });

  const steps = ["Learner Details", "School & Grade", "Documents", "Review & Submit"];
  const pct = Math.round((step / steps.length) * 100);

  const uploadDoc = (name) =>
    setForm((f) => ({ ...f, docs: { ...f.docs, [name]: "Uploaded" } }));

  const handleSubmit = () => {
    const newId = submitApplication(form, form.learnerId);
    navigate(`/guardian/applications/${newId}`);
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/guardian/dashboard")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ChevronLeft size={15} /> Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-semibold text-slate-800">New Admission Application</h1>
        <span className="text-xs text-slate-500">
          Step {step} of {steps.length}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                i + 1 < step
                  ? "bg-green-600 text-white"
                  : i + 1 === step
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {i + 1 < step ? <Check size={13} /> : i + 1}
            </div>
            <span
              className={`text-xs ${
                i + 1 === step ? "text-slate-800 font-medium" : "text-slate-400"
              } hidden sm:inline`}
            >
              {s}
            </span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-slate-800">Learner Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter the learner's personal information.
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Full Name *</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g. Thabo Sipho Nkosi"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600">ID Number (optional)</label>
                <input
                  value={form.idNumber}
                  onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Date of Birth *</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Gender *</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-slate-800">School & Grade</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the school and intake you're applying to.
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">School *</label>
              <select
                value={form.schoolId}
                onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select a school</option>
                {SCHOOLS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600">Grade *</label>
                <input
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  placeholder="e.g. Grade 1"
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Intake Year *</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-slate-800">Documents</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accepted formats: PDF, JPG or PNG, max 5MB.
              </p>
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center text-center">
              <Upload size={22} className="text-blue-600 mb-2" />
              <div className="text-sm text-slate-600">
                Drag and drop files here, or click a document below to simulate an upload
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(form.docs).map(([name, status]) => (
                <div
                  key={name}
                  className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-700">{name} *</span>
                  </div>
                  {status === "Uploaded" ? (
                    <span className="flex items-center gap-1 text-xs text-green-700">
                      <Check size={14} /> Uploaded
                    </span>
                  ) : (
                    <button
                      onClick={() => uploadDoc(name)}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Upload file
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-slate-800">Review & Submit</h2>
              <p className="text-xs text-slate-500 mt-0.5">Check the details before you submit.</p>
            </div>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="text-slate-500">Full name</div>
              <div className="text-slate-800">{form.fullName || "—"}</div>
              <div className="text-slate-500">Date of birth</div>
              <div className="text-slate-800">{form.dob || "—"}</div>
              <div className="text-slate-500">Gender</div>
              <div className="text-slate-800">{form.gender || "—"}</div>
              <div className="text-slate-500">School</div>
              <div className="text-slate-800">
                {form.schoolId ? SCHOOLS.find((s) => s.id === form.schoolId)?.name : "—"}
              </div>
              <div className="text-slate-500">Grade / Year</div>
              <div className="text-slate-800">
                {form.grade || "—"} · {form.year}
              </div>
              <div className="text-slate-500">Documents</div>
              <div className="text-slate-800">
                {Object.values(form.docs).filter((v) => v === "Uploaded").length} of{" "}
                {Object.keys(form.docs).length} uploaded
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => (step === 1 ? navigate("/guardian/dashboard") : setStep(step - 1))}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            {step === 1 ? "Cancel" : "Previous"}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Submit Application
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}