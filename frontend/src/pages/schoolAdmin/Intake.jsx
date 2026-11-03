import { useNavigate } from "react-router-dom";
import { Plus, School } from "lucide-react";
import { Button, Card, EmptyState, ErrorState, PageHeader, StatusBadge } from "../../components/ui.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import { intakeApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDate } from "../../utils/format.js";

export default function AdminIntake() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: intakes, loading, error, reload } = useApi(() => intakeApi.list({ schoolId: user.schoolId }), [user.schoolId]);

  return (
    <div>
      <PageHeader title="School & Intake" subtitle="Registration windows, capacity and required documents per grade.">
        <Button onClick={() => navigate("/schoolAdmin/intake/new")}>
          <Plus size={15} /> Configure Intake
        </Button>
      </PageHeader>

      {loading ? (
        <TableSkeleton rows={3} />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : intakes.length === 0 ? (
        <Card>
          <EmptyState icon={School} title="No intakes yet" body='Click "Configure Intake" to open a grade for applications.' />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {intakes.map((i) => (
            <Card key={i.id} className="p-4 cursor-pointer hover:border-blue-300" onClick={() => navigate(`/schoolAdmin/intake/${i.id}`)}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-slate-800">
                  {i.grade} · {i.year}
                </div>
                <StatusBadge status={i.open ? "ACCEPTED" : "DRAFT"} label={i.open ? "Open" : "Closed"} />
              </div>
              <div className="text-xs text-slate-500">
                {formatDate(i.openDate)} — {formatDate(i.closeDate)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {i.acceptedCount} of {i.capacity} places taken · {i.applicationCount} applications
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (i.acceptedCount / i.capacity) * 100)}%` }} />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {i.requiredDocuments.map((d) => (
                  <span key={d} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {d}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
