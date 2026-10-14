import { Bell } from "lucide-react";
import { Card } from "../../components/ui.jsx";
import { INITIAL_NOTIFICATIONS } from "../../data/seed";

export default function AdminNotifications() {
  const items = INITIAL_NOTIFICATIONS.schoolAdmin;
  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Notifications</h1>
      <Card className="divide-y divide-slate-100">
        {items.map((n, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bell size={15} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">{n.title}</div>
              <div className="text-sm text-slate-500 mt-0.5">{n.body}</div>
            </div>
            <div className="text-xs text-slate-400 shrink-0">{n.time}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}