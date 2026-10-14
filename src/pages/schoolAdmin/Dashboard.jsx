import { ClipboardList } from "lucide-react";
import { Card } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { SCHOOLS, CHART_MONTHS, CHART_DATA } from "../../data/seed";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "../../components/Skeleton.jsx";

export default function SchoolAdminDashboard() {
  const { session, applications } = useApp();
  const schoolId = session.schoolId;
  const school = SCHOOLS.find((s) => s.id === schoolId);

  const schoolApps = applications.filter((a) => a.schoolId === schoolId);
  const transfers = applications.filter(
    (a) => a.type === "TRANSFER" && (a.schoolId === schoolId || a.sendingSchoolId === schoolId)
  );

  const kpis = [
    { label: "New Applications This Week", value: schoolApps.filter((a) => a.status === "Submitted").length, color: "bg-blue-600" },
    { label: "Transfers In Progress", value: transfers.filter((a) => a.status !== "Enrolled").length, color: "bg-indigo-600" },
    { label: "Enrolled Learners This Year", value: schoolApps.filter((a) => a.status === "Enrolled").length, color: "bg-purple-600" },
    { label: "Pending Reviews", value: schoolApps.filter((a) => a.status === "Under Review" || a.status === "Submitted").length, color: "bg-amber-600" },
  ];

  const max = Math.max(...CHART_DATA);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{school?.name}</h1>
        <p className="text-sm text-slate-500 mt-0.5">School Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className={`w-9 h-9 rounded-lg ${k.color} flex items-center justify-center text-white mb-3`}>
              <ClipboardList size={16} />
            </div>
            <div className="text-2xl font-semibold text-slate-800">{k.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Application Overview</h2>
        <div className="flex items-end gap-3 h-40">
          {CHART_DATA.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-blue-500 rounded-t-md"
                style={{ height: `${(v / max) * 100}%` }}
              />
              <span className="text-[10px] text-slate-400">{CHART_MONTHS[i]}</span>
            </div>
          ))} 
        </div>
      </Card>
    </div>
  );
}