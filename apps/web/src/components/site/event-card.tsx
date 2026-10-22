import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DinerEvent } from "@diner/shared";
import { EventPoster } from "./event-poster";

export function EventCard({ event, priority }: { event: DinerEvent; priority?: boolean }) {
  return (
    <Link href={`/events/${event.slug}`} className="group block" aria-label={event.title}>
      <div className="relative transition-transform duration-300 group-hover:-translate-y-1.5">
        <EventPoster event={event} priority={priority} />
        <span className="absolute bottom-4 right-4 inline-flex size-12 items-center justify-center rounded-full bg-cream text-ink shadow-xl transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </Link>
  );
}
