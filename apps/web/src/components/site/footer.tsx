import Link from "next/link";
import type { SettingsMap } from "@diner/shared";
import { telHref, to12h } from "@/lib/utils";
import { Logo } from "./logo";
import { NAV_LINKS } from "./nav-links";
import { SocialIcon } from "./social-icon";

type Props = { settings: Pick<SettingsMap, "general" | "social" | "booking"> };

export function Footer({ settings: { general, social, booking } }: Props) {
  const socials = [
    { key: "instagram", href: social.instagram, label: "Instagram" },
    { key: "youtube", href: social.youtube, label: "YouTube" },
    { key: "facebook", href: social.facebook, label: "Facebook" },
  ].filter((s) => s.href) as { key: "instagram" | "youtube" | "facebook"; href: string; label: string }[];
  const sameHours = general.hours.length > 0 && general.hours.every((h) => h.open === general.hours[0].open && h.close === general.hours[0].close && !h.closed);

  return (
    <footer className="glass-strong relative mt-16 !border-x-0 !border-b-0 pb-28 pt-20 lg:pb-12">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="light" className="origin-left scale-125" />
            <p className="mt-8 max-w-sm text-snow/70">{general.tagline}</p>
            {booking.enabled && (
              <Link href="/reserve" className="btn-primary mt-8">
                Reserve your table
              </Link>
            )}
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="mb-4 text-sm font-bold text-brass-light">Visit</h2>
              <address className="space-y-1 text-sm not-italic leading-relaxed text-snow/70">
                <p>{general.address.street}</p>
                <p>{general.address.locality}</p>
                <p>
                  {general.address.city} {general.address.postalCode}
                </p>
                {general.landmark && <p className="text-snow/50">{general.landmark}</p>}
              </address>
              {general.mapUrl && (
                <a href={general.mapUrl} target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-block text-sm text-snow">
                  Get directions ↗
                </a>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-sm font-bold text-brass-light">Hours</h2>
              <ul className="space-y-1 text-sm text-snow/70">
                {sameHours ? (
                  <li>
                    Every day
                    <br />
                    {to12h(general.hours[0].open)} – {to12h(general.hours[0].close)}
                  </li>
                ) : (
                  general.hours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-4">
                      <span>{h.day.slice(0, 3)}</span>
                      <span>{h.closed ? "Closed" : `${to12h(h.open)} – ${to12h(h.close)}`}</span>
                    </li>
                  ))
                )}
              </ul>
              {general.hoursNote && <p className="mt-3 text-xs text-snow/50">{general.hoursNote}</p>}
            </div>

            <div>
              <h2 className="mb-4 text-sm font-bold text-brass-light">Contact</h2>
              <ul className="space-y-1 text-sm">
                {general.phones.map((p) => (
                  <li key={p}>
                    <a href={telHref(p)} className="link-underline text-snow/70 hover:text-snow">
                      {p}
                    </a>
                  </li>
                ))}
                {general.email && (
                  <li>
                    <a href={`mailto:${general.email}`} className="link-underline text-snow/70 hover:text-snow">
                      {general.email}
                    </a>
                  </li>
                )}
              </ul>
              {socials.length > 0 && (
                <div className="mt-5 flex gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex bg-white/10 size-10 items-center justify-center rounded-full text-snow/70 transition hover:text-brass"
                    >
                      <SocialIcon name={s.key} className="size-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 text-xs text-snow/50 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-snow">
                {l.label}
              </Link>
            ))}
            <Link href="/policy" className="hover:text-snow">House policy</Link>
            <Link href="/privacy" className="hover:text-snow">Privacy</Link>
            <Link href="/terms" className="hover:text-snow">Terms</Link>
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
