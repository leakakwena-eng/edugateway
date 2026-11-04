import { MONTHS } from "../constants.js";

/** Monthly bar chart with gridlines; the current month is highlighted in the sunrise accent. */
export default function MonthlyBarChart({ values, year }) {
  const max = Math.max(4, ...values);
  const now = new Date();
  const current = year === undefined || year === now.getFullYear() ? now.getMonth() : -1;
  const ticks = [max, Math.round(max / 2), 0];

  return (
    <div className="flex gap-3">
      <div className="flex flex-col justify-between h-44 pb-6 text-[10px] text-stone-400 text-right w-5">
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="relative flex-1">
        <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
          {ticks.map((t) => (
            <div key={t} className="border-t border-dashed border-stone-200" />
          ))}
        </div>
        <div className="relative flex items-end gap-1.5 sm:gap-2.5 h-44">
          {values.map((v, i) => (
            <div key={MONTHS[i]} className="group flex-1 h-full flex flex-col items-center justify-end">
              <div className="relative w-full flex-1 flex items-end justify-center pb-0">
                <div
                  className={`w-full max-w-9 rounded-t-lg origin-bottom transition-all duration-500 group-hover:brightness-110 ${
                    i === current
                      ? "bg-sunrise shadow-md shadow-sun-500/30"
                      : "bg-gradient-to-t from-brand-600 to-brand-400"
                  }`}
                  style={{ height: v ? `${(v / max) * 100}%` : "3px", opacity: v ? 1 : 0.25 }}
                />
                <span className="absolute -top-1 -translate-y-full opacity-0 group-hover:opacity-100 transition text-[11px] font-semibold text-white bg-stone-900 rounded-md px-1.5 py-0.5 whitespace-nowrap">
                  {v} {v === 1 ? "application" : "applications"}
                </span>
              </div>
              <span className={`text-[10px] mt-2 h-4 ${i === current ? "font-bold text-sun-600" : "text-stone-400"}`}>
                {MONTHS[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
