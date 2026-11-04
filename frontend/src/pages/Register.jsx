import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button, Field, inputClass } from "../components/ui.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

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
    <AuthLayout title="Create your account" subtitle="For parents and guardians applying on behalf of a learner.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name">
          <input required value={form.name} onChange={set("name")} className={inputClass} autoComplete="name" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email">
            <input type="email" required value={form.email} onChange={set("email")} className={inputClass} autoComplete="email" />
          </Field>
          <Field label="Phone (optional)">
            <input type="tel" value={form.phone} onChange={set("phone")} className={inputClass} autoComplete="tel" />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Password" hint="At least 8 characters">
            <input type="password" required minLength={8} value={form.password} onChange={set("password")} className={inputClass} autoComplete="new-password" />
          </Field>
          <Field label="Confirm password">
            <input type="password" required value={form.confirm} onChange={set("confirm")} className={inputClass} autoComplete="new-password" />
          </Field>
        </div>

        {error && (
          <div className="text-sm text-rose-700 bg-rose-50 ring-1 ring-rose-200 rounded-xl px-3.5 py-2.5">{error}</div>
        )}

        <Button type="submit" busy={busy} className="w-full py-3">
          Create account <ArrowRight size={16} />
        </Button>
      </form>

      <p className="text-sm text-stone-500 mt-6 text-center">
        Already registered?{" "}
        <Link to="/login" className="text-brand-700 font-semibold hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
