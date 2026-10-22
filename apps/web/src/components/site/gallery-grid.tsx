"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@diner/shared";
import { cn } from "@/lib/utils";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const categories = useMemo(() => ["all", ...Array.from(new Set(images.map((i) => i.category)))], [images]);
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const shown = cat === "all" ? images : images.filter((i) => i.category === cat);

  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, step]);

  return (
    <>
      {categories.length > 2 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold capitalize transition",
                cat === c ? "border-brass bg-brass text-snow" : "border-black/10 text-sand hover:text-cream",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <motion.ul layout className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        <AnimatePresence>
          {shown.map((img, i) => (
            <motion.li
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="mb-3 break-inside-avoid sm:mb-4"
            >
              <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-2xl" aria-label={`Open: ${img.alt}`}>
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={800}
                  height={i % 3 === 0 ? 1000 : 640}
                  sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                  className="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                />
                {img.caption && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 p-3 text-left text-xs opacity-0 transition group-hover:opacity-100">
                    {img.caption}
                  </span>
                )}
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {open !== null && shown[open] && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={shown[open].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-night/95 p-4 backdrop-blur-xl"
            onClick={() => setOpen(null)}
          >
            <motion.div
              key={shown[open].id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={shown[open].url} alt={shown[open].alt} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <button type="button" onClick={() => setOpen(null)} className="glass absolute right-5 top-5 inline-flex size-12 items-center justify-center rounded-full" aria-label="Close">
              <X className="size-5" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="glass absolute left-4 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full" aria-label="Previous">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="glass absolute right-4 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full" aria-label="Next">
              <ChevronRight className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
