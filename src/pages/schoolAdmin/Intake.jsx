import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export default function AdminIntake() {
  const navigate = useNavigate();
  const { session, intakes } = useApp();
  const mine = intakes.filter((i) => i.schoolId === session.schoolId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-slate-800">School & Intake</h1>
        <button
          onClick={() => navigate("/schoolAdmin/intake/new")}
          className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 px-3.5 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={15} /> Configure Intake
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mine.map((i) => (
          <Card
            key={i.id}
            className="p-4 cursor-pointer hover:border-blue-300"
            onClick={() => navigate(`/schoolAdmin/intake/${i.id}`)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-slate-800">
                {i.grade} · {i.year}
              </div>
              <span className="text-xs text-slate-500">{i.capacity} seats</span>
            </div>
            <div className="text-xs text-slate-500">
              Open {i.openDate} — Close {i.closeDate}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {i.requiredDocs.map((d) => (
                <span
                  key={d}
                  className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                >
                  {d}
                </span>
              ))}
            </div>
          </Card>
        ))}
        {mine.length === 0 && (
          <Card className="p-6 text-center text-sm text-slate-500 col-span-full">
            No intakes configured yet. Click "Configure Intake" to create one.
          </Card>
        )}
      </div>
    </div>
  );
}