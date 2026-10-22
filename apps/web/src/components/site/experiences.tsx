"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { HomeSettings } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Hover a title to swap the photo (desktop); stacked cards on mobile. */
export function Experiences({ items }: { items: HomeSettings["experiences"] }) {
  const [active, setActive] = useState(0);
  if (!items.length) return null;
  const current = items[active] ?? items[0];

  return (
    <section className="border-y border-white/[0.07] bg-coal py-24 sm:py-32" aria-labelledby="experiences-title">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-5">The experience</p>
          <h2 id="experiences-title" className="sr-only">
            Experiences at The Diner
          </h2>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {items.map((item, i) => (
              <li key={item.title}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-baseline gap-6 py-7 text-left"
                  aria-pressed={active === i}
                >
                  <span className="w-8 text-xs font-semibold text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        "block font-display text-3xl transition-all duration-500 sm:text-5xl",
                        active === i ? "translate-x-2 italic text-brass" : "text-cream/80 group-hover:text-cream",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-500",
                        active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block max-w-md pt-3 text-sand">{item.description}</span>
                      </span>
                    </span>
                  </span>
                </button>
                {item.image && (
                  <div className={cn("relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl lg:hidden", active !== i && "hidden")}>
                    <Image src={item.image} alt={item.title} fill sizes="100vw" className="object-cover" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="relative hidden lg:col-span-6 lg:block">
          <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[28px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.image}
                initial={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {current.image && (
                  <Image src={current.image} alt={current.title} fill sizes="(min-width:1024px) 45vw, 0px" className="object-cover" />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-8">
              <p className="font-display text-2xl italic">{current.title}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
