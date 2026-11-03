import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { ROLE_HOME, useAuth } from "../context/AuthContext.jsx";
import { Button, inputClass } from "../components/ui.jsx";

// Accounts created by the backend's demo seeder. Shown only in development builds.
const DEMO_ACCOUNTS = [
  { label: "Guardian", email: "thandi.mokoena@example.com" },
  { label: "School Admin", email: "dlamini@mpuma.edu" },
  { label: "Sending School", email: "nkosi@lydenburg.edu" },
  { label: "District Admin", email: "nomvete@edugateway.edu" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await login(email, password);
      navigate(`/${ROLE_HOME[user.role]}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
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
        <p className="text-sm text-slate-500 mb-6">Guardians, school admins and district staff use the same sign-in.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button type="submit" busy={busy} className="w-full py-2.5">
            Sign in
          </Button>
        </form>

        <p className="text-sm text-slate-500 mt-5 text-center">
          New guardian?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Create an account
          </Link>
        </p>

        {import.meta.env.DEV && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-xs text-slate-400 mb-2">Demo accounts (password demo123)</div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword("demo123");
                    setError("");
                  }}
                  className="text-xs font-medium py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
