import { MONTHS } from "../constants.js";

/** Simple monthly bar chart; `values` has one number per month. */
export default function MonthlyBarChart({ values }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex items-end gap-2 sm:gap-3 h-40">
      {values.map((v, i) => (
        <div key={MONTHS[i]} className="flex-1 h-full flex flex-col items-center justify-end gap-1.5">
          <span className="text-[10px] text-slate-500">{v || ""}</span>
          <div
            className="w-full bg-blue-500 rounded-t-md min-h-[2px]"
            style={{ height: `${(v / max) * 100}%` }}
            title={`${MONTHS[i]}: ${v}`}
          />
          <span className="text-[10px] text-slate-400">{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  );
}
