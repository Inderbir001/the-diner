import Link from "next/link";
import type { SettingsMap } from "@diner/shared";
import { telHref, to12h } from "@/lib/utils";
import { Logo } from "./logo";
import { SocialIcon } from "./social-icon";

type Props = { settings: Pick<SettingsMap, "general" | "social" | "booking"> };

const FOOTER_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/private-parties", label: "Parties" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Visit" },
  { href: "/reserve", label: "Book a table" },
];

export function Footer({ settings: { general, social } }: Props) {
  const socials = [
    { key: "instagram", href: social.instagram, label: "Instagram" },
    { key: "youtube", href: social.youtube, label: "YouTube" },
    { key: "facebook", href: social.facebook, label: "Facebook" },
  ].filter((s) => s.href) as { key: "instagram" | "youtube" | "facebook"; href: string; label: string }[];
  const same = general.hours.length > 0 && general.hours.every((h) => !h.closed && h.open === general.hours[0].open && h.close === general.hours[0].close);

  return (
    <footer className="border-t border-ivory/10 bg-charcoal pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="container-x grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">{general.tagline}</p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex size-11 items-center justify-center rounded-[16px] border border-ivory/15 text-ivory/80 transition-colors duration-150 hover:border-gold hover:text-gold"
                >
                  <SocialIcon name={s.key} className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-3 md:col-span-8">
          <div>
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-gold">Visit</h2>
            <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-ivory/80">
              <p>{general.address.street}</p>
              <p>{general.address.locality}</p>
              <p>
                {general.address.city} {general.address.postalCode}
              </p>
            </address>
            {general.mapUrl && (
              <a href={general.mapUrl} target="_blank" rel="noopener noreferrer" className="link-underline mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-ivory">
                Get directions
              </a>
            )}
          </div>
          <div>
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-gold">Hours</h2>
            <div className="mt-4 text-sm leading-relaxed text-ivory/80">
              {same ? (
                <p>
                  Every day
                  <br />
                  {to12h(general.hours[0].open)} – {to12h(general.hours[0].close)}
                </p>
              ) : (
                <ul className="space-y-1">
                  {general.hours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-4">
                      <span>{h.day.slice(0, 3)}</span>
                      <span>{h.closed ? "Closed" : `${to12h(h.open)} – ${to12h(h.close)}`}</span>
                    </li>
                  ))}
                </ul>
              )}
              {general.hoursNote && <p className="mt-2 text-ivory/55">{general.hoursNote}</p>}
            </div>
          </div>
          <div>
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-gold">Contact</h2>
            <ul className="mt-4 text-sm">
              {general.phones.map((p) => (
                <li key={p}>
                  <a href={telHref(p)} className="link-underline inline-flex min-h-9 items-center text-ivory/80 hover:text-ivory">
                    {p}
                  </a>
                </li>
              ))}
              {general.email && (
                <li>
                  <a href={`mailto:${general.email}`} className="link-underline inline-flex min-h-9 items-center text-ivory/80 hover:text-ivory">
                    {general.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="inline-flex min-h-9 items-center hover:text-ivory">
                {l.label}
              </Link>
            ))}
            <Link href="/policy" className="inline-flex min-h-9 items-center hover:text-ivory">House policy</Link>
            <Link href="/privacy" className="inline-flex min-h-9 items-center hover:text-ivory">Privacy</Link>
            <Link href="/terms" className="inline-flex min-h-9 items-center hover:text-ivory">Terms</Link>
          </nav>
          <p>
            © {new Date().getFullYear()} {general.name}
            {general.legalName ? ` · ${general.legalName}` : ""}. Please drink responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
