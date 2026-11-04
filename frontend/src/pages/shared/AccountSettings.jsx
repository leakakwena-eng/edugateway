import { Avatar, Card, PageHeader } from "../../components/ui.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const ROLE_NAMES = { SCHOOL_ADMIN: "School Admin", DISTRICT_ADMIN: "District Admin" };

/** Staff account details. Staff accounts are managed by the district, so this page is read-only. */
export default function AccountSettings() {
  const { user } = useAuth();
  const rows = [
    ["Name", user.name],
    ["Email", user.email],
    ["Role", ROLE_NAMES[user.role]],
    user.schoolName && ["School", user.schoolName],
  ].filter(Boolean);

  return (
    <div className="max-w-lg">
      <PageHeader title="Settings" subtitle="Your staff account" />
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Avatar name={user.name} size="lg" />
          <div>
            <div className="font-medium text-stone-800">{user.name}</div>
            <div className="text-xs text-stone-500">{ROLE_NAMES[user.role]}</div>
          </div>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-stone-500">{k}</dt>
              <dd className="text-stone-800">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-stone-400 mt-5 pt-4 border-t border-stone-100">
          Staff accounts are managed by the district office. Contact them to change your details.
        </p>
      </Card>
    </div>
  );
}
