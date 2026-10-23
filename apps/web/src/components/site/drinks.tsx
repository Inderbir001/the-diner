import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MenuSection } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

/** The bar, straight from the drinks side of the menu: swipe on phones, a grid on desktop. */
export function Drinks({ menu }: { menu: MenuSection[] }) {
  const drinks = menu
    .filter((s) => s.kind === "drinks")
    .flatMap((s) => s.items)
    .filter((i) => i.image_url && i.is_available)
    .slice(0, 8);
  if (!drinks.length) return null;

  return (
    <section className="overflow-hidden py-16 sm:py-32" aria-label="Drinks" id="drinks">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="At the bar"
            title="Cold ones & cocktails."
            intro="Draught and craft on tap, buckets for the table and cocktails shaken till last call."
          />
          <Reveal>
            <Link href="/menu#cocktails" className="btn-ghost shrink-0">
              Drinks menu <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </div>

      {/* one card and a peek of the next on phones; four across on desktop */}
      <ul className="scrollbar-none mt-10 flex sm:mt-14 snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8 lg:container-x lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible">
        {drinks.map((d, i) => (
          <Reveal as="li" key={d.id} delay={(i % 4) * 0.06} className="w-[64%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
            <Link href="/menu#cocktails" className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-coal ring-1 ring-white/10 transition hover:ring-brass sm:rounded-[28px]">
              {/* drink photos come in every shape: show the whole photo over a blurred copy of itself */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={d.image_url!} alt="" aria-hidden fill sizes="64px" className="scale-125 object-cover opacity-60 blur-2xl" />
                <Image
                  src={d.image_url!}
                  alt={d.name}
                  fill
                  sizes="(min-width:1024px) 25vw, 60vw"
                  className="object-contain transition-transform duration-700 group-hover:scale-105"
                />
                {d.price !== null && (
                  <span className="absolute right-3 top-3 rounded-full bg-brass px-3 py-1.5 font-display text-xl leading-none text-cream shadow-lg shadow-black/40 sm:text-2xl">
                    {formatPrice(d.price)}
                  </span>
                )}
              </div>
              <div className="flex-1 p-4 sm:p-5">
                <h3 className="font-display text-2xl leading-none text-cream sm:text-3xl">{d.name}</h3>
                {d.description && <p className="mt-1.5 line-clamp-2 text-[0.8rem] leading-snug text-sand sm:text-sm">{d.description}</p>}
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
