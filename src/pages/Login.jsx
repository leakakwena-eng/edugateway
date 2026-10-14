import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { GUARDIAN, SCHOOL_ADMINS, DISTRICT_ADMIN } from "../data/seed";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("guardian");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(role, email, password);
    if (result.ok) {
      navigate(
        role === "guardian"
          ? "/guardian"
          : role === "schoolAdmin"
          ? "/schoolAdmin"
          : "/districtAdmin"
      );
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (r) => {
    setRole(r);
    if (r === "guardian") {
      setEmail(GUARDIAN.email);
      setPassword(GUARDIAN.password);
    } else if (r === "schoolAdmin") {
      const first = Object.values(SCHOOL_ADMINS)[0];
      setEmail(first.email);
      setPassword(first.password);
    } else {
      setEmail(DISTRICT_ADMIN.email);
      setPassword(DISTRICT_ADMIN.password);
    }
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-800">EduGateway</span>
        </div>

        <h1 className="text-xl font-semibold text-slate-800 mb-1">Sign in</h1>
        <p className="text-sm text-slate-500 mb-6">Access your dashboard.</p>

        <div className="flex gap-2 mb-4">
          {["guardian", "schoolAdmin", "districtAdmin"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => fillDemo(r)}
              className={`flex-1 text-xs font-medium py-2 rounded-lg border ${
                role === r
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-300"
              }`}
            >
              {r === "guardian" ? "Guardian" : r === "schoolAdmin" ? "School Admin" : "District Admin"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Click a role button above to auto-fill demo credentials.
        </p>
      </div>
    </div>
  );
}