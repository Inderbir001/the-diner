"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Leaf, Search, X } from "lucide-react";
import type { MenuSection } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";
import { DishCard } from "./dish-card";

type Kind = "all" | "food" | "drinks";

const minPrice = (s: MenuSection) => {
  const prices = s.items.map((i) => i.price).filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : null;
};

export function MenuBrowser({ sections }: { sections: MenuSection[] }) {
  const [kind, setKind] = useState<Kind>("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(sections[0]?.slug ?? "");
  const chipsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return sections
      .filter((s) => kind === "all" || s.kind === kind)
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (i) => (!vegOnly || i.is_veg) && (!term || i.name.toLowerCase().includes(term) || i.description?.toLowerCase().includes(term)),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, kind, vegOnly, q]);

  // highlight the last category whose heading has scrolled under the sticky bars
  useEffect(() => {
    const els = filtered.map((s) => document.getElementById(s.slug)).filter(Boolean) as HTMLElement[];
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = window.innerWidth >= 1024 ? 160 : 260;
        let current = els[0]?.id;
        for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
        if (current) setActive(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [filtered]);

  // keep the active mobile chip visible without moving the page
  useEffect(() => {
    const bar = chipsRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const searchBox = (
    <label className="relative block">
      <span className="sr-only">Search the menu</span>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes or drinks" className="field !rounded-full !py-2.5 !pl-10 text-sm" />
      {q && (
        <button type="button" onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label="Clear search">
          <X className="size-4" />
        </button>
      )}
    </label>
  );

  const filters = (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 rounded-full bg-smoke p-1" role="radiogroup" aria-label="Food or drinks">
        {(["all", "food", "drinks"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={kind === k}
            onClick={() => setKind(k)}
            className={cn("flex-1 rounded-full px-3 py-1.5 text-sm font-bold capitalize transition", kind === k ? "bg-coal text-cream shadow-card" : "text-muted hover:text-cream")}
          >
            {k}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setVegOnly((v) => !v)}
        aria-pressed={vegOnly}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition",
          vegOnly ? "border-leaf bg-leaf text-snow" : "border-black/12 bg-coal text-sand hover:border-leaf hover:text-leaf",
        )}
      >
        <Leaf className="size-4" /> Veg
      </button>
    </div>
  );

  return (
    <div className="container-x pb-10">
      {/* mobile: sticky chips + controls */}
      <div className="sticky top-[72px] z-30 -mx-5 border-b border-black/[0.07] bg-ink/95 px-5 pb-3 pt-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:hidden">
        <div className="grid gap-2.5">
          {searchBox}
          {filters}
        </div>
        <div ref={chipsRef} className="scrollbar-none -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
          {filtered.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              data-slug={s.slug}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition",
                active === s.slug ? "bg-cream text-ink" : "bg-coal text-sand shadow-card",
              )}
            >
              {s.name}
            </a>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
        {/* desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-[96px] space-y-4">
            {searchBox}
            {filters}
            <nav aria-label="Menu categories" className="rounded-3xl bg-coal p-2 shadow-card">
              <ul>
                {filtered.map((s) => {
                  const from = minPrice(s);
                  return (
                    <li key={s.slug}>
                      <a
                        href={`#${s.slug}`}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-[0.95rem] font-semibold transition",
                          active === s.slug ? "bg-brass text-snow" : "text-sand hover:bg-smoke hover:text-cream",
                        )}
                      >
                        <span className="truncate">{s.name}</span>
                        <span className={cn("shrink-0 text-xs font-bold", active === s.slug ? "text-snow/80" : "text-muted")}>
                          {from !== null ? `from ${formatPrice(from)}` : s.items.length}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        <div className="mt-8 space-y-16 lg:mt-0">
          {filtered.length === 0 && (
            <div className="rounded-3xl bg-coal p-12 text-center shadow-card">
              <p className="text-lg font-semibold">Nothing matches that.</p>
              <button type="button" className="btn-ghost mt-4" onClick={() => { setQ(""); setVegOnly(false); setKind("all"); }}>
                Clear filters
              </button>
            </div>
          )}
          {filtered.map((section, si) => {
            const from = minPrice(section);
            return (
              <section key={section.id} id={section.slug} className="scroll-mt-[230px] lg:scroll-mt-[96px]" aria-labelledby={`${section.slug}-h`}>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id={`${section.slug}-h`} className="text-3xl sm:text-4xl">
                      {section.name}
                    </h2>
                    {section.description && <p className="mt-1.5 text-sand">{section.description}</p>}
                  </div>
                  {from !== null && (
                    <span className="rounded-full bg-brass/10 px-3.5 py-1.5 text-sm font-bold text-brass">from {formatPrice(from)}</span>
                  )}
                </div>
                <ul className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                  {section.items.map((item, i) => (
                    <li key={item.id}>
                      <DishCard dish={item} priority={si === 0 && i < 3} sizes="(min-width:1280px) 300px, 50vw" />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          <p className="text-center text-sm text-muted">
            Prices in INR, exclusive of taxes. Some photos are for illustration. Please tell your server about any allergies.
          </p>
        </div>
      </div>
    </div>
  );
}
