import { getEvents, getSettings } from "@/lib/data";
import { breadcrumbJsonLd, eventJsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
import { EventCard } from "@/components/site/event-card";
import { JsonLd } from "@/components/site/json-ld";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Events — Live Music, DJ Nights & Match Screenings",
  description:
    "What's on at The Diner Restobar, Whitefield: live band nights, weekend DJs, IPL and big-match screenings on the rooftop. See the line-up and book a table.",
  path: "/events",
});

export default async function EventsPage() {
  const [events, { general, home }] = await Promise.all([getEvents(), getSettings()]);
  const oneOff = events.filter((e) => !e.is_recurring);
  const recurring = events.filter((e) => e.is_recurring);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Events", path: "/events" }]), ...oneOff.map((e) => eventJsonLd(e, general))]} />
      <PageHero
        eyebrow="What's on"
        title="Something happening most nights."
        intro="Live bands, DJ sets and every big match on the rooftop screen. Follow us on Instagram for last-minute specials."
        crumbs={[{ name: "Events" }]}
      />
      {oneOff.length > 0 && (
        <section className="container-x pb-16" aria-label="Upcoming">
          <h2 className="mb-8 font-display text-3xl">Coming up</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {oneOff.map((e, i) => (
              <Reveal key={e.id} delay={(i % 3) * 0.08}>
                <EventCard event={e} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
      {recurring.length > 0 && (
        <section className="container-x pb-16" aria-label="Every week">
          <h2 className="mb-8 font-display text-3xl">Every week</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recurring.map((e, i) => (
              <Reveal key={e.id} delay={(i % 3) * 0.08}>
                <EventCard event={e} priority={oneOff.length === 0 && i < 3} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
      {events.length === 0 && <p className="container-x pb-24 text-sand">New events are announced soon — check back or follow us on Instagram.</p>}
      <CtaBand title="Make a night of it." image={home.experiences[1]?.image} />
    </>
  );
}
