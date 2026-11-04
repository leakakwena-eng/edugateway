import { useNavigate } from "react-router-dom";
import { Card, EmptyState, ErrorState, PageHeader, StatusBadge, Table } from "../../components/ui.jsx";
import { JourneyArt } from "../../components/Illustrations.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import { TransferRoute } from "../../components/ApplicationParts.jsx";
import { transferApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDate } from "../../utils/format.js";

export default function AdminTransfers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: transfers, loading, error, reload } = useApi(() => transferApi.list(), []);

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  return (
    <div>
      <PageHeader title="Transfers" subtitle="Learners transferring into or out of your school." />
      <Card className="overflow-hidden">
        {transfers.length === 0 ? (
          <EmptyState art={JourneyArt} title="No transfers yet" body="Transfer requests involving your school will appear here." />
        ) : (
          <Table headers={["Application", "Learner", "Your role", "Route", "Records", "Application status", "Submitted"]}>
            {transfers.map((t) => (
              <tr
                key={t.id}
                onClick={() => navigate(`/schoolAdmin/transfers/${t.id}`)}
                className="border-t border-stone-100 hover:bg-stone-50 cursor-pointer"
              >
                <td className="px-4 py-2.5 text-stone-500">{t.applicationRef}</td>
                <td className="px-4 py-2.5 text-stone-700">{t.learnerName}</td>
                <td className="px-4 py-2.5 text-stone-500">
                  {t.sendingSchoolId === user.schoolId ? "Sending" : "Receiving"}
                </td>
                <td className="px-4 py-2.5 text-stone-500 whitespace-nowrap">
                  <TransferRoute from={t.sendingSchoolName} to={t.receivingSchoolName} />
                </td>
                <td className="px-4 py-2.5"><StatusBadge status={t.releaseStatus} /></td>
                <td className="px-4 py-2.5"><StatusBadge status={t.applicationStatus} /></td>
                <td className="px-4 py-2.5 text-stone-500">{formatDate(t.submittedAt)}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
