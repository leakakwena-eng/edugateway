import { Card, CardTitle } from "./ui.jsx";
import { APPLICATION_STATUSES } from "../constants.js";
import { statusLabel } from "../utils/format.js";

const BAR = {
  SUBMITTED: "bg-sky-400",
  UNDER_REVIEW: "bg-sky-600",
  ACCEPTED: "bg-brand-400",
  WAITLISTED: "bg-sun-400",
  REJECTED: "bg-rose-400",
  ENROLLED: "bg-brand-700",
};

/** Stacked overview bar plus per-status rows, from a {STATUS: count} map. */
export default function StatusBreakdown({ byStatus, total }) {
  return (
    <Card className="p-6">
      <CardTitle action={<span className="text-xs text-stone-400">{total} total</span>}>Applications by status</CardTitle>
      <div className="flex h-3 rounded-full overflow-hidden bg-stone-100 mb-6">
        {APPLICATION_STATUSES.map((st) =>
          byStatus[st] ? (
            <div
              key={st}
              className={`${BAR[st]} transition-all duration-700`}
              style={{ width: `${(byStatus[st] / total) * 100}%` }}
              title={`${statusLabel(st)}: ${byStatus[st]}`}
            />
          ) : null
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
        {APPLICATION_STATUSES.map((st) => {
          const count = byStatus[st] ?? 0;
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <div key={st}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2 text-stone-600">
                  <span className={`w-2.5 h-2.5 rounded-full ${BAR[st]}`} />
                  {statusLabel(st)}
                </span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {count} <span className="text-xs font-normal text-stone-400">· {pct}%</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div className={`h-full ${BAR[st]} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
