import { useState } from "react";
import { Avatar, Button, Card, Field, PageHeader, inputClass } from "../../components/ui.jsx";
import { guardianApi } from "../../api/index.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function GuardianProfile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user.name, phone: user.phone ?? "" });
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      updateUser(await guardianApi.updateProfile(form));
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Couldn't save profile", err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-lg">
      <PageHeader title="Profile" />
      <Card className="p-6">
        <form onSubmit={save} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar name={user.name} size="lg" />
            <div>
              <div className="font-medium text-stone-800">{user.name}</div>
              <div className="text-xs text-stone-500">Guardian</div>
            </div>
          </div>
          <Field label="Full Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Email" hint="Your email is your sign-in and can't be changed here.">
            <input value={user.email} disabled className={inputClass} />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </Field>
          <Button type="submit" busy={busy}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
