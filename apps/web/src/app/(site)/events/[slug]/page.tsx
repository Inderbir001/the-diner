import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Repeat, Ticket } from "lucide-react";
import { getEvent, getEvents, getSettings } from "@/lib/data";
import { breadcrumbJsonLd, eventJsonLd, pageMetadata } from "@/lib/seo";
import { renderMarkdown } from "@/lib/markdown";
import { formatEventDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { JsonLd } from "@/components/site/json-ld";
import { EventCard } from "@/components/site/event-card";

export const revalidate = 3600;

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return pageMetadata({
    title: event.title,
    description: event.summary ?? `${event.title} at The Diner Restobar, Whitefield.`,
    path: `/events/${event.slug}`,
    image: event.image_url,
  });
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const [event, events, { general, booking }] = await Promise.all([getEvent(slug), getEvents(), getSettings()]);
  if (!event) notFound();
  const others = events.filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          ...(event.is_recurring ? [] : [eventJsonLd(event, general)]),
          breadcrumbJsonLd([
            { name: "Events", path: "/events" },
            { name: event.title, path: `/events/${event.slug}` },
          ]),
        ]}
      />
      <PageHero
        eyebrow={event.is_recurring ? (event.recurrence_label ?? "Weekly") : formatEventDate(event.starts_at)}
        title={event.title}
        intro={event.summary}
        crumbs={[{ name: "Events", href: "/events" }, { name: event.title }]}
      />
      <article className="container-x pb-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {event.image_url && (
              <div className="relative mb-12 aspect-[16/10] overflow-hidden rounded-[28px]">
                <Image src={event.image_url} alt={event.title} fill priority sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
              </div>
            )}
            {event.body && <div className="prose prose-invert prose-lg prose-diner max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(event.body) }} />}
          </div>
          <aside className="lg:col-span-5">
            <div className="glass sticky top-28 space-y-5 rounded-[28px] p-8">
              <p className="flex items-center gap-3 text-sand">
                {event.is_recurring ? <Repeat className="size-5 text-brass" /> : <CalendarDays className="size-5 text-brass" />}
                {event.is_recurring ? event.recurrence_label : formatEventDate(event.starts_at)}
              </p>
              {event.price_label && (
                <p className="flex items-center gap-3 text-sand">
                  <Ticket className="size-5 text-brass" /> {event.price_label}
                </p>
              )}
              <div className="flex flex-col gap-3 pt-3">
                {event.cta_url ? (
                  <a href={event.cta_url} className="btn-primary !py-4" target={event.cta_url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {event.cta_label ?? "Get tickets"}
                  </a>
                ) : booking.enabled ? (
                  <Link href="/reserve" className="btn-primary !py-4">
                    Book a table for this
                  </Link>
                ) : null}
                <Link href="/events" className="btn-ghost">
                  All events
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {others.length > 0 && (
          <section className="mt-24" aria-label="More events">
            <h2 className="mb-8 font-display text-3xl">Also on</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
