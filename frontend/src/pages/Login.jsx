import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Landmark, School, UserRound } from "lucide-react";
import { ROLE_HOME, useAuth } from "../context/AuthContext.jsx";
import { Button, Field, inputClass } from "../components/ui.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

// Accounts created by the backend's demo seeder. Shown only in development builds.
const DEMO_ACCOUNTS = [
  { label: "Guardian", email: "thandi.mokoena@example.com", icon: UserRound },
  { label: "School Admin", email: "dlamini@mpuma.edu", icon: School },
  { label: "Sending School", email: "nkosi@lydenburg.edu", icon: Building2 },
  { label: "District Admin", email: "nomvete@edugateway.edu", icon: Landmark },
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
    <AuthLayout title="Welcome back" subtitle="Guardians, school admins and district staff all sign in here.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </Field>

        {error && (
          <div className="text-sm text-rose-700 bg-rose-50 ring-1 ring-rose-200 rounded-xl px-3.5 py-2.5">{error}</div>
        )}

        <Button type="submit" busy={busy} className="w-full py-3">
          Sign in <ArrowRight size={16} />
        </Button>
      </form>

      <p className="text-sm text-stone-500 mt-6 text-center">
        New guardian?{" "}
        <Link to="/register" className="text-brand-700 font-semibold hover:underline underline-offset-4">
          Create an account
        </Link>
      </p>

      {import.meta.env.DEV && (
        <div className="mt-8 pt-6 border-t border-dashed border-stone-300">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
            Try a demo account · password demo123
          </div>
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
                className={`flex items-center gap-2 text-left text-xs font-semibold px-3 py-2.5 rounded-xl ring-1 ring-inset transition ${
                  email === a.email
                    ? "bg-brand-50 ring-brand-300 text-brand-800"
                    : "bg-white ring-stone-200 text-stone-600 hover:ring-stone-300 hover:bg-stone-50"
                }`}
              >
                <a.icon size={15} className="shrink-0" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
