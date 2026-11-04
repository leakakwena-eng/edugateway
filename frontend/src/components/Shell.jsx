import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FilePlus, Users, ClipboardList, ArrowLeftRight, School,
  FileText, Bell, User, HelpCircle, Settings, BarChart3, History,
  Building2, LogOut, Menu, X,
} from "lucide-react";
import { ROLE_HOME, useAuth } from "../context/AuthContext.jsx";
import { notificationApi } from "../api/index.js";
import { Avatar } from "./ui.jsx";
import { Logo } from "./Illustrations.jsx";

const NAV = {
  GUARDIAN: [
    { to: "dashboard", label: "Home", icon: LayoutDashboard },
    { to: "new-application", label: "New Application", icon: FilePlus },
    { to: "learners", label: "My Learners", icon: Users },
    { to: "applications", label: "Applications", icon: ClipboardList },
    { to: "documents", label: "Documents", icon: FileText },
    { to: "notifications", label: "Notifications", icon: Bell },
    { divider: true },
    { to: "profile", label: "Profile", icon: User },
    { to: "help", label: "Help & Support", icon: HelpCircle },
  ],
  SCHOOL_ADMIN: [
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "applications", label: "Applications", icon: ClipboardList },
    { to: "transfers", label: "Transfers", icon: ArrowLeftRight },
    { to: "documents", label: "Documents", icon: FileText },
    { to: "learners", label: "Learners", icon: Users },
    { to: "intake", label: "School & Intake", icon: School },
    { to: "reports", label: "Reports", icon: BarChart3 },
    { to: "notifications", label: "Notifications", icon: Bell },
    { divider: true },
    { to: "settings", label: "Settings", icon: Settings },
  ],
  DISTRICT_ADMIN: [
    { to: "dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "applications", label: "Applications", icon: ClipboardList },
    { to: "schools", label: "Schools", icon: Building2 },
    { to: "reports", label: "Reports", icon: BarChart3 },
    { to: "auditLog", label: "Audit Log", icon: History },
    { to: "notifications", label: "Notifications", icon: Bell },
    { divider: true },
    { to: "settings", label: "Settings", icon: Settings },
  ],
};

const ROLE_TITLE = {
  GUARDIAN: () => "Guardian",
  SCHOOL_ADMIN: (u) => u.schoolName,
  DISTRICT_ADMIN: () => "District Office",
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

function Sidebar({ user, unread, onNavigate, onSignOut }) {
  return (
    <div className="relative h-full flex flex-col bg-brand-950 overflow-hidden">
      {/* sunrise glow behind the logo */}
      <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-sun-500/25 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dots pointer-events-none" />

      <div className="relative px-5 pt-6 pb-5">
        <Logo light />
      </div>

      <nav className="relative flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {NAV[user.role].map((item, i) =>
          item.divider ? (
            <div key={`d${i}`} className="my-3 mx-3 border-t border-white/10" />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-brand-100/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-sunrise" />}
                  <item.icon size={18} className={isActive ? "text-sun-300" : ""} />
                  <span className="flex-1">{item.label}</span>
                  {item.to === "notifications" && unread > 0 && (
                    <span className="min-w-5 h-5 px-1.5 text-[11px] font-bold bg-sunrise text-white rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        )}
      </nav>

      <div className="relative m-3 p-3 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center gap-3">
        <Avatar name={user.name} size="sm" className="ring-brand-950" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white truncate">{user.name}</div>
          <div className="text-xs text-brand-100/60 truncate">{ROLE_TITLE[user.role](user)}</div>
        </div>
        <button
          onClick={onSignOut}
          className="p-2 rounded-lg text-brand-100/60 hover:text-white hover:bg-white/10"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Shell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = useUnreadCount();
  const base = `/${ROLE_HOME[user.role]}`;

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block w-64 shrink-0 sticky top-0 h-screen">
        <Sidebar user={user} unread={unread} onSignOut={signOut} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-drawer shadow-lift">
            <Sidebar user={user} unread={unread} onNavigate={() => setMobileOpen(false)} onSignOut={signOut} />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-canvas/80 backdrop-blur-md border-b border-stone-200/70 px-4 md:px-8 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl hover:bg-stone-200/60"
              aria-label="Open menu"
            >
              <Menu size={20} className="text-stone-700" />
            </button>
            <div className="text-sm text-stone-500 truncate">
              <span className="hidden sm:inline">EduGateway · </span>
              <span className="font-medium text-stone-700">{ROLE_TITLE[user.role](user)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`${base}/notifications`}
              className="relative p-2.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/60"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-sunrise ring-2 ring-canvas" />
              )}
            </Link>
            <Avatar name={user.name} size="sm" />
          </div>
        </header>

        <main key={location.pathname} className="flex-1 px-4 md:px-8 py-6 md:py-8 animate-fade-up">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
