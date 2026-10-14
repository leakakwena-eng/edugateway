import { Card, initials } from "../../components/ui.jsx";
import { GUARDIAN } from "../../data/seed";

export default function GuardianProfile() {
  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Profile</h1>
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
            {initials(GUARDIAN.name)}
          </div>
          <div>
            <div className="font-medium text-slate-800">{GUARDIAN.name}</div>
            <div className="text-xs text-slate-500">Guardian</div>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Full Name</label>
          <input
            defaultValue={GUARDIAN.name}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input
            defaultValue={GUARDIAN.email}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Phone</label>
          <input
            defaultValue={GUARDIAN.phone}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </Card>
    </div>
  );
}