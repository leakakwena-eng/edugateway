import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FilePlus, Users, ClipboardList, ArrowLeftRight, School,
  FileText, Bell, User, HelpCircle, Settings, BarChart3, History,
  GraduationCap, Building2, LogOut, RotateCcw, Menu, X,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { SCHOOLS, SCHOOL_ADMINS, GUARDIAN, DISTRICT_ADMIN } from "../data/seed";
import { initials } from "./ui.jsx";

const NAV = {
  guardian: [
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "new-application", label: "New Application", icon: FilePlus },
    { to: "learners", label: "My Learners", icon: Users },
    { to: "applications", label: "Applications", icon: ClipboardList },
    { to: "documents", label: "Documents", icon: FileText },
    { to: "notifications", label: "Notifications", icon: Bell },
    { to: "profile", label: "Profile", icon: User },
    { to: "help", label: "Help & Support", icon: HelpCircle },
  ],
  schoolAdmin: [
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
  districtAdmin: [
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "applications", label: "Applications", icon: ClipboardList },
    { to: "schools", label: "Schools", icon: Building2 },
    { to: "reports", label: "Reports", icon: BarChart3 },
    { to: "auditLog", label: "Audit Log", icon: History },
    { to: "notifications", label: "Notifications", icon: Bell },
    { to: "settings", label: "Settings", icon: Settings },
  ],
};

export default function Shell() {
  const { session, logout, resetDemo } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = session.role;

  const meta = (() => {
    if (role === "schoolAdmin") {
      const admin = SCHOOL_ADMINS[session.schoolId];
      const school = SCHOOLS.find((s) => s.id === session.schoolId);
      return {
        name: admin?.name || "Admin",
        title: `School Admin · ${school?.name || "—"}`,
      };
    }
    if (role === "districtAdmin") {
      return { name: DISTRICT_ADMIN.name, title: "District Admin" };
    }
    return { name: GUARDIAN.name, title: "Guardian" };
  })();

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}

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
          <button className="md:hidden text-slate-400" onClick={closeMobile}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV[role].map((item) => (
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
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-3 space-y-1">
          <button
            onClick={() => {
              resetDemo();
              navigate("/login");
            }}
            className="w-full flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 px-2 py-2 rounded-lg hover:bg-slate-800"
          >
            <RotateCcw size={13} /> Reset demo data
          </button>
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
            >
              <Menu size={18} className="text-slate-600" />
            </button>
            <div className="text-sm text-slate-500">EduGateway · {meta.title}</div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-slate-100 relative">
              <Bell size={18} className="text-slate-500" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                {initials(meta.name)}
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="text-sm font-medium text-slate-800">{meta.name}</div>
                <div className="text-xs text-slate-500">{meta.title}</div>
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