import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import { Button, Card, EmptyState, ErrorState, PageHeader } from "../../components/ui.jsx";
import { TableSkeleton } from "../../components/Skeleton.jsx";
import { notificationApi } from "../../api/index.js";
import { useApi } from "../../hooks/useApi.js";
import { ROLE_HOME, useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatRelative } from "../../utils/format.js";

/** Inbox for every role; the backend decides whose notifications these are. */
export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: items, loading, error, reload, setData } = useApi(() => notificationApi.list(), []);

  const markRead = (n) => {
    if (n.read) return;
    setData((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    notificationApi.markRead(n.id).catch(() => {});
  };

  const open = (n) => {
    markRead(n);
    if (n.applicationId) {
      navigate(`/${ROLE_HOME[user.role]}/applications/${n.applicationId}`);
    }
  };

  const markAll = async () => {
    try {
      await notificationApi.markAllRead();
      setData((list) => list.map((x) => ({ ...x, read: true })));
    } catch (e) {
      toast.error("Couldn't update notifications", e.message);
    }
  };

  if (loading) return <TableSkeleton rows={4} />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Notifications" subtitle={unread ? `${unread} unread` : "You're all caught up."}>
        {unread > 0 && (
          <Button variant="secondary" onClick={markAll}>
            <CheckCheck size={15} /> Mark all as read
          </Button>
        )}
      </PageHeader>
      <Card className="divide-y divide-slate-100">
        {items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications yet" body="Updates about applications will appear here." />
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              onClick={() => open(n)}
              className={`w-full text-left flex items-start gap-3 px-5 py-4 hover:bg-slate-50 ${n.read ? "" : "bg-blue-50/40"}`}
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bell size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  {n.title}
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <div className="text-sm text-slate-500 mt-0.5">{n.body}</div>
              </div>
              <div className="text-xs text-slate-400 shrink-0">{formatRelative(n.createdAt)}</div>
            </button>
          ))
        )}
      </Card>
    </div>
  );
}
