import Image from "next/image";
import type { HomeSettings } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";

/** Four photo tiles: rooftop, music, matches, parties. */
export function Experiences({ items }: { items: HomeSettings["experiences"] }) {
  if (!items.length) return null;
  return (
    <section className="py-20 sm:py-28" aria-label="The experience">
      <div className="container-x">
        <SectionHeading eyebrow="More than a meal" title="One place for every kind of night" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 0.06}>
              <article className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl bg-night shadow-card">
                {item.image && (
                  <Image src={item.image} alt={item.title} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
                <div className="relative p-6 text-snow">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-snow/80">{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
