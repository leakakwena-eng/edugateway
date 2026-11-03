import { Search } from "lucide-react";
import { statusLabel } from "../utils/format.js";

export function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-3 py-2 w-64 max-w-full border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
}

/** `statuses` are API codes; options show their labels. */
export function StatusFilter({ value, onChange, statuses }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
    >
      <option value="">All statuses</option>
      {statuses.map((s) => (
        <option key={s} value={s}>
          {statusLabel(s)}
        </option>
      ))}
    </select>
  );
}
