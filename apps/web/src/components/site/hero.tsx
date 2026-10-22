import Image from "next/image";
import Link from "next/link";
import type { GeneralSettings, HomeSettings } from "@diner/shared";
import { to12h } from "@/lib/utils";

/** "Rooftop nights.|Bold Andhra flavours." — the part after | becomes the second, italic line. */
function headline(title: string) {
  const [first, ...rest] = title.split("|");
  return { first: first.trim(), second: rest.join(" ").trim() };
}

/** Full-screen rooftop photograph with the headline anchored low, so there's no empty band under it. */
export function Hero({ home, general, bookingEnabled }: { home: HomeSettings; general: GeneralSettings; bookingEnabled: boolean }) {
  const { first, second } = headline(home.heroTitle || general.name);
  const closes = general.hours[0] && !general.hours[0].closed ? `Open till ${to12h(general.hours[0].close)}` : null;
  const utility = [closes, general.landmark].filter(Boolean).join(" · ");

  return (
    <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-charcoal lg:min-h-[100svh]">
      {home.heroImage && (
        <Image src={home.heroImage} alt={`Guests on the rooftop at ${general.name}`} fill priority sizes="100vw" quality={85} className="-z-10 object-cover" />
      )}
      {/* photographic overlays for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/75 via-charcoal/25 to-transparent" aria-hidden />

      <div className="container-x pb-12 pt-28 sm:pb-16 lg:pb-24">
        {home.heroEyebrow && <p className="eyebrow">{home.heroEyebrow}</p>}
        <h1 className="mt-4 max-w-4xl text-[2.9rem] leading-[1.02] text-ivory sm:text-6xl lg:text-[5.6rem]">
          {first}
          {second && (
            <>
              <br />
              <em className="text-gold">{second}</em>
            </>
          )}
        </h1>
        {home.heroSubtitle && <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory/85 sm:text-xl">{home.heroSubtitle}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {bookingEnabled && (
            <Link href="/reserve" className="btn-primary !px-8">
              Book a table
            </Link>
          )}
          <Link href="/menu" className="btn-ghost !px-8">
            View the menu
          </Link>
        </div>
        {utility && <p className="mt-6 text-sm font-medium text-ivory/70">{utility}</p>}
      </div>
    </section>
  );
}
