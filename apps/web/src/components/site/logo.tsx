import { cn } from "@/lib/utils";

/** The grill mark from The Diner's sign: steam, kettle bowl and three legs. */
export function GrillMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none">
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <path d="M37 26c-5-4 5-7 0-11s5-7 0-11" />
        <path d="M50 26c-5-4 5-7 0-11s5-7 0-11" />
        <path d="M63 26c-5-4 5-7 0-11s5-7 0-11" />
      </g>
      <rect x="14" y="33" width="72" height="9" rx="4.5" fill="currentColor" />
      <path d="M21 41h58a29 25 0 0 1-58 0z" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <path d="M37 60 29 92" />
        <path d="M50 64v22" />
        <path d="M63 60l8 32" />
      </g>
    </svg>
  );
}

/** Lockup of the sign: grill mark + THE DINER between rules + RESTOBAR. `tone="light"` for dark backgrounds. */
export function Logo({ className, tone = "light" }: { className?: string; tone?: "dark" | "light" }) {
  const ink = tone === "light" ? "text-snow" : "text-night";
  const rule = tone === "light" ? "bg-snow" : "bg-night";
  return (
    <span className={cn("inline-flex items-center gap-2.5 leading-none", className)}>
      <GrillMark className="-mt-1 h-9 w-9 text-brass" />
      <span className="flex flex-col items-stretch">
        <span className="flex justify-between gap-6" aria-hidden>
          <span className={cn("h-[2px] w-1/4", rule)} />
          <span className={cn("h-[2px] w-1/4", rule)} />
        </span>
        <span className={cn("py-[3px] font-brand text-[1.55rem] tracking-[0.12em]", ink)}>THE DINER</span>
        <span className={cn("h-[2px] w-full", rule)} aria-hidden />
        <span className="mt-[3px] font-brand text-[0.72rem] tracking-[0.42em] text-brass">RESTOBAR</span>
      </span>
    </span>
  );
}
