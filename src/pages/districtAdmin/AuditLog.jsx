import { Card } from "../../components/ui.jsx";
import { AUDIT_LOG } from "../../data/seed";

export default function DistrictAuditLog() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-1">Audit Log</h1>
      <p className="text-sm text-slate-500 mb-4">
        Five-year browsable history of every action in the system.
      </p>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">Time</th>
              <th className="text-left font-medium px-4 py-2.5">User</th>
              <th className="text-left font-medium px-4 py-2.5">Entity</th>
              <th className="text-left font-medium px-4 py-2.5">Action</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOG.map((e, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-4 py-2.5 text-slate-500">{e.time}</td>
                <td className="px-4 py-2.5 text-slate-700">{e.user}</td>
                <td className="px-4 py-2.5 text-slate-500">{e.entity}</td>
                <td className="px-4 py-2.5 text-slate-500">{e.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}