import { Users } from "lucide-react";
import { Card, EmptyState, ErrorState, PageHeader, Table } from "../../components/ui.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import { learnerApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDate } from "../../utils/format.js";

/** Learners currently enrolled at this school. */
export default function AdminLearners() {
  const { user } = useAuth();
  const { data: learners, loading, error, reload } = useApi(() => learnerApi.list(), []);

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  return (
    <div>
      <PageHeader title="Enrolled Learners" subtitle={`${learners.length} learners at ${user.schoolName}`} />
      <Card className="overflow-hidden">
        {learners.length === 0 ? (
          <EmptyState icon={Users} title="No learners enrolled yet" body="Learners appear here once you confirm their enrolment." />
        ) : (
          <Table headers={["Learner", "Grade", "Date of Birth", "Guardian"]}>
            {learners.map((l) => (
              <tr key={l.id} className="border-t border-slate-100">
                <td className="px-4 py-2.5 text-slate-700">{l.name}</td>
                <td className="px-4 py-2.5 text-slate-500">{l.currentGrade}</td>
                <td className="px-4 py-2.5 text-slate-500">{formatDate(l.dateOfBirth)}</td>
                <td className="px-4 py-2.5 text-slate-500">{l.guardianName}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
