"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import type { AnnouncementSettings, GeneralSettings } from "@diner/shared";
import { cn, telHref } from "@/lib/utils";
import { Logo } from "./logo";

const HEADER_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/private-parties", label: "Parties" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Visit" },
] as const;

/**
 * Slim header. On the homepage it sits transparently over the hero photo and turns solid
 * charcoal once you scroll; on every other page it is solid from the start.
 */
export function Header({
  general,
  bookingEnabled,
}: {
  general: GeneralSettings;
  bookingEnabled: boolean;
  announcement?: AnnouncementSettings;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const solid = !isHome || scrolled || open;

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50 transition-colors duration-200",
        isHome ? "fixed" : "sticky",
        solid ? "border-b border-ivory/10 bg-charcoal" : "border-b border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Main" className="container-x flex h-14 items-center justify-between gap-6 lg:h-16">
        <Link href="/" aria-label={`${general.name} — home`} className="shrink-0 origin-left scale-[0.82] lg:scale-90">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {HEADER_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-2 text-[0.92rem] font-medium transition-colors duration-150",
                    active ? "text-ivory" : "text-ivory/75 hover:text-ivory",
                    active && "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {bookingEnabled && (
            <Link href="/reserve" className="btn-primary hidden !min-h-10 !px-5 !py-2 !text-sm sm:inline-flex">
              Book a table
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-[16px] text-ivory hover:bg-ivory/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-14 z-50 overflow-y-auto bg-charcoal lg:hidden">
          <ul className="container-x divide-y divide-ivory/10 py-4">
            {[{ href: "/", label: "Home" }, ...HEADER_LINKS, { href: "/blog", label: "Journal" }].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn("flex min-h-14 items-center font-display text-3xl", pathname === l.href ? "text-gold" : "text-ivory")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="container-x grid gap-3 pb-10">
            {bookingEnabled && (
              <Link href="/reserve" className="btn-primary w-full">
                Book a table
              </Link>
            )}
            {general.phones[0] && (
              <a href={telHref(general.phones[0])} className="btn-ghost w-full">
                Call {general.phones[0]}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
