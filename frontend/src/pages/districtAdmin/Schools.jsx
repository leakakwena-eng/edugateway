import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, Card, ErrorState, Field, PageHeader, Table, inputClass } from "../../components/ui.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import { reportApi, schoolApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import { schoolTypeLabel } from "../../utils/format.js";

const EMPTY = { name: "", type: "PRIMARY", emisNo: "" };

export default function DistrictSchools() {
  const toast = useToast();
  const { data, loading, error, reload } = useApi(
    () => Promise.all([schoolApi.list(), reportApi.schools()]),
    []
  );
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const [schools, stats] = data;
  const statsFor = (id) => stats.find((s) => s.schoolId === id);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const created = await schoolApi.create(form);
      toast.success("School added", created.name);
      setForm(EMPTY);
      setAdding(false);
      reload();
    } catch (err) {
      toast.error("Couldn't add school", err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="Schools" subtitle={`${schools.length} participating schools`}>
        <Button onClick={() => setAdding(true)}>
          <Plus size={15} /> Add School
        </Button>
      </PageHeader>

      {adding && (
        <Card className="p-5 mb-4 max-w-2xl">
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <Field label="School name">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                </Field>
              </div>
              <Field label="Type">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                  <option value="PRIMARY">Primary</option>
                  <option value="HIGH">High</option>
                  <option value="COMBINED">Combined</option>
                </select>
              </Field>
              <Field label="EMIS number" hint="6–9 digits">
                <input required pattern="\d{6,9}" value={form.emisNo} onChange={(e) => setForm({ ...form, emisNo: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" busy={busy}>
                Add School
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden">
        <Table headers={["Name", "Type", "EMIS No.", "Applications", "Pending", "Enrolled", "Capacity"]}>
          {schools.map((s) => {
            const st = statsFor(s.id);
            return (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-4 py-2.5 text-slate-700">{s.name}</td>
                <td className="px-4 py-2.5 text-slate-500">{schoolTypeLabel(s.type)}</td>
                <td className="px-4 py-2.5 text-slate-500">{s.emisNo}</td>
                <td className="px-4 py-2.5 text-slate-500">{st?.applications ?? 0}</td>
                <td className="px-4 py-2.5 text-slate-500">{st?.pending ?? 0}</td>
                <td className="px-4 py-2.5 text-slate-500">{st?.enrolled ?? 0}</td>
                <td className="px-4 py-2.5 text-slate-500">{st?.capacity ?? 0}</td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
