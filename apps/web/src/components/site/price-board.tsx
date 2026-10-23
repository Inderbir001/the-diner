import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HomeSettings } from "@diner/shared";
import type { MenuSection } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

/** "From ₹X" groups, worked out from the live menu so they never go stale. */
const FROM: [label: string, slugs: string[], match?: RegExp][] = [
  ["Starters", ["veg-starters", "chicken-starters", "mutton-starters", "seafood", "egg"]],
  ["Biryani", ["biryanis"], /biryani/i],
  ["Mains", ["mains"]],
  ["Draught beer", ["beer"], /draught|beer/i],
  ["Cocktails", ["cocktails"]],
  ["Shooters", ["shooters"]],
];

export function fromPrices(menu: MenuSection[]) {
  return FROM.flatMap(([label, slugs, match]) => {
    const prices = menu
      .filter((s) => slugs.includes(s.slug))
      .flatMap((s) => s.items)
      .filter((i) => i.price !== null && i.is_available && (!match || match.test(i.name)))
      .map((i) => i.price!);
    return prices.length ? [{ label, price: Math.min(...prices) }] : [];
  });
}

/** Paper-coloured block that sells the prices: big deal tiles plus "from" prices pulled from the menu. */
export function PriceBoard({ home, menu }: { home: HomeSettings; menu: MenuSection[] }) {
  const from = fromPrices(menu);
  if (!home.deals.length && !from.length) return null;

  return (
    <section className="bg-paper py-24 text-ink sm:py-32" aria-label="Best prices" id="best-prices">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Best prices" title={home.dealsTitle} intro={home.dealsIntro || undefined} tone="light" />
          <Reveal>
            <Link href="/menu" className="btn-dark shrink-0">
              See every price <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        {home.deals.length > 0 && (
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4">
            {home.deals.map((d, i) => {
              const tile = (
                <>
                  <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-ink/55 sm:text-xs sm:tracking-[0.18em]">{d.note || " "}</span>
                  <span className="mt-2 block font-display text-5xl leading-[0.85] text-brass sm:mt-4 sm:text-8xl">{d.price}</span>
                  <span className="mt-2 block text-sm font-bold leading-snug sm:mt-4 sm:text-lg">{d.title}</span>
                </>
              );
              return (
                <Reveal as="li" key={d.title} delay={i * 0.06}>
                  {d.href ? (
                    <Link href={d.href} className="group relative block h-full rounded-[20px] bg-cream p-4 ring-1 ring-ink/10 transition sm:rounded-[28px] sm:p-7 hover:-translate-y-1 hover:ring-brass">
                      {tile}
                      <ArrowUpRight className="absolute right-3 top-3 size-4 sm:right-6 sm:top-6 sm:size-5 text-ink/30 transition group-hover:text-brass" />
                    </Link>
                  ) : (
                    <div className="h-full rounded-[20px] bg-cream p-4 ring-1 sm:rounded-[28px] sm:p-7 ring-ink/10">{tile}</div>
                  )}
                </Reveal>
              );
            })}
          </ul>
        )}

        {from.length > 0 && (
          <Reveal>
            <dl className="mt-3 grid grid-cols-3 overflow-hidden rounded-[20px] bg-ink text-cream sm:mt-4 sm:rounded-[28px] lg:grid-cols-6">
              {from.map((f) => (
                <div key={f.label} className="border-b border-r border-white/10 p-3 sm:p-6">
                  <dt className="text-[0.55rem] font-extrabold uppercase tracking-[0.12em] text-sand sm:text-xs sm:tracking-[0.18em]">{f.label} from</dt>
                  <dd className="mt-1 font-display text-3xl leading-none sm:mt-2 sm:text-5xl">{formatPrice(f.price)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </section>
  );
}
