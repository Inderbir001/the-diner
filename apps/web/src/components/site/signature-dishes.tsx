import Image from "next/image";
import Link from "next/link";
import { Flame, Leaf } from "lucide-react";
import type { MenuItem } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

export function SignatureDishes({ dishes }: { dishes: MenuItem[] }) {
  if (!dishes.length) return null;
  return (
    <section className="py-24 sm:py-32" aria-label="Signature dishes">
      <div className="container-x flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading eyebrow="From the kitchen" title="The ones people come back for." />
        <Reveal>
          <Link href="/menu" className="btn-ghost shrink-0">
            Full menu →
          </Link>
        </Reveal>
      </div>

      <div className="scrollbar-none mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-[max(3rem,calc((100vw-1320px)/2+3rem))]">
        {dishes.map((dish, i) => (
          <Reveal key={dish.id} delay={i * 0.06} className="w-[78vw] max-w-[340px] shrink-0 snap-start">
            <article className="group relative flex h-[440px] flex-col justify-end overflow-hidden rounded-[28px] border border-white/10 bg-smoke">
              {dish.image_url ? (
                <Image
                  src={dish.image_url}
                  alt={dish.name}
                  fill
                  sizes="340px"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(245_165_36/0.35),transparent_60%),radial-gradient(circle_at_80%_80%,rgb(232_71_62/0.25),transparent_55%)]">
                  <span className="absolute left-6 top-6 font-display text-8xl italic text-white/[0.06]">{String(i + 1).padStart(2, "0")}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="relative p-6">
                <div className="mb-3 flex gap-2">
                  {dish.is_veg ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-leaf/20 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-leaf">
                      <Leaf className="size-3" /> Veg
                    </span>
                  ) : null}
                  {dish.is_spicy ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ember/20 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-ember">
                      <Flame className="size-3" /> Spicy
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display text-2xl leading-tight">{dish.name}</h3>
                {dish.description && <p className="mt-2 line-clamp-2 text-sm text-sand">{dish.description}</p>}
                {dish.price !== null && <p className="mt-4 text-sm font-semibold text-brass">{formatPrice(dish.price)}</p>}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
