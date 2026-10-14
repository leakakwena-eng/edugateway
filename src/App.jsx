import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext.jsx";
import Shell from "./components/Shell.jsx";
import Login from "./pages/Login.jsx";
import Help from "./pages/Help.jsx";

import GuardianDashboard from "./pages/guardian/Dashboard.jsx";
import GuardianNewApplication from "./pages/guardian/NewApplication.jsx";
import GuardianLearners from "./pages/guardian/Learners.jsx";
import GuardianApplications from "./pages/guardian/Applications.jsx";
import GuardianApplicationDetail from "./pages/guardian/ApplicationDetail.jsx";
import GuardianDocuments from "./pages/guardian/Documents.jsx";
import GuardianNotifications from "./pages/guardian/Notifications.jsx";
import GuardianProfile from "./pages/guardian/Profile.jsx";

import AdminDashboard from "./pages/schoolAdmin/Dashboard.jsx";
import AdminApplications from "./pages/schoolAdmin/Applications.jsx";
import AdminApplicationDetail from "./pages/schoolAdmin/ApplicationDetail.jsx";
import AdminLearners from "./pages/schoolAdmin/Learners.jsx";
import AdminTransfers from "./pages/schoolAdmin/Transfers.jsx";
import AdminTransferDetail from "./pages/schoolAdmin/TransferDetail.jsx";
import AdminIntake from "./pages/schoolAdmin/Intake.jsx";
import AdminConfigureIntake from "./pages/schoolAdmin/ConfigureIntake.jsx";
import AdminDocuments from "./pages/schoolAdmin/Documents.jsx";
import AdminReports from "./pages/schoolAdmin/Reports.jsx";
import AdminNotifications from "./pages/schoolAdmin/Notifications.jsx";
import AdminSettings from "./pages/schoolAdmin/Settings.jsx";

import DistrictDashboard from "./pages/districtAdmin/Dashboard.jsx";
import DistrictApplications from "./pages/districtAdmin/Applications.jsx";
import DistrictApplicationDetail from "./pages/districtAdmin/ApplicationDetail.jsx";
import DistrictSchools from "./pages/districtAdmin/Schools.jsx";
import DistrictReports from "./pages/districtAdmin/Reports.jsx";
import DistrictAuditLog from "./pages/districtAdmin/AuditLog.jsx";
import DistrictNotifications from "./pages/districtAdmin/Notifications.jsx";
import DistrictSettings from "./pages/districtAdmin/Settings.jsx";

function RequireRole({ role, children }) {
  const { session } = useApp();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== role) return <Navigate to={`/${session.role}`} replace />;
  return children;
}

export default function App() {
  const { session } = useApp();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={<Navigate to={session ? `/${session.role}` : "/login"} replace />}
      />

      {/* Guardian */}
      <Route
        path="/guardian"
        element={
          <RequireRole role="guardian">
            <Shell />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<GuardianDashboard />} />
        <Route path="new-application" element={<GuardianNewApplication />} />
        <Route path="learners" element={<GuardianLearners />} />
        <Route path="applications" element={<GuardianApplications />} />
        <Route path="applications/:appId" element={<GuardianApplicationDetail />} />
        <Route path="documents" element={<GuardianDocuments />} />
        <Route path="notifications" element={<GuardianNotifications />} />
        <Route path="profile" element={<GuardianProfile />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* School Admin */}
      <Route
        path="/schoolAdmin"
        element={
          <RequireRole role="schoolAdmin">
            <Shell />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="applications/:appId" element={<AdminApplicationDetail />} />
        <Route path="learners" element={<AdminLearners />} />
        <Route path="transfers" element={<AdminTransfers />} />
        <Route path="transfers/:appId" element={<AdminTransferDetail />} />
        <Route path="intake" element={<AdminIntake />} />
        <Route path="intake/new" element={<AdminConfigureIntake />} />
        <Route path="intake/:intakeId" element={<AdminConfigureIntake />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* District Admin */}
      <Route
        path="/districtAdmin"
        element={
          <RequireRole role="districtAdmin">
            <Shell />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DistrictDashboard />} />
        <Route path="applications" element={<DistrictApplications />} />
        <Route path="applications/:appId" element={<DistrictApplicationDetail />} />
        <Route path="schools" element={<DistrictSchools />} />
        <Route path="reports" element={<DistrictReports />} />
        <Route path="auditLog" element={<DistrictAuditLog />} />
        <Route path="notifications" element={<DistrictNotifications />} />
        <Route path="settings" element={<DistrictSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}