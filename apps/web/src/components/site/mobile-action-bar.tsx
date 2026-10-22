import Link from "next/link";
import { CalendarDays, MapPin, Phone } from "lucide-react";
import type { GeneralSettings } from "@diner/shared";
import { telHref } from "@/lib/utils";

/**
 * Phone-only action bar, docked to the bottom edge. The page reserves the same height
 * (64px + safe area) as bottom padding, so it never covers content or filters.
 */
export function MobileActionBar({ general }: { general: GeneralSettings }) {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-charcoal pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="grid h-16 grid-cols-3 text-xs font-semibold">
        {general.phones[0] ? (
          <a href={telHref(general.phones[0])} className="flex flex-col items-center justify-center gap-1 text-ivory/85 active:bg-ivory/5">
            <Phone className="size-5" /> Call
          </a>
        ) : (
          <span />
        )}
        {general.mapUrl ? (
          <a href={general.mapUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 border-x border-ivory/10 text-ivory/85 active:bg-ivory/5">
            <MapPin className="size-5" /> Directions
          </a>
        ) : (
          <span />
        )}
        <Link href="/reserve" className="m-2 flex flex-col items-center justify-center gap-0.5 rounded-[16px] bg-chilli text-white">
          <CalendarDays className="size-5" /> Book
        </Link>
      </div>
    </nav>
  );
}
