import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MenuItem } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { DishCard } from "./dish-card";

export function SignatureDishes({ dishes }: { dishes: MenuItem[] }) {
  const shown = dishes.filter((d) => d.image_url).slice(0, 8);
  if (!shown.length) return null;
  return (
    <section className="py-20 sm:py-28" aria-label="Signature dishes">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Our menu is our jaan" title="Dishes people come back for" intro="Andhra spice, tandoor smoke and bar bites done right — at prices that make sense." />
          <Reveal>
            <Link href="/menu" className="btn-ghost shrink-0">
              Full menu <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {shown.map((dish, i) => (
            <Reveal as="li" key={dish.id} delay={(i % 4) * 0.05}>
              <Link href="/menu" className="block h-full">
                <DishCard dish={dish} />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
