import Image from "next/image";
import { Check } from "lucide-react";
import { getSettings } from "@/lib/data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/site/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Private Parties & Corporate Events in Whitefield",
  description:
    "Host team parties, birthdays and corporate events for 20–250 guests at The Diner Restobar, Whitefield near ITPL. Rooftop & private dining, food and bar packages from ₹800 per guest.",
  path: "/private-parties",
});

const OCCASIONS = ["Team lunches & dinners", "Office parties & offsites", "Birthdays & anniversaries", "Farewells & promotions", "Product launches", "Match-night takeovers"];

export default async function PrivatePartiesPage() {
  const { home } = await getSettings();
  const parties = home.experiences.find((e) => /part/i.test(e.title)) ?? home.experiences[0];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Private parties", path: "/private-parties" }])} />
      <PageHero
        eyebrow="Parties & events"
        title="Bring the whole team. We'll handle the rest."
        intro="Rooftop or private dining, 20 to 250 guests, set menus and a bar that keeps up. Tell us the date and headcount and we'll put a plan together."
        image={parties?.image}
        crumbs={[{ name: "Private parties" }]}
      />

      {home.partyPackages.length > 0 && (
        <section className="container-x py-16" aria-label="Packages">
          <div className="grid gap-5 md:grid-cols-3">
            {home.partyPackages.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <article className="relative h-full overflow-hidden rounded-[28px] bg-coal p-8 ring-1 ring-white/10 transition hover:ring-brass sm:p-10">
                  <span className="absolute -right-6 -top-10 font-display text-[10rem] leading-none text-white/[0.04]">{i + 1}</span>
                  <p className="eyebrow">{p.name}</p>
                  <p className="mt-4 font-display text-6xl leading-none text-cream">{p.price}</p>
                  <p className="mt-4 max-w-sm text-sand">{p.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">Packages are indicative and may change. Final pricing is confirmed with your event plan.</p>
        </section>
      )}

      <section className="container-x py-24" aria-label="Occasions">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Made for" title="Any excuse to get everyone together." />
            <ul className="mt-10 space-y-4">
              {OCCASIONS.map((o, i) => (
                <Reveal as="li" key={o} delay={i * 0.05} className="flex items-center gap-4 text-lg text-sand">
                  <span className="inline-flex size-7 items-center justify-center rounded-full bg-brass/15 text-brass">
                    <Check className="size-4" />
                  </span>
                  {o}
                </Reveal>
              ))}
            </ul>
            {home.experiences[0]?.image && (
              <div className="relative mt-12 hidden aspect-[4/3] overflow-hidden rounded-[28px] lg:block">
                <Image src={home.experiences[0].image} alt="The rooftop at The Diner" fill sizes="40vw" className="object-cover" />
              </div>
            )}
          </div>
          <div className="lg:col-span-7" id="enquire">
            <EnquiryForm defaultType="party" showEventFields />
          </div>
        </div>
      </section>
    </>
  );
}
