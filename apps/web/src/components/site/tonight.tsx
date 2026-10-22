"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nowInRestaurant, type AnnouncementSettings, type DinerEvent, type GeneralSettings } from "@diner/shared";
import { to12h } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const mins = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/** Pick tonight's event: one that names today's weekday first, then an every-day one. */
function eventFor(events: DinerEvent[], day: string) {
  const text = (e: DinerEvent) => `${e.kicker ?? ""} ${e.recurrence_label ?? ""}`.toLowerCase();
  const d = day.toLowerCase();
  const named = events.find((e) => text(e).includes(d) || new RegExp(`\\b${d.slice(0, 3)}\\b`).test(text(e)));
  return named ?? events.find((e) => /daily|every day/.test(text(e))) ?? events.find((e) => e.is_featured) ?? null;
}

function status(hours: GeneralSettings["hours"], weekday: number, minutes: number) {
  const today = hours.find((h) => h.day === DAYS[weekday]);
  const yesterday = hours.find((h) => h.day === DAYS[(weekday + 6) % 7]);
  if (yesterday && !yesterday.closed && mins(yesterday.close) < mins(yesterday.open) && minutes < mins(yesterday.close)) {
    return { open: true, text: `Open now · until ${to12h(yesterday.close)}` };
  }
  if (!today || today.closed) return { open: false, text: "Closed today" };
  let close = mins(today.close);
  if (close <= mins(today.open)) close += 1440;
  if (minutes >= mins(today.open) && minutes < close) return { open: true, text: `Open now · until ${to12h(today.close)}` };
  if (minutes < mins(today.open)) return { open: false, text: `Opens at ${to12h(today.open)}` };
  return { open: false, text: "Closed now" };
}

/** Compact strip under the hero: what's on tonight, whether we're open, and one booking button. */
export function Tonight({
  events,
  general,
  announcement,
  bookingEnabled,
}: {
  events: DinerEvent[];
  general: GeneralSettings;
  announcement: AnnouncementSettings;
  bookingEnabled: boolean;
}) {
  const [now, setNow] = useState<{ day: string; open: boolean; text: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      const n = nowInRestaurant();
      const weekday = new Date(`${n.date}T12:00:00Z`).getUTCDay();
      setNow({ day: DAYS[weekday], ...status(general.hours, weekday, n.minutes) });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [general.hours]);

  const event = now ? eventFor(events, now.day) : null;

  return (
    <section aria-label="Tonight at The Diner" className="bg-ivory text-charcoal">
      <div className="container-x grid gap-5 py-7 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto] md:items-center md:gap-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-chilli">Tonight at The Diner</p>
          <p className="mt-1 font-display text-2xl">{now?.day ?? "Today"}</p>
          {now && (
            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-stone">
              <span className={`size-2 rounded-full ${now.open ? "bg-leaf" : "bg-chilli"}`} aria-hidden />
              {now.text}
            </p>
          )}
        </div>

        {event ? (
          <Link href={`/events/${event.slug}`} className="group flex items-center gap-4 rounded-[16px] md:border-l md:border-charcoal/10 md:pl-10">
            {event.image_url && (
              <span className="relative size-[72px] shrink-0 overflow-hidden rounded-[16px] bg-charcoal">
                <Image src={event.image_url} alt="" fill sizes="72px" className="object-cover" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block font-display text-xl leading-tight group-hover:text-chilli">{event.title}</span>
              <span className="mt-1 block text-sm text-stone">
                {[event.kicker || event.recurrence_label, event.price_label].filter(Boolean).join(" · ")}
              </span>
            </span>
          </Link>
        ) : (
          <p className="text-sm text-stone md:border-l md:border-charcoal/10 md:pl-10">
            {announcement.enabled && announcement.text ? announcement.text : general.description}
          </p>
        )}

        {bookingEnabled && (
          <Link href="/reserve" className="btn-primary w-full md:w-auto">
            Book for tonight
          </Link>
        )}
      </div>
    </section>
  );
}
