"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Flame, Leaf, Search, Sparkles, X } from "lucide-react";
import type { MenuSection } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";

type Kind = "all" | "food" | "drinks";

export function MenuBrowser({ sections }: { sections: MenuSection[] }) {
  const [kind, setKind] = useState<Kind>("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(sections[0]?.slug ?? "");
  const tabsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return sections
      .filter((s) => kind === "all" || s.kind === kind)
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (i) =>
            (!vegOnly || i.is_veg) &&
            (!term || i.name.toLowerCase().includes(term) || i.description?.toLowerCase().includes(term)),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, kind, vegOnly, q]);

  // highlight the category currently in view
  useEffect(() => {
    const els = filtered.map((s) => document.getElementById(s.slug)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered]);

  useEffect(() => {
    tabsRef.current?.querySelector(`[data-slug="${active}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <div>
      <div className="sticky top-[5.25rem] z-30 sm:top-24">
        <div className="container-x">
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-coal p-3 shadow-2xl shadow-black/60 lg:flex-row lg:items-center">
            <div className="flex shrink-0 gap-1 rounded-full bg-white/[0.04] p-1" role="radiogroup" aria-label="Food or drinks">
              {(["all", "food", "drinks"] as const).map((k) => (
                <button
                  key={k}
                  role="radio"
                  aria-checked={kind === k}
                  onClick={() => setKind(k)}
                  className={cn("relative rounded-full px-4 py-2 text-sm font-semibold capitalize transition", kind === k ? "text-ink" : "text-sand hover:text-cream")}
                >
                  {kind === k && <motion.span layoutId="kind" className="absolute inset-0 -z-0 rounded-full bg-brass" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                  <span className="relative">{k}</span>
                </button>
              ))}
            </div>

            <div ref={tabsRef} className="scrollbar-none mask-fade-x -mx-1 flex flex-1 gap-1 overflow-x-auto px-1">
              {filtered.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  data-slug={s.slug}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition",
                    active === s.slug ? "bg-white/10 text-cream" : "text-muted hover:text-cream",
                  )}
                >
                  {s.name}
                </a>
              ))}
            </div>

            <div className="flex shrink-0 gap-2">
              <label className="relative flex-1 lg:w-56 lg:flex-none">
                <span className="sr-only">Search the menu</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search dishes"
                  className="field !rounded-full !py-2 !pl-10 text-sm"
                />
                {q && (
                  <button type="button" onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label="Clear search">
                    <X className="size-4" />
                  </button>
                )}
              </label>
              <button
                type="button"
                onClick={() => setVegOnly((v) => !v)}
                aria-pressed={vegOnly}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  vegOnly ? "border-leaf bg-leaf/20 text-leaf" : "border-white/10 text-sand hover:text-cream",
                )}
              >
                <Leaf className="size-4" /> Veg
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x mt-16 space-y-24">
        {filtered.length === 0 && <p className="py-20 text-center text-sand">Nothing matches that. Try another search.</p>}
        {filtered.map((section) => (
          <section key={section.id} id={section.slug} className="scroll-mt-48" aria-labelledby={`${section.slug}-h`}>
            <div className="mb-10 grid gap-4 border-b border-white/10 pb-6 md:grid-cols-12 md:items-end">
              <h2 id={`${section.slug}-h`} className="font-display text-4xl sm:text-5xl md:col-span-7">
                {section.name}
              </h2>
              {section.description && <p className="text-sand md:col-span-5 md:text-right">{section.description}</p>}
            </div>
            {/* photo cards: one per row on phones, never two cramped columns */}
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "group flex flex-col overflow-hidden rounded-[28px] bg-coal ring-1 ring-white/10 transition hover:ring-brass",
                    !item.is_available && "opacity-50",
                  )}
                >
                  {item.image_url && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        {item.is_signature && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brass px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider text-cream">
                            <Sparkles className="size-3" /> House favourite
                          </span>
                        )}
                        {item.is_spicy && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-ember px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider text-ink">
                            <Flame className="size-3" /> Spicy
                          </span>
                        )}
                      </div>
                      {!item.is_available && (
                        <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-2 text-center text-xs font-extrabold uppercase tracking-wider text-cream">Sold out today</span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="flex items-start gap-2.5 font-display text-3xl leading-none sm:text-4xl">
                        <span
                          className={cn("mt-1.5 inline-flex size-3.5 shrink-0 rounded-[3px] border-2", item.is_veg ? "border-leaf" : "border-ember")}
                          title={item.is_veg ? "Vegetarian" : "Non-vegetarian"}
                        >
                          <span className={cn("m-auto block size-1.5 rounded-full", item.is_veg ? "bg-leaf" : "bg-ember")} />
                        </span>
                        {item.name}
                      </h3>
                      {item.price !== null && (
                        <span className="shrink-0 rounded-full bg-brass px-3 py-1.5 font-display text-2xl leading-none text-cream">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>
                    {item.price_note && <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">{item.price_note}</p>}
                    {item.description && <p className="mt-3 text-sm leading-relaxed text-sand">{item.description}</p>}
                    {!item.image_url && (item.is_signature || item.is_spicy) && (
                      <p className="mt-3 flex gap-3 text-[0.65rem] font-extrabold uppercase tracking-wider">
                        {item.is_signature && <span className="text-brass">House favourite</span>}
                        {item.is_spicy && <span className="text-ember">Spicy</span>}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="text-center text-xs text-muted">Prices in INR, exclusive of taxes. Please tell your server about any allergies.</p>
      </div>
    </div>
  );
}
