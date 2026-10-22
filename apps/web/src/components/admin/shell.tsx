"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarCheck, ExternalLink, FileText, Images, Inbox, LayoutDashboard, LogOut, Menu as MenuIcon, MessageSquareQuote,
  Newspaper, PartyPopper, ScrollText, Settings, Share2, Users, UtensilsCrossed, CircleHelp, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { can, useAdmin, type AdminRole } from "./auth";

const NAV: { group: string; items: { href: string; label: string; icon: React.ElementType; min: AdminRole }[] }[] = [
  {
    group: "Operations",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, min: "staff" },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, min: "staff" },
      { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, min: "staff" },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed, min: "admin" },
      { href: "/admin/events", label: "Events", icon: PartyPopper, min: "admin" },
      { href: "/admin/blog", label: "Blog", icon: Newspaper, min: "admin" },
      { href: "/admin/gallery", label: "Gallery", icon: Images, min: "admin" },
      { href: "/admin/testimonials", label: "Reviews", icon: MessageSquareQuote, min: "admin" },
      { href: "/admin/faqs", label: "FAQs", icon: CircleHelp, min: "admin" },
      { href: "/admin/pages", label: "Pages", icon: FileText, min: "admin" },
      { href: "/admin/social", label: "Instagram & YouTube", icon: Share2, min: "admin" },
    ],
  },
  {
    group: "Setup",
    items: [
      { href: "/admin/settings", label: "Site settings", icon: Settings, min: "admin" },
      { href: "/admin/team", label: "Team", icon: Users, min: "owner" },
      { href: "/admin/activity", label: "Activity log", icon: ScrollText, min: "admin" },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { me, signOut } = useAdmin();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/admin" className="px-3 pb-8 pt-2">
        <span className="font-display text-2xl italic">The Diner</span>
        <span className="ml-2 rounded-full bg-brass/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-brass">Admin</span>
      </Link>
      <div className="flex-1 space-y-7 overflow-y-auto">
        {NAV.map((g) => {
          const items = g.items.filter((i) => can(me, i.min));
          if (!items.length) return null;
          return (
            <div key={g.group}>
              <p className="mb-2 px-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted">{g.group}</p>
              <ul className="space-y-0.5">
                {items.map((i) => {
                  const active = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
                  return (
                    <li key={i.href}>
                      <Link
                        href={i.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                          active ? "bg-white/[0.08] text-cream" : "text-sand hover:bg-white/[0.04] hover:text-cream",
                        )}
                      >
                        <i.icon className={cn("size-4", active && "text-brass")} />
                        {i.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="mt-6 space-y-1 border-t border-white/10 pt-4">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-sand hover:text-cream">
          <ExternalLink className="size-4" /> View website
        </a>
        <div className="px-3 py-2">
          <p className="truncate text-sm text-cream">{me.name ?? me.email}</p>
          <p className="text-xs capitalize text-muted">{me.role}</p>
        </div>
        <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-sand hover:text-ember">
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-dvh border-r border-white/[0.07] bg-coal p-4 lg:block">{nav}</aside>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.07] bg-coal/90 px-4 py-3 backdrop-blur lg:hidden">
        <span className="font-display text-xl italic">The Diner · Admin</span>
        <button type="button" onClick={() => setOpen(true)} className="inline-flex size-10 items-center justify-center rounded-full bg-white/5" aria-label="Open navigation">
          <MenuIcon className="size-5" />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/70" onClick={() => setOpen(false)} aria-label="Close navigation" />
          <aside className="absolute inset-y-0 left-0 w-72 bg-coal p-4">
            <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 p-2" aria-label="Close">
              <X className="size-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-sand">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
