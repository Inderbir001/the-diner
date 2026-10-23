"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import type { GeneralSettings } from "@diner/shared";
import { whatsappHref } from "@/lib/utils";
import { SocialIcon } from "./social-icon";

/** Bottom-right corner on every page: WhatsApp chat, plus "back to top" once you've scrolled a screen down. */
export function FloatingActions({ general }: { general: GeneralSettings }) {
  const reduce = useReducedMotion();
  const [showTop, setShowTop] = useState(false);
  const number = general.whatsapp || general.phones[0];

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // on phones it sits above the Call / Directions / Book bar
    <div className="pointer-events-none fixed bottom-[4.25rem] right-3 z-40 flex flex-col items-center gap-2.5 sm:bottom-[5rem] sm:right-4 lg:bottom-6 lg:right-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            aria-label="Back to top"
            className="glass-strong pointer-events-auto inline-flex size-10 items-center sm:size-12 justify-center rounded-full text-cream shadow-xl shadow-black/50 transition hover:bg-white/15"
          >
            <ArrowUp className="size-4 sm:size-5" />
          </motion.button>
        )}
      </AnimatePresence>
      {number && (
        <a
          href={whatsappHref(number, `Hi ${general.name}! I have a question.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="pointer-events-auto inline-flex size-12 items-center sm:size-14 justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/50 transition hover:scale-105 hover:bg-[#1ebe5a]"
        >
          <SocialIcon name="whatsapp" className="size-6 sm:size-7" />
        </a>
      )}
    </div>
  );
}
