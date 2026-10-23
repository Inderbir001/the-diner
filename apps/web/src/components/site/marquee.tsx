import { cn } from "@/lib/utils";
import { GrillMark } from "./logo";

/** Infinite ticker — pure CSS, pauses on hover. */
export function Marquee({
  items,
  className,
  duration = 38,
  reverse = false,
  small = false,
}: {
  items: string[];
  className?: string;
  duration?: number;
  reverse?: boolean;
  small?: boolean;
}) {
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className={cn("px-5 font-display leading-none sm:px-7", small ? "text-3xl sm:text-5xl" : "text-4xl sm:text-7xl")}>{item}</span>
          <GrillMark className={cn("shrink-0", small ? "size-6 text-brass sm:size-8" : "size-7 sm:size-11")} />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group flex overflow-hidden bg-brass py-5 text-cream", className)}>
      <div
        className={cn("flex animate-marquee group-hover:[animation-play-state:paused]", reverse && "[animation-direction:reverse]")}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
