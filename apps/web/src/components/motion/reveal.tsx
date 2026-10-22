"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number; as?: "div" | "li" | "section" | "article" };

/** Fades and lifts content in once it scrolls into view. */
export function Reveal({ delay = 0, y = 32, as = "div", children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Heading that reveals word by word from behind a mask. */
export function SplitWords({
  text,
  className,
  delay = 0,
  as = "h2",
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");
  const animateProps = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } };
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="inline"
        initial={reduce ? false : "hidden"}
        {...animateProps}
        transition={{ staggerChildren: 0.06, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-top">
            <motion.span
              className="inline-block will-change-transform"
              variants={{ hidden: { y: "110%", rotate: 4 }, show: { y: "0%", rotate: 0 } }}
              transition={{ duration: 1, ease: EASE }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
