import { Search } from "lucide-react";
import { statusLabel } from "../utils/format.js";

const control =
  "bg-white border border-stone-300 rounded-xl text-sm text-stone-900 shadow-sm transition focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15";

export function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${control} w-full pl-10 pr-3 py-2.5 placeholder:text-stone-400`}
      />
    </div>
  );
}

/** `statuses` are API codes; options show their labels. */
export function StatusFilter({ value, onChange, statuses }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${control} px-3.5 py-2.5`}>
      <option value="">All statuses</option>
      {statuses.map((s) => (
        <option key={s} value={s}>
          {statusLabel(s)}
        </option>
      ))}
    </select>
  );
}
