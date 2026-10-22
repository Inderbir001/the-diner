import { cn } from "@/lib/utils";
import { GrillMark } from "./logo";

/** Red ticker — pure CSS, pauses on hover. */
export function Marquee({ items, className, duration = 40 }: { items: string[]; className?: string; duration?: number }) {
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-display text-xl font-bold sm:text-2xl">{item}</span>
          <GrillMark className="size-6 shrink-0 opacity-80" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group flex overflow-hidden border-y border-white/10 bg-gradient-to-r from-brass/80 via-[#ff6b3d]/70 to-violet/80 py-4 text-snow backdrop-blur", className)}>
      <div className="flex animate-marquee group-hover:[animation-play-state:paused]" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
