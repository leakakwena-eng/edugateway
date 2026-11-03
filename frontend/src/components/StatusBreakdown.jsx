import { Card } from "./ui.jsx";
import { APPLICATION_STATUSES } from "../constants.js";
import { statusLabel } from "../utils/format.js";

/** Horizontal bars of application counts by status, from a {STATUS: count} map. */
export default function StatusBreakdown({ byStatus, total }) {
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Applications by Status</h2>
      <div className="space-y-3">
        {APPLICATION_STATUSES.map((st) => {
          const count = byStatus[st] ?? 0;
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <div key={st}>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{statusLabel(st)}</span>
                <span>{count}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
