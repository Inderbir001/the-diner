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

/** Horizontal lockup of the sign: grill mark + THE DINER between rules + RESTOBAR. */
export function Logo({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 leading-none", stacked && "flex-col gap-3", className)}>
      <GrillMark className={cn("text-brass", stacked ? "h-16 w-16" : "-mt-1 h-7 w-7 sm:h-9 sm:w-9")} />
      <span className="flex flex-col items-stretch">
        <span className="flex justify-between gap-6" aria-hidden>
          <span className="h-[2px] w-1/4 bg-cream" />
          <span className="h-[2px] w-1/4 bg-cream" />
        </span>
        <span className={cn("font-brand tracking-[0.12em] text-cream", stacked ? "py-1.5 text-5xl" : "py-[2px] text-[1.3rem] sm:py-[3px] sm:text-[1.55rem]")}>THE DINER</span>
        <span className="h-[2px] w-full bg-cream" aria-hidden />
        <span className={cn("font-brand tracking-[0.42em] text-brass", stacked ? "mt-2 text-xl" : "mt-[2px] text-[0.6rem] sm:mt-[3px] sm:text-[0.72rem]")}>RESTOBAR</span>
      </span>
    </span>
  );
}
