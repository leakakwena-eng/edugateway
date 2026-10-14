import { Card } from "../../components/ui.jsx";
import { DISTRICT_ADMIN } from "../../data/seed";

export default function DistrictSettings() {
  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Settings</h1>
      <Card className="p-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600">Administrator</label>
          <input
            defaultValue={DISTRICT_ADMIN.name}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">District</label>
          <input
            defaultValue={DISTRICT_ADMIN.title}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700">Email notifications</div>
          <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700">Audit log retention (5 years)</div>
          <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
        </div>
        <button className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </Card>
    </div>
  );
}