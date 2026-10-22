import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getEvents, getFaqs, getGallery, getMenu, getSettings, getSignatureDishes, getSocialPosts, getTestimonials } from "@/lib/data";
import { faqJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/env";
import { Hero } from "@/components/site/hero";
import { QuickLinks } from "@/components/site/quick-links";
import { Marquee } from "@/components/site/marquee";
import { Deals } from "@/components/site/deals";
import { Story } from "@/components/site/story";
import { SignatureDishes } from "@/components/site/signature-dishes";
import { Experiences } from "@/components/site/experiences";
import { EventCard } from "@/components/site/event-card";
import { InstagramFeed, YouTubeFeed } from "@/components/site/social-feed";
import { Testimonials } from "@/components/site/testimonials";
import { FaqList } from "@/components/site/faq-list";
import { Visit } from "@/components/site/visit";
import { CtaBand } from "@/components/site/cta-band";
import { SectionHeading } from "@/components/site/section-heading";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 3600;

export const metadata = { alternates: { canonical: SITE_URL } };

export default async function HomePage() {
  const [settings, dishes, menu, events, faqs, testimonials, instagram, youtube, gallery] = await Promise.all([
    getSettings(),
    getSignatureDishes(),
    getMenu(),
    getEvents(),
    getFaqs(),
    getTestimonials(),
    getSocialPosts("instagram", 8),
    getSocialPosts("youtube", 3),
    getGallery(),
  ]);
  const { home, general, social, booking } = settings;
  const featuredEvents = [...events].sort((a, b) => Number(b.is_featured) - Number(a.is_featured)).slice(0, 3);
  const starterPrices = menu
    .filter((s) => s.slug.startsWith("starters"))
    .flatMap((s) => s.items.map((i) => i.price))
    .filter((p): p is number => p !== null);
  const startersFrom = starterPrices.length ? Math.min(...starterPrices) : null;

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <Hero home={home} general={general} bookingEnabled={booking.enabled} startersFrom={startersFrom} />
      <QuickLinks general={general} />
      <SignatureDishes dishes={dishes} />
      <Marquee items={home.marquee} />
      <Deals home={home} />

      {featuredEvents.length > 0 && (
        <section className="pb-20 text-snow sm:pb-24" aria-label="What's on">
          <div className="container-x pt-4">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading tone="dark" eyebrow="What's on" title="Something on every night" />
              <Reveal>
                <Link href="/events" className="btn-ghost">
                  All events <ArrowRight className="size-4" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((e, i) => (
                <Reveal key={e.id} delay={i * 0.06}>
                  <EventCard event={e} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Experiences items={home.experiences} />
      <Story home={home} />
      <Testimonials items={testimonials} reviewsUrl={social.googleReviews} />
      <InstagramFeed posts={instagram} social={social} fallbackImages={gallery} />
      <YouTubeFeed videos={youtube} social={social} />
      <CtaBand image={home.heroSideImages[0] ?? home.storyImage} />

      {faqs.length > 0 && (
        <section className="container-x py-20 sm:py-24" aria-label="Frequently asked questions">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Good to know" title="Questions, answered" />
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </section>
      )}

      <Visit general={general} />
    </>
  );
}
