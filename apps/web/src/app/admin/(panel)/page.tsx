"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, Clock, Inbox, Loader2, Newspaper, Users, UtensilsCrossed } from "lucide-react";
import { formatTime12h, type Booking } from "@diner/shared";
import { adminApi } from "@/lib/admin/client";
import { PageTitle } from "@/components/admin/shell";
import { useAdmin } from "@/components/admin/auth";
import { BookingStatusPill } from "@/components/admin/booking-status";

interface Dashboard {
  today: string;
  stats: { todayBookings: number; todayGuests: number; pending: number; upcoming: number; newEnquiries: number; posts: number; menuItems: number };
  upcomingBookings: Booking[];
}

export default function DashboardPage() {
  const { me } = useAdmin();
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    adminApi<{ data: Dashboard }>("/dashboard")
      .then((r) => setData(r.data))
      .catch((e) => toast.error(e.message));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const cards = data
    ? [
        { label: "Bookings today", value: data.stats.todayBookings, icon: CalendarCheck, href: "/admin/bookings" },
        { label: "Guests today", value: data.stats.todayGuests, icon: Users, href: "/admin/bookings" },
        { label: "Awaiting confirmation", value: data.stats.pending, icon: Clock, href: "/admin/bookings?status=pending", highlight: data.stats.pending > 0 },
        { label: "Next 7 days", value: data.stats.upcoming, icon: CalendarCheck, href: "/admin/bookings" },
        { label: "New enquiries", value: data.stats.newEnquiries, icon: Inbox, href: "/admin/enquiries", highlight: data.stats.newEnquiries > 0 },
        { label: "Published posts", value: data.stats.posts, icon: Newspaper, href: "/admin/blog" },
        { label: "Menu items", value: data.stats.menuItems, icon: UtensilsCrossed, href: "/admin/menu" },
      ]
    : [];

  return (
    <>
      <PageTitle title={`${greeting}, ${me.name?.split(" ")[0] ?? "team"}.`} description="Here's what's happening at The Diner." />
      {!data ? (
        <Loader2 className="size-5 animate-spin text-brass" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {cards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className={`rounded-2xl border p-5 transition hover:border-white/20 ${c.highlight ? "border-brass/40 bg-brass/10" : "border-white/10 bg-coal"}`}
              >
                <c.icon className={`size-4 ${c.highlight ? "text-brass" : "text-muted"}`} />
                <p className="mt-4 font-display text-4xl">{c.value}</p>
                <p className="mt-1 text-xs text-muted">{c.label}</p>
              </Link>
            ))}
          </div>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">Upcoming bookings</h2>
              <Link href="/admin/bookings" className="text-sm text-brass">
                View all →
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-coal">
              {data.upcomingBookings.length === 0 ? (
                <p className="p-8 text-center text-sm text-muted">No upcoming bookings.</p>
              ) : (
                <ul className="divide-y divide-white/[0.06]">
                  {data.upcomingBookings.map((b) => (
                    <li key={b.id} className="flex flex-wrap items-center gap-4 px-5 py-4 text-sm">
                      <span className="w-28 text-sand">
                        {b.booking_date === data.today ? "Today" : new Date(`${b.booking_date}T12:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" })}{" "}
                        · {formatTime12h(b.booking_time)}
                      </span>
                      <span className="flex-1 font-medium text-cream">{b.name}</span>
                      <span className="text-sand">{b.party_size} guests</span>
                      <BookingStatusPill status={b.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
