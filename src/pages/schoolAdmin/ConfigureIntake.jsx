import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Card } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { ALL_DOCS } from "../../data/seed";

export default function AdminConfigureIntake() {
  const { intakeId } = useParams();
  const navigate = useNavigate();
  const { session, intakes, saveIntake } = useApp();
  const existing = intakeId ? intakes.find((i) => i.id === intakeId) : null;

  const [form, setForm] = useState(
    existing || {
      schoolId: session.schoolId,
      grade: "Grade 1",
      year: 2027,
      openDate: "",
      closeDate: "",
      capacity: 60,
      requiredDocs: ["Birth Certificate", "Proof of Residence"],
    }
  );

  const toggleDoc = (d) =>
    setForm((f) => ({
      ...f,
      requiredDocs: f.requiredDocs.includes(d)
        ? f.requiredDocs.filter((x) => x !== d)
        : [...f.requiredDocs, d],
    }));

  const handleSave = () => {
    saveIntake(form);
    navigate("/schoolAdmin/intake");
  };

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate("/schoolAdmin/intake")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ChevronLeft size={15} /> School & Intake
      </button>
      <h1 className="text-lg font-semibold text-slate-800 mb-1">Configure Intake</h1>
      <p className="text-sm text-slate-500 mb-5">
        Set up the registration window and required documents for each grade.
      </p>

      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Intake Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Grade</label>
              <input
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Capacity</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Open Date</label>
              <input
                type="date"
                value={form.openDate}
                onChange={(e) => setForm({ ...form, openDate: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Close Date</label>
              <input
                type="date"
                value={form.closeDate}
                onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Required Documents</h2>
          <div className="space-y-1.5">
            {ALL_DOCS.map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.requiredDocs.includes(d)}
                  onChange={() => toggleDoc(d)}
                  className="accent-blue-600"
                />
                {d}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => navigate("/schoolAdmin/intake")}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Save Intake
          </button>
        </div>
      </Card>
    </div>
  );
}