import { FileText } from "lucide-react";
import { Card, StatusBadge } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export default function AdminDocuments() {
  const { session, applications, learners } = useApp();

  const docs = applications
    .filter((a) => a.schoolId === session.schoolId)
    .flatMap((a) =>
      (a.documents || []).map((d) => ({
        ...d,
        appId: a.id,
        learner: learners.find((l) => l.id === a.learnerId)?.name || "—",
      }))
    );

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Documents</h1>
      <Card className="overflow-hidden">
        {docs.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No documents for this school yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Document</th>
                <th className="text-left font-medium px-4 py-2.5">Learner</th>
                <th className="text-left font-medium px-4 py-2.5">Application</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 text-slate-700">
                    <span className="flex items-center gap-2">
                      <FileText size={14} className="text-slate-400" />
                      {d.name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{d.learner}</td>
                  <td className="px-4 py-2.5 text-slate-500">{d.appId}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}