"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Download, Loader2, Phone, Plus, Search } from "lucide-react";
import { addDays, BOOKING_STATUSES, formatTime12h, nowInRestaurant, type Booking, type BookingStatus } from "@diner/shared";
import { adminApi, downloadCsv } from "@/lib/admin/client";
import { cn, telHref, whatsappHref } from "@/lib/utils";
import { PageTitle } from "@/components/admin/shell";
import { Drawer } from "@/components/admin/drawer";
import { FieldGrid, type Field } from "@/components/admin/fields";
import { BookingStatusPill } from "@/components/admin/booking-status";
import { can, useAdmin } from "@/components/admin/auth";

type Range = "today" | "upcoming" | "week" | "past" | "all";

const FIELDS: Field[] = [
  { name: "name", label: "Guest name", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text", required: true },
  { name: "email", label: "Email", type: "email" },
  { name: "party_size", label: "Guests", type: "number", required: true },
  { name: "booking_date", label: "Date", type: "date", required: true },
  { name: "booking_time", label: "Time", type: "time", required: true },
  { name: "area", label: "Seating", type: "text" },
  { name: "occasion", label: "Occasion", type: "text" },
  { name: "status", label: "Status", type: "select", required: true, options: BOOKING_STATUSES.map((s) => ({ value: s, label: s.replace("_", "-") })) },
  { name: "source", label: "Source", type: "select", required: true, options: ["website", "phone", "walk-in", "whatsapp", "admin"].map((s) => ({ value: s, label: s })) },
  { name: "notes", label: "Guest notes", type: "textarea", rows: 2 },
  { name: "admin_notes", label: "Internal notes", type: "textarea", rows: 2, help: "Only visible to staff." },
];

function rangeQuery(range: Range, today: string) {
  switch (range) {
    case "today":
      return { from: today, to: today };
    case "upcoming":
      return { from: today };
    case "week":
      return { from: today, to: addDays(today, 7) };
    case "past":
      return { to: addDays(today, -1) };
    default:
      return {};
  }
}

function BookingsInner() {
  const { me } = useAdmin();
  const params = useSearchParams();
  const today = nowInRestaurant().date;
  const [range, setRange] = useState<Range>("upcoming");
  const [status, setStatus] = useState<BookingStatus | "">((params.get("status") as BookingStatus) ?? "");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [count, setCount] = useState(0);
  const [editing, setEditing] = useState<Partial<Booking> | null>(null);
  const [saving, setSaving] = useState(false);

  const query = useCallback(() => {
    const p = new URLSearchParams({ ...rangeQuery(range, today), pageSize: "200" } as Record<string, string>);
    if (status) p.set("status", status);
    if (q.trim()) p.set("q", q.trim());
    return p.toString();
  }, [range, status, q, today]);

  const load = useCallback(async () => {
    try {
      const res = await adminApi<{ data: Booking[]; count: number }>(`/bookings?${query()}`);
      setRows(range === "past" ? [...res.data].reverse() : res.data);
      setCount(res.count);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
    }
  }, [query, range]);

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  // refresh every minute so new website bookings show up
  useEffect(() => {
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  async function setBookingStatus(b: Booking, s: BookingStatus) {
    setRows((r) => r?.map((x) => (x.id === b.id ? { ...x, status: s } : x)) ?? r);
    try {
      await adminApi(`/bookings/${b.id}`, { method: "PATCH", json: { status: s } });
      toast.success(`Marked ${s.replace("_", "-")}${b.email && ["confirmed", "cancelled"].includes(s) ? " — guest emailed" : ""}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
      void load();
    }
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const { id, reference, created_at, updated_at, ...body } = editing;
    void reference; void created_at; void updated_at;
    try {
      if (id) await adminApi(`/bookings/${id}`, { method: "PATCH", json: body });
      else await adminApi("/bookings", { method: "POST", json: body });
      toast.success("Booking saved");
      setEditing(null);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!editing?.id || !confirm("Delete this booking permanently? Consider marking it cancelled instead.")) return;
    try {
      await adminApi(`/bookings/${editing.id}`, { method: "DELETE" });
      setEditing(null);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const guests = (rows ?? []).filter((b) => !["cancelled", "no_show"].includes(b.status)).reduce((s, b) => s + b.party_size, 0);
  const ranges: [Range, string][] = [["today", "Today"], ["upcoming", "Upcoming"], ["week", "Next 7 days"], ["past", "Past"], ["all", "All"]];

  return (
    <>
      <PageTitle
        title="Bookings"
        description="Confirm website requests, add phone and walk-in bookings, and track the night."
        actions={
          <>
            <button type="button" className="btn-ghost" onClick={() => downloadCsv(`/bookings/export.csv?${query()}`, `bookings-${today}.csv`).catch((e) => toast.error(e.message))}>
              <Download className="size-4" /> Export CSV
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setEditing({ name: "", phone: "", email: "", party_size: 2, booking_date: today, booking_time: "20:00", status: "confirmed", source: "phone" } as Partial<Booking>)}
            >
              <Plus className="size-4" /> New booking
            </button>
          </>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1 rounded-full bg-white/5 p-1">
          {ranges.map(([r, label]) => (
            <button key={r} type="button" onClick={() => setRange(r)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold", range === r ? "bg-brass text-snow" : "text-sand hover:text-cream")}>
              {label}
            </button>
          ))}
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus | "")} className="field !w-auto !py-2 text-sm">
          <option value="">Any status</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", "-")}
            </option>
          ))}
        </select>
        <label className="relative lg:ml-auto lg:w-72">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, phone or reference" className="field !py-2 !pl-10 text-sm" />
        </label>
      </div>

      <p className="mb-3 text-xs text-muted">
        {count} booking{count === 1 ? "" : "s"} · {guests} guests
      </p>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-coal">
        {rows === null ? (
          <div className="flex justify-center p-12">
            <Loader2 className="size-5 animate-spin text-brass" />
          </div>
        ) : rows.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted">No bookings match.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Pax</th>
                  <th className="hidden px-4 py-3 md:table-cell">Seating</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Notes</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {rows.map((b) => (
                  <tr key={b.id} className={cn("cursor-pointer hover:bg-white/[0.03]", b.status === "pending" && "bg-brass/[0.04]")} onClick={() => setEditing(b)}>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="block text-cream">{formatTime12h(b.booking_time)}</span>
                      <span className="text-xs text-muted">
                        {b.booking_date === today ? "Today" : new Date(`${b.booking_date}T12:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block font-medium text-cream">{b.name}</span>
                      <span className="flex items-center gap-2 text-xs text-muted" onClick={(e) => e.stopPropagation()}>
                        <a href={telHref(b.phone)} className="inline-flex items-center gap-1 hover:text-brass">
                          <Phone className="size-3" /> {b.phone}
                        </a>
                        <a href={whatsappHref(b.phone, `Hi ${b.name}, this is The Diner about your booking ${b.reference}.`)} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
                          WhatsApp
                        </a>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-display text-xl">{b.party_size}</td>
                    <td className="hidden px-4 py-3 text-sand md:table-cell">{b.area ?? "—"}</td>
                    <td className="hidden max-w-xs px-4 py-3 text-xs text-sand lg:table-cell">
                      {[b.occasion, b.notes].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <BookingStatusPill status={b.status} />
                        <select
                          aria-label="Change status"
                          value={b.status}
                          onChange={(e) => setBookingStatus(b, e.target.value as BookingStatus)}
                          className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs text-sand"
                        >
                          {BOOKING_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-coal">
                              {s.replace("_", "-")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Booking ${editing.reference}` : "New booking"}
        footer={
          <>
            <div>
              {editing?.id && can(me, "admin") && (
                <button type="button" onClick={remove} className="btn-ghost !text-ember">
                  Delete
                </button>
              )}
            </div>
            <button type="button" onClick={save} disabled={saving} className="btn-primary">
              {saving && <Loader2 className="size-4 animate-spin" />} Save
            </button>
          </>
        }
      >
        {editing && (
          <FieldGrid
            fields={FIELDS}
            values={editing as Record<string, unknown>}
            onChange={(name, v) => setEditing((e) => ({ ...e!, [name]: v }))}
          />
        )}
      </Drawer>
    </>
  );
}

export default function BookingsPage() {
  return (
    <Suspense>
      <BookingsInner />
    </Suspense>
  );
}
