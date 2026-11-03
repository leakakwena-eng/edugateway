import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FilePlus, Users, ClipboardList, ArrowLeftRight, School,
  FileText, Bell, User, HelpCircle, Settings, BarChart3, History,
  GraduationCap, Building2, LogOut, Menu, X,
} from "lucide-react";
import { ROLE_HOME, useAuth } from "../context/AuthContext.jsx";
import { notificationApi } from "../api/index.js";
import { initials } from "../utils/format.js";

const NAV = {
  GUARDIAN: [
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "new-application", label: "New Application", icon: FilePlus },
    { to: "learners", label: "My Learners", icon: Users },
    { to: "applications", label: "Applications", icon: ClipboardList },
    { to: "documents", label: "Documents", icon: FileText },
    { to: "notifications", label: "Notifications", icon: Bell },
    { to: "profile", label: "Profile", icon: User },
    { to: "help", label: "Help & Support", icon: HelpCircle },
  ],
  SCHOOL_ADMIN: [
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "applications", label: "Applications", icon: ClipboardList },
    { to: "learners", label: "Learners", icon: Users },
    { to: "transfers", label: "Transfers", icon: ArrowLeftRight },
    { to: "intake", label: "School & Intake", icon: School },
    { to: "documents", label: "Documents", icon: FileText },
    { to: "reports", label: "Reports", icon: BarChart3 },
    { to: "notifications", label: "Notifications", icon: Bell },
    { to: "settings", label: "Settings", icon: Settings },
  ],
  DISTRICT_ADMIN: [
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "applications", label: "Applications", icon: ClipboardList },
    { to: "schools", label: "Schools", icon: Building2 },
    { to: "reports", label: "Reports", icon: BarChart3 },
    { to: "auditLog", label: "Audit Log", icon: History },
    { to: "notifications", label: "Notifications", icon: Bell },
    { to: "settings", label: "Settings", icon: Settings },
  ],
};

const ROLE_TITLE = {
  GUARDIAN: () => "Guardian",
  SCHOOL_ADMIN: (u) => `School Admin · ${u.schoolName}`,
  DISTRICT_ADMIN: () => "District Admin",
};

/** Unread notification count, refreshed on every page change. */
function useUnreadCount() {
  const location = useLocation();
  const [count, setCount] = useState(0);
  useEffect(() => {
    let active = true;
    notificationApi
      .list()
      .then((items) => active && setCount(items.filter((n) => !n.read).length))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [location.pathname]);
  return count;
}

export default function Shell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = useUnreadCount();
  const base = `/${ROLE_HOME[user.role]}`;
  const title = ROLE_TITLE[user.role](user);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      {mobileOpen && <div className="fixed inset-0 bg-slate-900/50 z-30 md:hidden" onClick={closeMobile} />}

      <aside
        className={`fixed md:static inset-y-0 left-0 w-60 bg-slate-900 flex flex-col shrink-0 z-40 transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg">EduGateway</span>
          </div>
          <button className="md:hidden text-slate-400" onClick={closeMobile} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV[user.role].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobile}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <item.icon size={17} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.to === "notifications" && unread > 0 && (
                <span className="text-[10px] font-semibold bg-red-500 text-white rounded-full px-1.5 py-0.5">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-2 py-2 rounded-lg hover:bg-slate-800"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between bg-white border-b border-slate-200 px-4 md:px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu size={18} className="text-slate-600" />
            </button>
            <div className="text-sm text-slate-500">EduGateway · {title}</div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to={`${base}/notifications`}
              className="p-2 rounded-lg hover:bg-slate-100 relative"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-slate-500" />
              {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />}
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                {initials(user.name)}
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="text-sm font-medium text-slate-800">{user.name}</div>
                <div className="text-xs text-slate-500">{title}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
