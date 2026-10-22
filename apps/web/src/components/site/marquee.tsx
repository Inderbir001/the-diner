import { cn } from "@/lib/utils";
import { GrillMark } from "./logo";

/** Infinite ticker — pure CSS, pauses on hover. */
export function Marquee({ items, className, duration = 38 }: { items: string[]; className?: string; duration?: number }) {
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-7 font-display text-5xl leading-none sm:text-7xl">{item}</span>
          <GrillMark className="size-9 shrink-0 sm:size-11" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group flex overflow-hidden bg-brass py-5 text-cream", className)}>
      <div
        className="flex animate-marquee group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
