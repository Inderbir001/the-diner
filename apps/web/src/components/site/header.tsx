"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu as MenuIcon, Phone, X } from "lucide-react";
import type { AnnouncementSettings, GeneralSettings } from "@diner/shared";
import { cn, telHref } from "@/lib/utils";
import { AnnouncementBar } from "./announcement-bar";
import { Logo } from "./logo";
import { NAV_LINKS } from "./nav-links";

/** Announcement strip + a solid sticky header (72px) that never overlaps page content. */
export function Header({
  general,
  bookingEnabled,
  announcement,
}: {
  general: GeneralSettings;
  bookingEnabled: boolean;
  announcement: AnnouncementSettings;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <AnnouncementBar announcement={announcement} />
      <header className="glass-strong sticky top-0 z-50 !border-x-0 !border-t-0">
        <nav aria-label="Main" className="container-x flex h-[72px] items-center justify-between gap-6">
          <Link href="/" aria-label={`${general.name} — home`} className="shrink-0">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors",
                      active ? "bg-white/12 text-cream" : "text-sand hover:bg-white/[0.06] hover:text-cream",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {general.phones[0] && (
              <a
                href={telHref(general.phones[0])}
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-sand hover:text-cream xl:inline-flex"
              >
                <Phone className="size-4 text-brass" /> {general.phones[0]}
              </a>
            )}
            {bookingEnabled && (
              <Link href="/reserve" className="btn-primary hidden !py-2.5 sm:inline-flex">
                Book a table
              </Link>
            )}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 glass lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
            >
              <MenuIcon className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-night/40 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="glass-strong absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button type="button" onClick={() => setOpen(false)} className="inline-flex size-11 items-center justify-center rounded-full bg-smoke" aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              <ul className="mt-8 flex-1 space-y-1">
                {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl font-bold",
                        pathname === l.href ? "bg-white/12 text-cream" : "text-cream hover:bg-white/[0.06]",
                      )}
                    >
                      {l.label} <ArrowRight className="size-5 opacity-40" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                {bookingEnabled && (
                  <Link href="/reserve" className="btn-primary w-full !py-4">
                    Book a table
                  </Link>
                )}
                {general.phones[0] && (
                  <a href={telHref(general.phones[0])} className="btn-ghost w-full !py-4">
                    <Phone className="size-4" /> Call {general.phones[0]}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
