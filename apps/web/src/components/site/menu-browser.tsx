"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Flame, Leaf, Search, Sparkles, X } from "lucide-react";
import type { MenuSection } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";
import { GrillMark } from "./logo";

type Kind = "all" | "food" | "drinks";

export function MenuBrowser({ sections }: { sections: MenuSection[] }) {
  const [kind, setKind] = useState<Kind>("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(sections[0]?.slug ?? "");
  // categories are collapsible so the page stays short; the first one starts open
  const [open, setOpen] = useState<Set<string>>(() => new Set(sections[0] ? [sections[0].slug] : []));
  const tabsRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  // the site header changes height (the announcement strip folds away on scroll), so track its real bottom
  const [offset, setOffset] = useState({ top: 84, bar: 120 });
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setOffset({ top: Math.round(header.getBoundingClientRect().bottom), bar: barRef.current?.offsetHeight ?? 120 }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    if (barRef.current) ro.observe(barRef.current);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", measure);
    };
  }, []);
  const searching = q.trim() !== "" || vegOnly;
  const isOpen = (slug: string) => searching || open.has(slug);
  const toggle = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  const openAndScroll = (slug: string, smooth = true) => {
    setOpen((prev) => new Set(prev).add(slug));
    // let the section expand (and the router finish its own scroll handling) before scrolling to it
    setTimeout(() => document.getElementById(slug)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }), smooth ? 150 : 350);
  };

  // links like /menu#cocktails open that category, on arrival and when the hash changes
  useEffect(() => {
    const fromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      if (slug && sections.some((s) => s.slug === slug)) openAndScroll(slug, false);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* solid strip behind the bar and the floating header, so dishes never show through while scrolling */}
      <div ref={barRef} style={{ top: offset.top }} className="sticky z-30 bg-ink pb-3 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-40 before:bg-ink">
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
                  onClick={(e) => {
                    e.preventDefault();
                    history.replaceState(null, "", `#${s.slug}`);
                    openAndScroll(s.slug);
                  }}
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

      <div className="container-x mt-8">
        {!searching && filtered.length > 1 && (
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(open.size >= filtered.length ? new Set() : new Set(filtered.map((s) => s.slug)))}
              className="min-h-11 px-2 text-xs font-bold uppercase tracking-wider text-muted transition hover:text-cream"
            >
              {open.size >= filtered.length ? "Collapse all" : "Expand all"}
            </button>
          </div>
        )}
        <div className="space-y-3">
        {filtered.length === 0 && <p className="py-20 text-center text-sand">Nothing matches that. Try another search.</p>}
        {filtered.map((section) => {
          const expanded = isOpen(section.slug);
          const from = Math.min(...section.items.map((i) => i.price ?? Infinity));
          return (
          <section
            key={section.id}
            id={section.slug}
            style={{ scrollMarginTop: offset.top + offset.bar + 12 }}
            className={cn("rounded-[22px] border transition-colors", expanded ? "border-white/10 bg-coal/40" : "border-white/[0.07] hover:border-white/20")}
            aria-labelledby={`${section.slug}-h`}
          >
            <button
              type="button"
              onClick={() => toggle(section.slug)}
              aria-expanded={expanded}
              aria-controls={`${section.slug}-items`}
              className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
            >
              <h2 id={`${section.slug}-h`} className="flex-1 font-display text-3xl leading-none sm:text-4xl">
                {section.name}
              </h2>
              <span className="hidden text-sm text-muted sm:inline">
                {section.items.length} {section.items.length === 1 ? "item" : "items"}
                {Number.isFinite(from) && <> · from {formatPrice(from)}</>}
              </span>
              <ChevronDown className={cn("size-6 shrink-0 text-brass transition-transform duration-300", expanded && "rotate-180")} aria-hidden />
            </button>
            {expanded && (
            <div id={`${section.slug}-items`} className="px-5 pb-6 sm:px-6">
            {section.description && <p className="mb-5 text-sand">{section.description}</p>}
            {section.items.some((i) => i.image_url) ? (
              /* photo cards: one per row on phones, never two cramped columns */
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className={cn(
                      "group flex flex-col overflow-hidden rounded-[22px] bg-coal ring-1 ring-white/10 transition hover:ring-brass",
                      !item.is_available && "opacity-50",
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-smoke">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          sizes="(min-width:1024px) 23vw, (min-width:640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        // no photo yet: a branded tile keeps the grid even
                        <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgb(239_62_54/0.18),transparent_65%)]">
                          <GrillMark className="size-14 text-white/15" />
                        </div>
                      )}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
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
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="flex items-start gap-2 font-display text-2xl leading-none lg:text-[1.7rem]">
                          {section.kind === "food" && <VegMark veg={item.is_veg} />}
                          {item.name}
                        </h3>
                        {item.price !== null && (
                          <span className="shrink-0 rounded-full bg-brass px-2.5 py-1 font-display text-lg leading-none text-cream">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>
                      {item.price_note && <p className="mt-2 text-xs font-semibold text-muted">{item.price_note}</p>}
                      {item.description && <p className="mt-2 text-[0.8rem] leading-snug text-sand">{item.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              /* sections without photos (spirits, cocktails…) read better as a price list */
              <ul className="grid gap-x-14 md:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item.id} className={cn("border-b border-white/[0.07] py-4", !item.is_available && "opacity-50")}>
                    <div className="flex items-baseline gap-3">
                      <h3 className="flex items-center gap-2 font-display text-2xl leading-none">
                        {section.kind === "food" && <VegMark veg={item.is_veg} />}
                        {item.name}
                      </h3>
                      <span className="mb-1 flex-1 border-b border-dotted border-white/15" aria-hidden />
                      {item.price !== null && <span className="shrink-0 font-display text-2xl leading-none text-brass">{formatPrice(item.price)}</span>}
                    </div>
                    {item.price_note && <p className="mt-1.5 text-xs font-semibold text-muted">{item.price_note}</p>}
                    {item.description && <p className="mt-1.5 text-[0.8rem] leading-snug text-sand">{item.description}</p>}
                  </li>
                ))}
              </ul>
            )}
            </div>
            )}
          </section>
          );
        })}
        </div>
        <p className="mt-10 text-center text-xs text-muted">Prices in INR, exclusive of taxes. Please tell your server about any allergies.</p>
      </div>
    </div>
  );
}

function VegMark({ veg }: { veg: boolean }) {
  return (
    <span className={cn("mt-1 inline-flex size-3.5 shrink-0 rounded-[3px] border-2", veg ? "border-leaf" : "border-ember")} title={veg ? "Vegetarian" : "Non-vegetarian"}>
      <span className={cn("m-auto block size-1.5 rounded-full", veg ? "bg-leaf" : "bg-ember")} />
    </span>
  );
}
