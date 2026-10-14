import { Card, StatusBadge } from "../../components/ui.jsx";
import { SCHOOLS } from "../../data/seed";

export default function DistrictSchools() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Schools</h1>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">Name</th>
              <th className="text-left font-medium px-4 py-2.5">Type</th>
              <th className="text-left font-medium px-4 py-2.5">EMIS No.</th>
              <th className="text-left font-medium px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {SCHOOLS.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-4 py-2.5 text-slate-700">{s.name}</td>
                <td className="px-4 py-2.5 text-slate-500">{s.type}</td>
                <td className="px-4 py-2.5 text-slate-500">{s.emis}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge status="Verified" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}