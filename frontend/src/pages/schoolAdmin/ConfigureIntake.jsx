import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackLink, Button, Card, ErrorState, Field, inputClass } from "../../components/ui.jsx";
import { CardSkeleton } from "../../components/Skeleton.jsx";
import { intakeApi } from "../../api/index.js";
import { useToast } from "../../context/ToastContext.jsx";
import { DOCUMENT_TYPES, GRADES } from "../../constants.js";

const nextYear = new Date().getFullYear() + 1;

const EMPTY = {
  grade: "Grade 1",
  year: nextYear,
  openDate: "",
  closeDate: "",
  capacity: 60,
  requiredDocuments: ["Birth Certificate", "Proof of Residence"],
};

export default function AdminConfigureIntake() {
  const { intakeId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(intakeId));
  const [loadError, setLoadError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!intakeId) return;
    intakeApi
      .get(intakeId)
      .then((i) =>
        setForm({
          grade: i.grade,
          year: i.year,
          openDate: i.openDate ?? "",
          closeDate: i.closeDate ?? "",
          capacity: i.capacity,
          requiredDocuments: i.requiredDocuments,
        })
      )
      .catch(setLoadError)
      .finally(() => setLoading(false));
  }, [intakeId]);

  const toggleDoc = (d) =>
    setForm((f) => ({
      ...f,
      requiredDocuments: f.requiredDocuments.includes(d)
        ? f.requiredDocuments.filter((x) => x !== d)
        : [...f.requiredDocuments, d],
    }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const body = {
      ...form,
      year: Number(form.year),
      capacity: Number(form.capacity),
      openDate: form.openDate || null,
      closeDate: form.closeDate || null,
    };
    try {
      if (intakeId) await intakeApi.update(intakeId, body);
      else await intakeApi.create(body);
      toast.success("Intake saved", `${body.grade} · ${body.year}`);
      navigate("/schoolAdmin/intake");
    } catch (err) {
      toast.error("Couldn't save intake", err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <CardSkeleton />;
  if (loadError) return <ErrorState error={loadError} />;

  return (
    <div className="max-w-2xl">
      <BackLink to="/schoolAdmin/intake">School & Intake</BackLink>
      <h1 className="text-lg font-semibold text-stone-800 mb-1">{intakeId ? "Edit Intake" : "Configure Intake"}</h1>
      <p className="text-sm text-stone-500 mb-5">Set up the registration window and required documents for a grade.</p>

      <Card className="p-6">
        <form onSubmit={save} className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-stone-700 mb-3">Intake Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Grade">
                <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className={inputClass}>
                  {GRADES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </Field>
              <Field label="Year">
                <input type="number" required min={2000} max={2100} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Capacity">
                <input type="number" required min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Open Date">
                <input type="date" value={form.openDate} onChange={(e) => setForm({ ...form, openDate: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Close Date">
                <input type="date" min={form.openDate || undefined} value={form.closeDate} onChange={(e) => setForm({ ...form, closeDate: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-stone-700 mb-2">Required Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {DOCUMENT_TYPES.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm text-stone-700">
                  <input type="checkbox" checked={form.requiredDocuments.includes(d)} onChange={() => toggleDoc(d)} className="accent-brand-600" />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <Button type="button" variant="secondary" onClick={() => navigate("/schoolAdmin/intake")}>
              Cancel
            </Button>
            <Button type="submit" busy={busy}>
              Save Intake
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
