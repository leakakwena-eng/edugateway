import { Card } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { SCHOOLS, AUDIT_LOG } from "../../data/seed";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";

export default function DistrictDashboard() {
  const { applications } = useApp();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 400);
  return () => clearTimeout(timer);
}, []);

  const transfersInProgress = applications.filter(
    (a) => a.type === "TRANSFER" && a.status !== "Enrolled"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Multi-School Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Monitor all participating schools, applications and transfers in real time.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500 mb-1">Total Applications</div>
          <div className="text-2xl font-semibold text-slate-800">
            {applications.length + 130}
          </div>
          <div className="text-xs text-green-600 mt-1">↑ 12% vs last month</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 mb-1">Transfers in Progress</div>
          <div className="text-2xl font-semibold text-slate-800">
            {transfersInProgress + 30}
          </div>
          <div className="text-xs text-green-600 mt-1">↑ 8% vs last month</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 mb-1">Schools Onboarded</div>
          <div className="text-2xl font-semibold text-slate-800">{SCHOOLS.length}</div>
          <div className="text-xs text-green-600 mt-1">2 new this month</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 overflow-hidden">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Participating Schools</h2>
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium py-1.5">School</th>
                <th className="text-left font-medium py-1.5">Type</th>
                <th className="text-left font-medium py-1.5">EMIS</th>
              </tr>
            </thead>
            <tbody>
              {SCHOOLS.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="py-2 text-slate-700">{s.name}</td>
                  <td className="py-2 text-slate-500">{s.type}</td>
                  <td className="py-2 text-slate-500">{s.emis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Recent Audit Activity</h2>
          <div className="space-y-2.5">
            {AUDIT_LOG.slice(0, 5).map((e, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-700">{e.action}</span>
                  <span className="text-slate-400"> · {e.entity}</span>
                </div>
                <div className="text-xs text-slate-400">{e.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}