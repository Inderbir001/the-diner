import Link from "next/link";
import { ArrowUpRight, BadgePercent } from "lucide-react";
import type { HomeSettings } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";

/** "Best prices" block — every deal is editable in Admin → Settings → Home page. */
export function Deals({ home }: { home: HomeSettings }) {
  if (!home.deals.length) return null;
  return (
    <section className="py-20 text-snow sm:py-24" aria-label="Deals and prices">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading tone="dark" eyebrow="Best prices in Whitefield" title={home.dealsTitle} intro={home.dealsIntro} />
          <Reveal>
            <Link href="/menu" className="btn-primary shrink-0">
              See all prices <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.deals.map((d, i) => {
            const inner = (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brass/15 px-3 py-1 text-xs font-bold text-brass-light">
                  <BadgePercent className="size-3.5" /> {d.note || "Everyday value"}
                </span>
                <p className="text-aurora mt-6 font-display text-6xl font-extrabold leading-none tracking-tight">{d.price}</p>
                <p className="mt-3 text-lg font-semibold text-snow/85">{d.title}</p>
                {d.href && <ArrowUpRight className="absolute right-5 top-5 size-5 text-snow/40 transition group-hover:text-brass-light" />}
              </>
            );
            const cls = "card group relative block h-full p-6 transition hover:-translate-y-1 hover:border-flame/50";
            return (
              <Reveal as="li" key={d.title} delay={i * 0.06}>
                {d.href ? (
                  <Link href={d.href} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
