import type { GeneralSettings } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { telHref, to12h, whatsappHref } from "@/lib/utils";
import { MapEmbed } from "./map-embed";
import { SectionHeading } from "./section-heading";
import { SocialIcon } from "./social-icon";

export function Visit({ general, headingAs = "h2" }: { general: GeneralSettings; headingAs?: "h1" | "h2" }) {
  const address = [general.address.street, general.address.locality, `${general.address.city} ${general.address.postalCode}`];
  return (
    <section className="container-x py-24 sm:py-32" aria-label="Visit us">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading as={headingAs} eyebrow="Find us" title="Pull up a chair in Whitefield." />
          <Reveal delay={0.1} className="mt-10 space-y-8">
            <div>
              <p className="label">Address</p>
              <address className="not-italic leading-relaxed text-cream">
                {address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
                {general.landmark && <span className="mt-1 block text-sm text-muted">{general.landmark}</span>}
              </address>
            </div>
            <div>
              <p className="label">Hours</p>
              <ul className="space-y-1 text-cream">
                {general.hours.map((h) => (
                  <li key={h.day} className="flex max-w-xs justify-between gap-6 text-sm">
                    <span className="text-sand">{h.day}</span>
                    <span>{h.closed ? "Closed" : `${to12h(h.open)} – ${to12h(h.close)}`}</span>
                  </li>
                ))}
              </ul>
              {general.hoursNote && <p className="mt-2 text-xs text-muted">{general.hoursNote}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              {general.phones[0] && (
                <a href={telHref(general.phones[0])} className="btn-ghost">
                  Call {general.phones[0]}
                </a>
              )}
              {general.whatsapp && (
                <a href={whatsappHref(general.whatsapp, "Hi! I'd like to know more about The Diner.")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <SocialIcon name="whatsapp" className="size-4" /> WhatsApp
                </a>
              )}
            </div>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7" delay={0.15}>
          {general.mapEmbedUrl && <MapEmbed src={general.mapEmbedUrl} title={`Map to ${general.name}`} directionsUrl={general.mapUrl} />}
        </Reveal>
      </div>
    </section>
  );
}
