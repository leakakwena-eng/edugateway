import { Field, inputClass } from "./ui.jsx";

export const EMPTY_LEARNER = { name: "", dateOfBirth: "", idNumber: "", gender: "" };

/** Controlled learner fields; the parent owns the value and submits it. */
export default function LearnerForm({ value, onChange }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <div className="space-y-4">
      <Field label="Full Name *">
        <input required value={value.name} onChange={set("name")} className={inputClass} placeholder="e.g. Thabo Sipho Nkosi" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="SA ID Number (optional)" hint="13 digits">
          <input
            value={value.idNumber}
            onChange={set("idNumber")}
            inputMode="numeric"
            pattern="\d{13}"
            maxLength={13}
            className={inputClass}
          />
        </Field>
        <Field label="Date of Birth *">
          <input
            type="date"
            required
            max={new Date().toISOString().slice(0, 10)}
            value={value.dateOfBirth}
            onChange={set("dateOfBirth")}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Gender">
        <select value={value.gender} onChange={set("gender")} className={inputClass}>
          <option value="">Prefer not to say</option>
          <option>Female</option>
          <option>Male</option>
        </select>
      </Field>
    </div>
  );
}

/** Converts form state to the API shape (blank optional fields become null). */
export const toLearnerRequest = (v) => ({
  name: v.name.trim(),
  dateOfBirth: v.dateOfBirth || null,
  idNumber: v.idNumber.trim() || null,
  gender: v.gender || null,
});
