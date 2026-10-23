import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Leaf } from "lucide-react";
import type { MenuItem } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

export function SignatureDishes({ dishes }: { dishes: MenuItem[] }) {
  const withPhotos = dishes.filter((d) => d.image_url).slice(0, 8);
  if (!withPhotos.length) return null;
  return (
    <section className="py-16 sm:py-32" aria-label="Signature dishes">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="From our kitchen" title="Order these first." />
          <Reveal>
            <Link href="/menu" className="btn-ghost shrink-0">
              Full menu <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-10 grid gap-3 sm:mt-12 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {withPhotos.map((dish, i) => (
            <Reveal as="li" key={dish.id} delay={(i % 4) * 0.06}>
              <Link href="/menu" className="group flex overflow-hidden rounded-[18px] sm:block sm:rounded-[22px] bg-coal ring-1 ring-white/10 transition hover:ring-brass">
                {/* phones: a compact row with the photo on the left */}
                <div className="relative min-h-28 w-28 shrink-0 overflow-hidden sm:aspect-[4/3] sm:min-h-0 sm:w-auto">
                  <Image
                    src={dish.image_url!}
                    alt={dish.name}
                    fill
                    sizes="(min-width:1024px) 23vw, (min-width:640px) 50vw, 120px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 hidden gap-1.5 sm:flex">
                    {dish.is_veg && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-leaf px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider text-ink">
                        <Leaf className="size-3" /> Veg
                      </span>
                    )}
                    {dish.is_spicy && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ember px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider text-ink">
                        <Flame className="size-3" /> Spicy
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 items-start justify-between gap-3 p-3.5 sm:p-5">
                  <div>
                    <h3 className="font-display text-xl leading-none sm:text-2xl lg:text-[1.7rem]">{dish.name}</h3>
                    {dish.description && <p className="mt-1.5 line-clamp-2 text-[0.8rem] leading-snug text-sand">{dish.description}</p>}
                  </div>
                  {dish.price !== null && (
                    <span className="shrink-0 rounded-full bg-brass px-2.5 py-1 font-display text-base leading-none text-cream sm:text-lg">{formatPrice(dish.price)}</span>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
