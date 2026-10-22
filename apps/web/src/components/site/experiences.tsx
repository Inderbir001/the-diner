"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { HomeSettings } from "@diner/shared";
import { cn } from "@/lib/utils";

/** Bold red block: hover or tap a title to swap the photo. */
export function Experiences({ items }: { items: HomeSettings["experiences"] }) {
  const [active, setActive] = useState(0);
  if (!items.length) return null;
  const current = items[active] ?? items[0];

  return (
    <section className="bg-brass py-24 text-cream sm:py-32" aria-labelledby="experiences-title">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-4 !text-ink">
            <span className="h-[3px] w-8 bg-ink" aria-hidden />
            The experience
          </p>
          <h2 id="experiences-title" className="sr-only">
            Experiences at The Diner
          </h2>
          <ul>
            {items.map((item, i) => (
              <li key={item.title} className="border-b-2 border-ink/15 last:border-0">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-start gap-5 py-5 text-left"
                  aria-pressed={active === i}
                >
                  <span className={cn("mt-2 font-display text-2xl transition-colors", active === i ? "text-ink" : "text-cream/50")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        "block font-display text-5xl leading-[0.9] transition-colors sm:text-7xl",
                        active === i ? "text-cream" : "text-cream/45 group-hover:text-cream/80",
                      )}
                    >
                      {item.title}
                    </span>
                    <span className={cn("grid transition-[grid-template-rows] duration-500", active === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <span className="overflow-hidden">
                        <span className="block max-w-md pt-3 text-base font-semibold text-cream/90">{item.description}</span>
                      </span>
                    </span>
                  </span>
                </button>
                {item.image && active === i && (
                  <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[24px] lg:hidden">
                    <Image src={item.image} alt={item.title} fill sizes="100vw" className="object-cover" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[32px] bg-ink shadow-2xl lg:col-span-6 lg:block">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={current.image}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {current.image && <Image src={current.image} alt={current.title} fill sizes="45vw" className="object-cover" />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
