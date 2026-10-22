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
            <ul className="grid gap-x-16 gap-y-2 md:grid-cols-2">
              {section.items.map((item) => (
                <li
                  key={item.id}
                  className={cn("group flex gap-5 rounded-2xl p-3 -mx-3 transition hover:bg-white/[0.03]", !item.is_available && "opacity-50")}
                >
                  {item.image_url && (
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl sm:size-24">
                      <Image src={item.image_url} alt={item.name} fill sizes="96px" className="object-cover transition duration-700 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="flex items-center gap-2 font-display text-xl">
                        <span
                          className={cn("inline-block size-3 shrink-0 rounded-[3px] border-2", item.is_veg ? "border-leaf" : "border-ember")}
                          title={item.is_veg ? "Vegetarian" : "Non-vegetarian"}
                        >
                          <span className={cn("m-auto mt-[1px] block size-1 rounded-full", item.is_veg ? "bg-leaf" : "bg-ember")} />
                        </span>
                        {item.name}
                      </h3>
                      <span className="mb-1 flex-1 border-b border-dotted border-white/15" aria-hidden />
                      <span className="shrink-0 font-semibold text-brass">
                        {item.price !== null ? formatPrice(item.price) : ""}
                        {item.price_note ? <span className="ml-1 text-xs font-normal text-muted">{item.price_note}</span> : null}
                      </span>
                    </div>
                    {item.description && <p className="mt-1.5 text-sm leading-relaxed text-sand">{item.description}</p>}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.is_signature && (
                        <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-brass">
                          <Sparkles className="size-3" /> House favourite
                        </span>
                      )}
                      {item.is_spicy && (
                        <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-ember">
                          <Flame className="size-3" /> Spicy
                        </span>
                      )}
                      {!item.is_available && <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Sold out today</span>}
                    </div>
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
