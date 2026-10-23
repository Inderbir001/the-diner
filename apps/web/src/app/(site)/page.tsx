import Link from "next/link";
import { getEvents, getFaqs, getGallery, getMenu, getSettings, getSignatureDishes, getSocialPosts, getTestimonials } from "@/lib/data";
import { faqJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/env";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Story } from "@/components/site/story";
import { SignatureDishes } from "@/components/site/signature-dishes";
import { PriceBoard } from "@/components/site/price-board";
import { Drinks } from "@/components/site/drinks";
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
  const [settings, menu, dishes, events, faqs, testimonials, instagram, youtube, gallery] = await Promise.all([
    getSettings(),
    getMenu(),
    getSignatureDishes(),
    getEvents(),
    getFaqs(),
    getTestimonials(),
    getSocialPosts("instagram", 8),
    getSocialPosts("youtube", 3),
    getGallery(),
  ]);
  const { home, general, social, booking } = settings;
  const featuredEvents = [...events].sort((a, b) => Number(b.is_featured) - Number(a.is_featured)).slice(0, 3);

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <Hero home={home} general={general} bookingEnabled={booking.enabled} />
      {/* two tapes crossing: prices one way, the vibe the other */}
      <div className="relative overflow-hidden py-6 sm:py-10">
        <Marquee items={home.marquee} className="relative z-10 -mx-4 -rotate-2 shadow-2xl shadow-black/60" />
        {home.experiences.length > 0 && (
          <Marquee
            items={[...home.experiences.map((e) => e.title), "Open till 12:30 AM"]}
            reverse
            small
            duration={30}
            className="-mx-4 -mt-4 rotate-[1.5deg] border-y border-white/10 !bg-coal py-3 sm:-mt-6"
          />
        )}
      </div>
      <SignatureDishes dishes={dishes} />
      <PriceBoard home={home} menu={menu} />
      <Drinks menu={menu} />
      <Story home={home} />
      <Experiences items={home.experiences} />

      {featuredEvents.length > 0 && (
        <section className="container-x py-16 sm:py-32" aria-label="Upcoming events">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="What's on" title="Something on every night." />
            <Reveal>
              <Link href="/events" className="btn-ghost shrink-0">
                All events →
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.08}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <InstagramFeed posts={instagram} social={social} fallbackImages={gallery} />
      <YouTubeFeed videos={youtube} social={social} />
      <Testimonials items={testimonials} reviewsUrl={social.googleReviews} />

      <CtaBand image={home.heroSideImages[0] ?? home.storyImage} />

      {faqs.length > 0 && (
        <section className="container-x py-16 sm:py-32" aria-label="Frequently asked questions">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Good to know" title="Questions, answered." />
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
