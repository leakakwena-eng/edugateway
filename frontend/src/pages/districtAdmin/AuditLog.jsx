import { useMemo, useState } from "react";
import { Card, ErrorState, PageHeader, Table } from "../../components/ui.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import { SearchInput } from "../../components/TableControls.jsx";
import { reportApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { actionLabel, formatDateTime } from "../../utils/format.js";

export default function DistrictAuditLog() {
  const [search, setSearch] = useState("");
  const { data, loading, error, reload } = useApi(() => reportApi.audit(500), []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter(
      (e) =>
        !q ||
        [e.actorName, e.entityRef, actionLabel(e.action), e.details].some((v) => v?.toLowerCase().includes(q))
    );
  }, [data, search]);

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="The 500 most recent actions across the system.">
        <SearchInput value={search} onChange={setSearch} placeholder="Search user, record or action..." />
      </PageHeader>
      {loading ? (
        <TableSkeleton rows={8} />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <Card className="overflow-hidden">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-stone-500">No matching audit entries.</div>
          ) : (
            <Table headers={["Time", "User", "Record", "Action", "Details"]}>
              {rows.map((e) => (
                <tr key={e.id} className="border-t border-stone-100">
                  <td className="px-4 py-2.5 text-stone-500 whitespace-nowrap">{formatDateTime(e.timestamp)}</td>
                  <td className="px-4 py-2.5 text-stone-700">{e.actorName}</td>
                  <td className="px-4 py-2.5 text-stone-500">{e.entityRef}</td>
                  <td className="px-4 py-2.5 text-stone-500">{actionLabel(e.action)}</td>
                  <td className="px-4 py-2.5 text-stone-400">{e.details}</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      )}
    </div>
  );
}
