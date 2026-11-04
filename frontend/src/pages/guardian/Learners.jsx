import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Avatar, Button, Card, EmptyState, ErrorState, PageHeader } from "../../components/ui.jsx";
import { BackpackArt } from "../../components/Illustrations.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import LearnerForm, { EMPTY_LEARNER, toLearnerRequest } from "../../components/LearnerForm.jsx";
import { applicationApi, learnerApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDate } from "../../utils/format.js";

export default function GuardianLearners() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useApi(
    () => Promise.all([learnerApi.list(), applicationApi.list()]),
    []
  );
  const [editing, setEditing] = useState(null); // null | "new" | learner id
  const [form, setForm] = useState(EMPTY_LEARNER);
  const [busy, setBusy] = useState(false);

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const [learners, applications] = data;

  const startEdit = (learner) => {
    setEditing(learner ? learner.id : "new");
    setForm(
      learner
        ? { name: learner.name, dateOfBirth: learner.dateOfBirth ?? "", idNumber: learner.idNumber ?? "", gender: learner.gender ?? "" }
        : EMPTY_LEARNER
    );
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = toLearnerRequest(form);
      if (editing === "new") await learnerApi.create(body);
      else await learnerApi.update(editing, body);
      toast.success(editing === "new" ? "Learner added" : "Learner updated", body.name);
      setEditing(null);
      reload();
    } catch (err) {
      toast.error("Couldn't save learner", err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Learners">
        <Button onClick={() => startEdit(null)}>
          <Plus size={15} /> Add Learner
        </Button>
      </PageHeader>

      {editing && (
        <Card className="p-5 mb-4 max-w-2xl">
          <form onSubmit={save}>
            <h2 className="text-sm font-semibold text-stone-700 mb-3">
              {editing === "new" ? "Add a learner" : "Edit learner"}
            </h2>
            <LearnerForm value={form} onChange={setForm} />
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" busy={busy}>
                Save
              </Button>
            </div>
          </form>
        </Card>
      )}

      {learners.length === 0 ? (
        <Card>
          <EmptyState art={BackpackArt} title="No learners yet" body="Add a learner to start an application for them." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {learners.map((l) => {
            const apps = applications.filter((a) => a.learnerId === l.id);
            return (
              <Card key={l.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={l.name} />
                  <div className="min-w-0">
                    <div className="font-medium text-stone-800">{l.name}</div>
                    <div className="text-xs text-stone-500">
                      Born {formatDate(l.dateOfBirth)}
                      {l.currentSchoolName && ` · ${l.currentGrade}, ${l.currentSchoolName}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    {apps.length} application{apps.length === 1 ? "" : "s"} on record
                  </span>
                  <span className="flex gap-3">
                    <button onClick={() => startEdit(l)} className="text-stone-500 hover:text-stone-700">
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/guardian/new-application?learnerId=${l.id}`)}
                      className="text-brand-600 font-medium hover:underline"
                    >
                      Apply
                    </button>
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
