import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Repeat } from "lucide-react";
import type { DinerEvent } from "@diner/shared";
import { formatEventDate } from "@/lib/utils";

export function EventCard({ event, priority }: { event: DinerEvent; priority?: boolean }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[28px] border border-white/10 bg-smoke sm:aspect-[3/4]"
    >
      {event.image_url && (
        <Image
          src={event.image_url}
          alt={event.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      <span className="glass absolute right-5 top-5 inline-flex size-11 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45">
        <ArrowUpRight className="size-5" />
      </span>
      <div className="relative p-6">
        <p className="glass mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-sand">
          {event.is_recurring ? <Repeat className="size-3.5 text-brass" /> : <CalendarDays className="size-3.5 text-brass" />}
          {event.is_recurring && event.recurrence_label ? event.recurrence_label : formatEventDate(event.starts_at)}
        </p>
        <h3 className="font-display text-3xl leading-tight">{event.title}</h3>
        {event.summary && <p className="mt-2 text-sm text-sand">{event.summary}</p>}
      </div>
    </Link>
  );
}
