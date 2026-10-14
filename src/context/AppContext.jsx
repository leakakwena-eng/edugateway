import { createContext, useContext, useEffect, useState } from "react";
import {
  INITIAL_APPLICATIONS,
  INITIAL_LEARNERS,
  INITIAL_INTAKES,
  TRANSFER_RECORDS,
  GUARDIAN,
  SCHOOL_ADMINS,
  DISTRICT_ADMIN,
} from "../data/seed";

const AppContext = createContext(null);
const STORAGE_KEY = "edugateway_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function AppProvider({ children }) {
  const saved = loadState();

  const [session, setSession] = useState(saved?.session || null);
  const [applications, setApplications] = useState(saved?.applications || INITIAL_APPLICATIONS);
  const [learners, setLearners] = useState(saved?.learners || INITIAL_LEARNERS);
  const [intakes, setIntakes] = useState(saved?.intakes || INITIAL_INTAKES);
  const [transferRecords, setTransferRecords] = useState(saved?.transferRecords || TRANSFER_RECORDS);
  const [auditLog, setAuditLog] = useState(saved?.auditLog || []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ session, applications, learners, intakes, transferRecords, auditLog })
    );
  }, [session, applications, learners, intakes, transferRecords, auditLog]);

  const login = (role, email, password) => {
    if (role === "guardian") {
      if (email === GUARDIAN.email && password === GUARDIAN.password) {
        setSession({ role: "guardian", userId: GUARDIAN.id });
        return { ok: true };
      }
    } else if (role === "schoolAdmin") {
      const entry = Object.entries(SCHOOL_ADMINS).find(
        ([, a]) => a.email === email && a.password === password
      );
      if (entry) {
        setSession({ role: "schoolAdmin", schoolId: entry[0] });
        return { ok: true };
      }
    } else if (role === "districtAdmin") {
      if (email === DISTRICT_ADMIN.email && password === DISTRICT_ADMIN.password) {
        setSession({ role: "districtAdmin" });
        return { ok: true };
      }
    }
    return { ok: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApplications(INITIAL_APPLICATIONS);
    setLearners(INITIAL_LEARNERS);
    setIntakes(INITIAL_INTAKES);
    setTransferRecords(TRANSFER_RECORDS);
    setAuditLog([]);
  };

  return (
    <AppContext.Provider
      value={{
        session, login, logout,
        applications, learners, intakes, transferRecords, auditLog,
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};