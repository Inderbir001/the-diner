import Image from "next/image";
import Link from "next/link";
import type { HomeSettings } from "@diner/shared";

/** One large atmospheric photograph with concise copy about the rooftop experience. */
export function Rooftop({ home }: { home: HomeSettings }) {
  return (
    <section aria-labelledby="rooftop-title" className="bg-charcoal py-16 sm:py-20 lg:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        {home.storyImage && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] sm:aspect-[16/11] lg:col-span-6 lg:aspect-[4/5]">
            <Image src={home.storyImage} alt="The rooftop at The Diner" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-[center_40%]" />
          </div>
        )}
        <div className="lg:col-span-6">
          <p className="eyebrow">The rooftop</p>
          <h2 id="rooftop-title" className="mt-3 text-4xl text-ivory sm:text-5xl">
            {home.storyTitle}
          </h2>
          {home.storyBody && <p className="mt-5 text-lg leading-relaxed text-ivory/80">{home.storyBody}</p>}
          {home.experiences.length > 0 && (
            <dl className="mt-8 divide-y divide-ivory/10 border-y border-ivory/10">
              {home.experiences.map((x) => (
                <div key={x.title} className="grid gap-1 py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
                  <dt className="font-semibold text-ivory">{x.title}</dt>
                  <dd className="text-sm leading-relaxed text-ivory/70">{x.description}</dd>
                </div>
              ))}
            </dl>
          )}
          <Link href="/events" className="link-underline mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-gold">
            See what's on this week →
          </Link>
        </div>
      </div>
    </section>
  );
}
