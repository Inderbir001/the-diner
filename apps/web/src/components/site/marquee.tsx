import { cn } from "@/lib/utils";

/** Infinite ticker — pure CSS, pauses on hover. */
export function Marquee({ items, className, duration = 40 }: { items: string[]; className?: string; duration?: number }) {
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-8 font-display text-4xl italic text-cream/90 sm:text-6xl">{item}</span>
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-brass sm:size-7" aria-hidden>
            <path fill="currentColor" d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("mask-fade-x group flex overflow-hidden py-8", className)}>
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
