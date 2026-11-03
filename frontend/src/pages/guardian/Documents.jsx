import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { Card, EmptyState, ErrorState, PageHeader, StatusBadge, Table } from "../../components/ui.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import { documentApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDate } from "../../utils/format.js";

/** Every document uploaded for the guardian's applications. */
export default function GuardianDocuments() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: docs, loading, error, reload } = useApi(() => documentApi.list(), []);

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  return (
    <div>
      <PageHeader title="Documents" subtitle="Upload or replace documents from each application's page." />
      <Card className="overflow-hidden">
        {docs.length === 0 ? (
          <EmptyState icon={FileText} title="No documents yet" body="Documents you upload with an application appear here." />
        ) : (
          <Table headers={["Document", "Learner", "Application", "Uploaded", "Status"]}>
            {docs.map((d) => (
              <tr key={d.id} className="border-t border-slate-100">
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => documentApi.open(d.id).catch((e) => toast.error("Couldn't open document", e.message))}
                    className="flex items-center gap-2 text-slate-700 hover:text-blue-600"
                  >
                    <FileText size={14} className="text-slate-400" />
                    {d.type}
                  </button>
                  {d.status === "REJECTED" && d.rejectionReason && (
                    <div className="text-xs text-red-600 mt-0.5">{d.rejectionReason}</div>
                  )}
                </td>
                <td className="px-4 py-2.5 text-slate-500">{d.learnerName}</td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => navigate(`/guardian/applications/${d.applicationId}`)}
                    className="text-blue-600 hover:underline"
                  >
                    {d.applicationRef}
                  </button>
                </td>
                <td className="px-4 py-2.5 text-slate-500">{formatDate(d.uploadedAt)}</td>
                <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
