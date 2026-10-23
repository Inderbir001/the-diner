"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Phone } from "lucide-react";
import type { AnnouncementSettings, GeneralSettings } from "@diner/shared";
import { cn, telHref } from "@/lib/utils";
import { AnnouncementBar } from "./announcement-bar";
import { Logo } from "./logo";
import { NAV_LINKS } from "./nav-links";

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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // the logo always lands at the very top of the home page
  const logoClicked = useRef(false);
  useEffect(() => {
    setOpen(false);
    if (logoClicked.current && pathname === "/") {
      logoClicked.current = false;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "pointer-events-auto grid transition-[grid-template-rows] duration-500",
          scrolled || open ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        )}
      >
        <div className="overflow-hidden">
          <AnnouncementBar announcement={announcement} />
        </div>
      </div>
      <div className="container-x pt-2 sm:pt-4">
        <nav
          aria-label="Main"
          className={cn(
            "pointer-events-auto flex items-center justify-between rounded-full py-1.5 pl-4 pr-1.5 sm:py-2.5 sm:pl-6 sm:pr-2.5 transition-all duration-500",
            scrolled || open ? "glass-strong shadow-2xl shadow-black/40" : "border border-transparent",
          )}
        >
          <Link
            href="/"
            aria-label={`${general.name} — home`}
            className="relative z-10"
            onClick={(e) => {
              setOpen(false);
              logoClicked.current = true;
              // already on the home page: go back to the top instead of doing nothing
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
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
                      "relative rounded-full px-4 py-2 text-sm font-medium text-sand transition-colors hover:text-cream",
                      active && "text-cream",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.08]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
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
                className="hidden size-10 items-center justify-center rounded-full text-sand transition hover:bg-white/10 hover:text-cream md:inline-flex"
                aria-label={`Call ${general.phones[0]}`}
              >
                <Phone className="size-4" />
              </a>
            )}
            {bookingEnabled && (
              <Link href="/reserve" className="btn-primary hidden !py-2.5 sm:inline-flex">
                Book a table
              </Link>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative z-10 inline-flex size-10 items-center sm:size-11 justify-center rounded-full bg-white/[0.06] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-5 bg-cream transition-transform duration-300",
                    open && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-5 bg-cream transition-transform duration-300",
                    open && "-translate-y-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto fixed inset-0 -z-10 flex flex-col justify-between bg-coal px-6 pb-10 pt-28 lg:hidden"
          >
            <ul className="space-y-1">
              {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={l.href} className="block font-display text-5xl leading-tight text-cream/90 hover:text-brass">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-4">
              {bookingEnabled && (
                <Link href="/reserve" className="btn-primary w-full !py-4">
                  Book a table
                </Link>
              )}
              <p className="text-center text-sm text-muted">
                {general.address.street}, {general.address.locality}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
