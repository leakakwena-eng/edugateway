import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button, Field, inputClass } from "../components/ui.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { name, email, phone, password } = form;
      await register({ name, email, phone, password });
      navigate("/guardian/learners", { replace: true });
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

        <h1 className="text-xl font-semibold text-slate-800 mb-1">Create a guardian account</h1>
        <p className="text-sm text-slate-500 mb-6">Apply for admission and track your learners' applications.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name">
            <input required value={form.name} onChange={set("name")} className={inputClass} autoComplete="name" />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={set("email")} className={inputClass} autoComplete="email" />
          </Field>
          <Field label="Phone (optional)">
            <input type="tel" value={form.phone} onChange={set("phone")} className={inputClass} autoComplete="tel" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Password" hint="At least 8 characters">
              <input type="password" required minLength={8} value={form.password} onChange={set("password")} className={inputClass} autoComplete="new-password" />
            </Field>
            <Field label="Confirm password">
              <input type="password" required value={form.confirm} onChange={set("confirm")} className={inputClass} autoComplete="new-password" />
            </Field>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button type="submit" busy={busy} className="w-full py-2.5">
            Create account
          </Button>
        </form>

        <p className="text-sm text-slate-500 mt-5 text-center">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
