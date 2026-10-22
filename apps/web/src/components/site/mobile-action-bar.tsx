import Link from "next/link";
import { CalendarDays, MapPin, Phone } from "lucide-react";
import type { GeneralSettings } from "@diner/shared";
import { telHref } from "@/lib/utils";

/** Thumb-reach shortcuts on phones: call, directions, book. */
export function MobileActionBar({ general }: { general: GeneralSettings }) {
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <div className="glass-strong grid grid-cols-3 overflow-hidden rounded-2xl text-xs font-semibold shadow-2xl shadow-black/60">
        {general.phones[0] && (
          <a href={telHref(general.phones[0])} className="flex flex-col items-center gap-1 py-3 text-sand active:bg-white/10">
            <Phone className="size-4" /> Call
          </a>
        )}
        {general.mapUrl && (
          <a href={general.mapUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 border-x border-white/10 py-3 text-sand active:bg-white/10">
            <MapPin className="size-4" /> Directions
          </a>
        )}
        <Link href="/reserve" className="flex flex-col items-center gap-1 bg-brass py-3 text-ink">
          <CalendarDays className="size-4" /> Book
        </Link>
      </div>
    </nav>
  );
}
