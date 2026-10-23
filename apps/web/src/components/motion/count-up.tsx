"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/** Counts the number inside a label ("₹1,000", "4.4★", "12+") up from zero the first time it scrolls into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/\d[\d,]*(\.\d+)?/);
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!match || !inView || reduce) return;
    const target = Number(match[0].replace(/,/g, ""));
    const decimals = match[1] ? match[1].length - 1 : 0;
    const format = (n: number) =>
      value.replace(match[0], n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }));
    setText(format(0));
    const controls = animate(0, target, { duration: 1.2, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setText(format(n)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
