// Hand-drawn vector artwork for EduGateway. Everything is inline SVG so it scales,
// stays crisp on phones and needs no network requests. Colours follow the "Sunrise"
// tokens in index.css (brand evergreen, sun amber → coral, warm stone).

import { useId } from "react";

/** Brand mark: a sun rising over an open book, which doubles as the horizon. */
export function LogoMark({ className = "w-9 h-9" }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb86a" />
          <stop offset="1" stopColor="#f2604c" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="#0d5246" />
      <g stroke={`url(#${id}-sun)`} strokeWidth="2" strokeLinecap="round">
        <path d="M20 7v3.2M10.8 10.8l2.2 2.2M29.2 10.8 27 13M7 20h3M30 20h3" />
      </g>
      <path d="M12.5 21a7.5 7.5 0 0 1 15 0Z" fill={`url(#${id}-sun)`} />
      <path
        d="M7 22.5c4.6-1.3 9 -.6 13 2.4 4-3 8.4-3.7 13-2.4v8.2c-4.6-1.2-9-.5-13 2.5-4-3-8.4-3.7-13-2.5Z"
        fill="#ecfbf6"
      />
      <path d="M20 24.9v8.2" stroke="#6dd6b9" strokeWidth="1.4" />
    </svg>
  );
}

export function Logo({ light = false, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className={`font-display text-xl font-semibold ${light ? "text-white" : "text-stone-900"}`}>
        Edu<span className="text-sunrise">Gateway</span>
      </span>
    </div>
  );
}

/**
 * The signature scene: sunrise over the Mpumalanga escarpment, a small school on the
 * ridge and a winding road leading to it. Used on sign-in and dashboard banners.
 */
export function SunriseScene({ className = "w-full h-full", animated = true }) {
  const id = useId();
  return (
    <svg viewBox="0 0 480 360" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e443b" />
          <stop offset="0.55" stopColor="#1f6b5b" />
          <stop offset="0.85" stopColor="#f6a86b" />
          <stop offset="1" stopColor="#ffd5a3" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd5a3" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd5a3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe2b8" />
          <stop offset="1" stopColor="#fb7a26" />
        </linearGradient>
        <linearGradient id={`${id}-far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f8f78" />
          <stop offset="1" stopColor="#2b7463" />
        </linearGradient>
        <linearGradient id={`${id}-mid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c6655" />
          <stop offset="1" stopColor="#11503f" />
        </linearGradient>
        <linearGradient id={`${id}-near`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d4a3e" />
          <stop offset="1" stopColor="#062723" />
        </linearGradient>
      </defs>

      <rect width="480" height="360" fill={`url(#${id}-sky)`} />

      {/* stars fading into dawn */}
      <g fill="#fff" opacity="0.7">
        <circle cx="48" cy="40" r="1.2" />
        <circle cx="120" cy="22" r="0.9" />
        <circle cx="402" cy="34" r="1.3" />
        <circle cx="440" cy="76" r="0.8" />
        <circle cx="300" cy="18" r="1" />
        <circle cx="80" cy="96" r="0.7" />
      </g>

      {/* sun with rays */}
      <g className={animated ? "animate-rise" : undefined} style={{ transformOrigin: "240px 232px" }}>
        <circle cx="240" cy="232" r="120" fill={`url(#${id}-glow)`} />
        <g stroke="#ffd5a3" strokeWidth="3" strokeLinecap="round" opacity="0.55">
          <path d="M240 128v-22M188 142l-11-19M292 142l11-19M150 180l-19-11M330 180l19-11" />
        </g>
        <circle cx="240" cy="232" r="64" fill={`url(#${id}-sun)`} />
      </g>

      {/* birds */}
      <g fill="none" stroke="#0e443b" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <path d="M118 120q6-6 12 0q6-6 12 0" />
        <path d="M150 104q4-4 8 0q4-4 8 0" />
        <path d="M348 132q5-5 10 0q5-5 10 0" />
      </g>

      {/* far escarpment */}
      <path d="M0 236 60 214l38 12 52-30 46 22 40-10 50 18 52-26 44 20 46-14 52 22v162H0Z" fill={`url(#${id}-far)`} />

      {/* school on the middle ridge */}
      <path d="M0 270c60-22 118-32 182-24 54 7 92 4 142-14 60-21 112-20 156-6v134H0Z" fill={`url(#${id}-mid)`} />
      <g transform="translate(300 206)">
        <path d="M0 26 30 8l30 18v26H0Z" fill="#faf7f2" />
        <path d="M-4 28 30 6l34 22" fill="none" stroke="#c44514" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="24" y="34" width="12" height="18" rx="1.5" fill="#0d5246" />
        <rect x="7" y="32" width="9" height="8" rx="1" fill="#ffb86a" />
        <rect x="44" y="32" width="9" height="8" rx="1" fill="#ffb86a" />
        <path d="M30 6V-12" stroke="#faf7f2" strokeWidth="1.6" />
        <path d="M30 -12h13l-3 4 3 4H30Z" fill="#fb7a26" />
      </g>

      {/* trees */}
      <g fill="#0b3d33">
        <path d="M70 262c-10-2-14-14-6-20-2-10 10-16 16-10 8-4 16 4 12 12 8 6 2 18-8 18Z" />
        <rect x="74" y="266" width="4" height="12" />
        <path d="M402 236c-8-1-11-11-5-16-1-8 8-13 13-8 6-3 13 3 10 10 6 5 2 15-6 15Z" />
        <rect x="406" y="238" width="3" height="10" />
      </g>

      {/* near hills with road */}
      <path d="M0 304c86-30 174-36 264-18 76 15 150 10 216-12v86H0Z" fill={`url(#${id}-near)`} />
      <path
        d="M326 262c-18 16-60 22-74 40-12 16 18 34-26 58"
        fill="none"
        stroke="#ffd5a3"
        strokeOpacity="0.6"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2 10"
      />
    </svg>
  );
}

/** Small school building — empty states for schools and intakes. */
export function SchoolArt({ className = "w-40 h-28" }) {
  return (
    <svg viewBox="0 0 160 112" className={className} aria-hidden="true">
      <ellipse cx="80" cy="102" rx="66" ry="7" fill="#e7e5e4" />
      <circle cx="122" cy="26" r="14" fill="#ffd5a3" />
      <path d="M22 52 80 22l58 30v46H22Z" fill="#fff" stroke="#d6d3d1" strokeWidth="2" />
      <path d="M16 55 80 18l64 37" fill="none" stroke="#ec5d17" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="68" y="66" width="24" height="32" rx="3" fill="#0d5246" />
      <circle cx="87" cy="83" r="1.6" fill="#ffb86a" />
      <g fill="#a3e9d3" stroke="#0c8068" strokeWidth="1.5">
        <rect x="34" y="62" width="20" height="16" rx="2" />
        <rect x="106" y="62" width="20" height="16" rx="2" />
      </g>
      <path d="M80 18V2" stroke="#78716c" strokeWidth="2" />
      <path d="M80 2h18l-4 5 4 5H80Z" fill="#fb7a26" />
      <circle cx="80" cy="42" r="7" fill="#fff7ec" stroke="#ec5d17" strokeWidth="2" />
      <path d="M80 38v4l3 2" stroke="#ec5d17" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Stack of papers with a verified seal — documents empty state. */
export function DocumentsArt({ className = "w-40 h-28" }) {
  return (
    <svg viewBox="0 0 160 112" className={className} aria-hidden="true">
      <ellipse cx="80" cy="104" rx="56" ry="6" fill="#e7e5e4" />
      <rect x="40" y="18" width="64" height="80" rx="6" fill="#ecfbf6" stroke="#a3e9d3" strokeWidth="2" transform="rotate(-8 72 58)" />
      <rect x="50" y="12" width="64" height="84" rx="6" fill="#fff" stroke="#d6d3d1" strokeWidth="2" />
      <g stroke="#d6d3d1" strokeWidth="3" strokeLinecap="round">
        <path d="M62 30h40M62 42h40M62 54h28M62 66h34" />
      </g>
      <path d="M62 30h18" stroke="#0c8068" strokeWidth="3" strokeLinecap="round" />
      <circle cx="112" cy="80" r="17" fill="url(#seal)" />
      <defs>
        <linearGradient id="seal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb86a" />
          <stop offset="1" stopColor="#f2604c" />
        </linearGradient>
      </defs>
      <path d="m104 80 6 6 11-12" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Backpack with books and a pencil — learners / applications empty state. */
export function BackpackArt({ className = "w-40 h-28" }) {
  return (
    <svg viewBox="0 0 160 112" className={className} aria-hidden="true">
      <ellipse cx="80" cy="104" rx="60" ry="6" fill="#e7e5e4" />
      <rect x="20" y="70" width="40" height="10" rx="2" fill="#fb7a26" />
      <rect x="24" y="80" width="36" height="10" rx="2" fill="#0c8068" />
      <rect x="18" y="90" width="44" height="10" rx="2" fill="#ffb86a" />
      <path d="M66 34c0-12 28-12 28 0" fill="none" stroke="#0d5246" strokeWidth="5" strokeLinecap="round" />
      <rect x="56" y="34" width="48" height="66" rx="16" fill="#189e80" />
      <rect x="64" y="64" width="32" height="26" rx="8" fill="#0c8068" />
      <path d="M64 74h32" stroke="#6dd6b9" strokeWidth="2" />
      <circle cx="80" cy="50" r="5" fill="#ffd5a3" />
      <g transform="rotate(28 122 70)">
        <rect x="116" y="32" width="10" height="60" rx="2" fill="#ffb86a" />
        <path d="M116 92h10l-5 10Z" fill="#fde68a" />
        <path d="m119.5 98 1.5 4 1.5-4Z" fill="#44403c" />
        <rect x="116" y="28" width="10" height="7" rx="2" fill="#f2604c" />
      </g>
    </svg>
  );
}

/** Envelope with a bell — notifications empty state. */
export function InboxArt({ className = "w-40 h-28" }) {
  return (
    <svg viewBox="0 0 160 112" className={className} aria-hidden="true">
      <ellipse cx="80" cy="104" rx="56" ry="6" fill="#e7e5e4" />
      <rect x="32" y="38" width="96" height="60" rx="8" fill="#fff" stroke="#d6d3d1" strokeWidth="2" />
      <path d="m34 42 46 32 46-32" fill="none" stroke="#a3e9d3" strokeWidth="3" strokeLinejoin="round" />
      <g transform="translate(104 12)">
        <circle cx="16" cy="16" r="16" fill="#fff7ec" />
        <path d="M9 21c2-2 2-5 2-8a5 5 0 0 1 10 0c0 3 0 6 2 8Z" fill="#fb7a26" />
        <circle cx="16" cy="24" r="2.2" fill="#ec5d17" />
      </g>
      <g stroke="#ffb86a" strokeWidth="2" strokeLinecap="round">
        <path d="M24 30l-6-4M22 40h-8M136 60h8" />
      </g>
    </svg>
  );
}

/** Open road toward a sun — transfers empty state. */
export function JourneyArt({ className = "w-40 h-28" }) {
  return (
    <svg viewBox="0 0 160 112" className={className} aria-hidden="true">
      <rect x="10" y="8" width="140" height="92" rx="14" fill="#ecfbf6" />
      <circle cx="80" cy="56" r="20" fill="#ffb86a" />
      <path d="M10 70c26-10 48-12 70-8s46 4 70-6v30a14 14 0 0 1-14 14H24a14 14 0 0 1-14-14Z" fill="#38bb9a" />
      <path d="M70 100c4-10 6-20 10-28 3 8 6 18 10 28Z" fill="#faf7f2" />
      <path d="M80 76v6M80 88v6" stroke="#fb7a26" strokeWidth="2" strokeLinecap="round" />
      <g fill="#0d5246">
        <path d="M30 68h18l-9-18Z" />
        <path d="M112 66h16l-8-16Z" />
      </g>
    </svg>
  );
}

/** Lifebuoy + chat bubble — help page. */
export function HelpArt({ className = "w-44 h-32" }) {
  return (
    <svg viewBox="0 0 176 128" className={className} aria-hidden="true">
      <ellipse cx="88" cy="118" rx="60" ry="6" fill="#e7e5e4" />
      <circle cx="70" cy="66" r="40" fill="#fff" stroke="#d6d3d1" strokeWidth="2" />
      <circle cx="70" cy="66" r="18" fill="#faf7f2" stroke="#d6d3d1" strokeWidth="2" />
      <g fill="#fb7a26">
        <path d="M58 28a40 40 0 0 1 24 0l-4 22a18 18 0 0 0-16 0Z" />
        <path d="M58 104a40 40 0 0 0 24 0l-4-22a18 18 0 0 1-16 0Z" />
      </g>
      <path d="M112 22h46a10 10 0 0 1 10 10v24a10 10 0 0 1-10 10h-26l-12 10V66h-8a10 10 0 0 1-10-10V32a10 10 0 0 1 10-10Z" fill="#0c8068" />
      <g fill="#fff">
        <circle cx="122" cy="44" r="3.5" />
        <circle cx="135" cy="44" r="3.5" />
        <circle cx="148" cy="44" r="3.5" />
      </g>
    </svg>
  );
}
