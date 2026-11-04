import { CheckCircle2 } from "lucide-react";
import { Logo, SunriseScene } from "./Illustrations.jsx";

const POINTS = [
  "Apply to any participating school from your phone",
  "Upload documents once and track every step",
  "Transfers between schools handled for you",
];

/** Split screen for sign-in and registration: illustrated brand panel + form. */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative overflow-hidden bg-brand-950 h-56 sm:h-64 lg:h-auto">
        <SunriseScene className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-950/10 to-transparent" />
        <div className="relative h-full flex flex-col p-6 sm:p-10">
          <Logo light />
          <div className="hidden lg:block mt-[12vh] max-w-md">
            <h2 className="font-display text-4xl xl:text-5xl font-semibold text-white leading-[1.1]">
              Every learner, <span className="italic text-sun-200">the right school.</span>
            </h2>
            <ul className="mt-6 space-y-2.5">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-brand-50/90">
                  <CheckCircle2 size={17} className="text-sun-300 shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <main className="relative -mt-8 lg:mt-0 flex items-start lg:items-center justify-center px-4 pb-10 lg:p-10">
        <div className="w-full max-w-md bg-white lg:bg-transparent rounded-3xl lg:rounded-none shadow-lift lg:shadow-none p-6 sm:p-8 lg:p-0 animate-fade-up">
          <h1 className="font-display text-3xl font-semibold text-stone-900">{title}</h1>
          {subtitle && <p className="text-sm text-stone-500 mt-1.5 mb-7">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}
