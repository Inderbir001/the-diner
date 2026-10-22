import Image from "next/image";
import type { DinerEvent } from "@diner/shared";
import { cn, formatEventDate } from "@/lib/utils";
import { GrillMark } from "./logo";

export type PosterData = Pick<
  DinerEvent,
  "title" | "summary" | "image_url" | "starts_at" | "is_recurring" | "recurrence_label" | "price_label" | "kicker" | "highlights" | "theme" | "display_mode"
>;

const THEMES = {
  red: {
    shell: "bg-brass text-snow",
    overlay: "bg-gradient-to-t from-brass from-30% via-brass/60 via-55% to-transparent",
    kicker: "bg-night text-snow",
    badge: "bg-snow text-night",
    chip: "border-snow/50 text-snow",
    mark: "text-snow",
  },
  dark: {
    shell: "bg-night text-snow",
    overlay: "bg-gradient-to-t from-night from-25% via-night/55 via-55% to-transparent",
    kicker: "bg-brass text-snow",
    badge: "bg-brass text-snow",
    chip: "border-snow/40 text-snow",
    mark: "text-brass",
  },
  light: {
    shell: "bg-[#fff3e6] text-night",
    overlay: "bg-gradient-to-t from-[#fff3e6] via-[#fff3e6]/90 to-transparent",
    kicker: "bg-brass text-snow",
    badge: "bg-night text-snow",
    chip: "border-night/30 text-night",
    mark: "text-brass",
  },
} as const;

/**
 * Branded event poster. Everything on it comes from the event's fields in /admin, so
 * changing the heading, offer or photo updates the poster on the site. With
 * display_mode "image" the uploaded artwork is shown as-is instead.
 */
export function EventPoster({ event, priority, sizes = "(min-width:1024px) 33vw, 100vw", className }: { event: PosterData; priority?: boolean; sizes?: string; className?: string }) {
  const when = event.kicker || (event.is_recurring ? event.recurrence_label : event.starts_at ? formatEventDate(event.starts_at) : null);

  if (event.display_mode === "image" && event.image_url) {
    return (
      <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink", className)}>
        <Image src={event.image_url} alt={event.title} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
    );
  }

  const t = THEMES[event.theme] ?? THEMES.red;
  return (
    <div className={cn("@container relative aspect-[4/5] overflow-hidden rounded-[24px]", t.shell, className)}>
      {event.image_url && (
        <Image src={event.image_url} alt="" fill priority={priority} sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-105" />
      )}
      <div className={cn("absolute inset-0", event.image_url ? t.overlay : "")} />

      <div className="relative flex h-full flex-col justify-between p-[6cqw]">
        <div className="flex items-start justify-between gap-3">
          <span className="flex items-center gap-[1.5cqw]">
            <GrillMark className={cn("size-[9cqw]", t.mark)} />
            <span className="font-brand text-[5cqw] leading-none tracking-[0.12em]">THE DINER</span>
          </span>
          {event.price_label && (
            <span className={cn("max-w-[42cqw] rotate-3 rounded-[2cqw] px-[3cqw] py-[1.6cqw] text-center font-display text-[4.2cqw] font-extrabold leading-[1.05] shadow-lg", t.badge)}>
              {event.price_label}
            </span>
          )}
        </div>

        <div>
          {when && (
            <span className={cn("mb-[3cqw] inline-block rounded-full px-[3cqw] py-[1.2cqw] text-[3cqw] font-bold", t.kicker)}>
              {when}
            </span>
          )}
          <h3 className="font-display text-[12cqw] font-extrabold leading-[0.95] tracking-tight [overflow-wrap:anywhere]">{event.title || "Event title"}</h3>
          {event.summary && <p className="mt-[3cqw] max-w-[90%] text-[3.6cqw] font-semibold leading-snug opacity-90">{event.summary}</p>}
          {event.highlights?.length > 0 && (
            <ul className="mt-[4cqw] flex flex-wrap gap-[1.6cqw]">
              {event.highlights.filter(Boolean).map((h) => (
                <li key={h} className={cn("rounded-full border-2 px-[2.6cqw] py-[1cqw] text-[2.8cqw] font-bold", t.chip)}>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
