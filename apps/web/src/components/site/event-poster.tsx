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
    shell: "bg-brass text-cream",
    overlay: "bg-gradient-to-t from-brass via-brass/85 to-brass/10",
    kicker: "bg-ink text-cream",
    badge: "bg-cream text-ink",
    chip: "border-cream/40 text-cream",
    mark: "text-cream",
  },
  dark: {
    shell: "bg-ink text-cream",
    overlay: "bg-gradient-to-t from-ink via-ink/80 to-ink/5",
    kicker: "bg-brass text-cream",
    badge: "bg-brass text-cream",
    chip: "border-white/30 text-cream",
    mark: "text-brass",
  },
  light: {
    shell: "bg-paper text-ink",
    overlay: "bg-gradient-to-t from-paper via-paper/90 to-paper/0",
    kicker: "bg-brass text-cream",
    badge: "bg-ink text-cream",
    chip: "border-ink/30 text-ink",
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
            <span className="font-display text-[5cqw] leading-none tracking-[0.12em]">The Diner</span>
          </span>
          {event.price_label && (
            <span className={cn("max-w-[42cqw] rotate-3 rounded-[2cqw] px-[3cqw] py-[1.6cqw] text-center font-display text-[4.6cqw] leading-[1] shadow-lg", t.badge)}>
              {event.price_label}
            </span>
          )}
        </div>

        <div>
          {when && (
            <span className={cn("mb-[3cqw] inline-block rounded-full px-[3cqw] py-[1.2cqw] text-[3cqw] font-extrabold uppercase tracking-[0.14em]", t.kicker)}>
              {when}
            </span>
          )}
          <h3 className="font-display text-[15cqw] leading-[0.86] [overflow-wrap:anywhere]">{event.title || "Event title"}</h3>
          {event.summary && <p className="mt-[3cqw] max-w-[90%] text-[3.6cqw] font-semibold leading-snug opacity-90">{event.summary}</p>}
          {event.highlights?.length > 0 && (
            <ul className="mt-[4cqw] flex flex-wrap gap-[1.6cqw]">
              {event.highlights.filter(Boolean).map((h) => (
                <li key={h} className={cn("rounded-full border-2 px-[2.6cqw] py-[1cqw] text-[2.8cqw] font-bold uppercase tracking-wider", t.chip)}>
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
