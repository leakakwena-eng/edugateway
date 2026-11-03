import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, StatusBadge, Table } from "./ui.jsx";
import { SearchInput, StatusFilter } from "./TableControls.jsx";
import { APPLICATION_STATUSES } from "../constants.js";
import { formatDate, typeLabel } from "../utils/format.js";

const COLUMNS = {
  reference: { header: "ID", cell: (a) => <span className="text-slate-500">{a.reference}</span> },
  learner: { header: "Learner", cell: (a) => <span className="text-slate-700">{a.learnerName}</span> },
  guardian: { header: "Guardian", cell: (a) => a.guardianName },
  type: { header: "Type", cell: (a) => typeLabel(a.type) },
  school: { header: "School", cell: (a) => a.schoolName },
  grade: { header: "Grade", cell: (a) => `${a.grade} · ${a.year}` },
  status: { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
  submitted: { header: "Submitted", cell: (a) => formatDate(a.submittedAt) },
};

/**
 * Searchable, filterable application list. Rows link to `${basePath}/${id}`.
 * `columns` picks from: reference, learner, guardian, type, school, grade, status, submitted.
 */
export default function ApplicationsTable({
  applications,
  basePath,
  columns = ["reference", "learner", "type", "school", "status", "submitted"],
  filters = true,
  emptyText = "No applications yet.",
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications
      .filter((a) => !status || a.status === status)
      .filter(
        (a) =>
          !q ||
          a.learnerName.toLowerCase().includes(q) ||
          a.reference.toLowerCase().includes(q) ||
          a.schoolName.toLowerCase().includes(q)
      );
  }, [applications, search, status]);

  return (
    <div>
      {filters && (
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search learner, school or ID..." />
          <StatusFilter value={status} onChange={setStatus} statuses={APPLICATION_STATUSES} />
        </div>
      )}
      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {search || status ? "No applications match your filters." : emptyText}
          </div>
        ) : (
          <Table headers={columns.map((c) => COLUMNS[c].header)}>
            {rows.map((a) => (
              <tr
                key={a.id}
                onClick={() => navigate(`${basePath}/${a.id}`)}
                className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
              >
                {columns.map((c) => (
                  <td key={c} className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                    {COLUMNS[c].cell(a)}
                  </td>
                ))}
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
