"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";

/** A swipeable row that also slides itself along every few seconds while on screen; any touch pauses it for a while. */
export function AutoSlide({ children, className, every = 3200 }: { children: ReactNode; className?: string; every?: number }) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const pausedUntil = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil.current || el.scrollWidth <= el.clientWidth + 4) return;
      const card = el.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth * 0.8;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, every);
    return () => window.clearInterval(id);
  }, [inView, reduce, every]);

  const pause = () => (pausedUntil.current = Date.now() + 8000);
  return (
    <ul ref={ref} className={className} onPointerDown={pause} onTouchStart={pause} onWheel={pause}>
      {children}
    </ul>
  );
}
