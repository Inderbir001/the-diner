import Link from "next/link";
import { CalendarCheck, MapPin, PartyPopper, Sparkles, UtensilsCrossed } from "lucide-react";
import type { GeneralSettings } from "@diner/shared";

/** One-tap shortcuts to what most visitors come for. */
export function QuickLinks({ general }: { general: GeneralSettings }) {
  const links = [
    { href: "/menu", label: "Menu & prices", sub: "Food, drinks, deals", icon: UtensilsCrossed },
    { href: "/reserve", label: "Book a table", sub: "Takes under a minute", icon: CalendarCheck },
    { href: "/events", label: "What's on", sub: "Live music, DJ, matches", icon: Sparkles },
    { href: "/private-parties", label: "Team parties", sub: "20 to 250 guests", icon: PartyPopper },
    { href: general.mapUrl || "/contact", label: "Get directions", sub: general.landmark || "Whitefield", icon: MapPin, external: Boolean(general.mapUrl) },
  ];
  return (
    <nav aria-label="Quick links" className="container-x">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {links.map((l) => (
          <li key={l.label} className={l.href === "/menu" ? "col-span-2 md:col-span-1" : undefined}>
            <Link
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex h-full items-center gap-3 rounded-2xl bg-coal p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brass/10 text-brass transition group-hover:bg-brass group-hover:text-snow">
                <l.icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base font-bold leading-tight">{l.label}</span>
                <span className="block truncate text-xs text-muted">{l.sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
