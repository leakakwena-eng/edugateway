import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, initials } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export default function GuardianLearners() {
  const { learners, applications, addLearner } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-slate-800">My Learners</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 px-3.5 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={15} /> Add Learner
        </button>
      </div>

      {showForm && (
        <Card className="p-4 mb-4 flex items-center gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Learner full name"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={() => {
              if (name.trim()) {
                addLearner(name.trim());
                setName("");
                setShowForm(false);
              }
            }}
            className="text-sm font-medium text-white bg-blue-600 px-3.5 py-2 rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="text-sm text-slate-500 px-2"
          >
            Cancel
          </button>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {learners.map((l) => {
          const apps = applications.filter((a) => a.learnerId === l.id);
          return (
            <Card key={l.id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                  {initials(l.name)}
                </div>
                <div>
                  <div className="font-medium text-slate-800">{l.name}</div>
                  <div className="text-xs text-slate-500">
                    {l.grade} · DOB {l.dob}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                {apps.length} application{apps.length === 1 ? "" : "s"} on record
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}