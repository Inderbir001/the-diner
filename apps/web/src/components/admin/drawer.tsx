"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

/** Slide-over panel used for editing records. */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className={`absolute inset-y-0 right-0 flex w-full flex-col border-l border-white/10 bg-coal shadow-2xl ${wide ? "max-w-6xl" : "max-w-2xl"}`}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="font-display text-2xl">{title}</h2>
              <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && <div className="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function StatusPill({ tone, children }: { tone: "green" | "amber" | "red" | "grey" | "blue"; children: React.ReactNode }) {
  const tones = {
    green: "bg-leaf/15 text-leaf",
    amber: "bg-brass/15 text-brass",
    red: "bg-ember/15 text-ember",
    grey: "bg-white/10 text-sand",
    blue: "bg-sky-400/15 text-sky-300",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tones[tone]}`}>{children}</span>;
}
