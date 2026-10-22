"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, Phone, Trash2 } from "lucide-react";
import type { Enquiry } from "@diner/shared";
import { adminApi } from "@/lib/admin/client";
import { cn, formatDate, telHref } from "@/lib/utils";
import { PageTitle } from "@/components/admin/shell";
import { StatusPill } from "@/components/admin/drawer";
import { can, useAdmin } from "@/components/admin/auth";

const STATUSES = ["new", "in_progress", "closed"] as const;
type Status = (typeof STATUSES)[number];

export default function EnquiriesPage() {
  const { me } = useAdmin();
  const [rows, setRows] = useState<Enquiry[] | null>(null);
  const [filter, setFilter] = useState<Status | "">("new");

  const load = useCallback(async () => {
    try {
      const res = await adminApi<{ data: Enquiry[] }>(`/enquiries${filter ? `?status=${filter}` : ""}`);
      setRows(res.data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    }
  }, [filter]);
  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(e: Enquiry, status: Status) {
    try {
      await adminApi(`/enquiries/${e.id}`, { method: "PATCH", json: { status } });
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }
  async function remove(e: Enquiry) {
    if (!confirm("Delete this enquiry?")) return;
    await adminApi(`/enquiries/${e.id}`, { method: "DELETE" }).catch((err) => toast.error(err.message));
    void load();
  }

  return (
    <>
      <PageTitle title="Enquiries" description="Party, corporate and general messages from the website." />
      <div className="mb-5 flex flex-wrap gap-1 rounded-full bg-white/5 p-1 sm:w-fit">
        {(["new", "in_progress", "closed", ""] as const).map((s) => (
          <button key={s || "all"} type="button" onClick={() => setFilter(s)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold capitalize", filter === s ? "bg-brass text-ink" : "text-sand")}>
            {s ? s.replace("_", " ") : "All"}
          </button>
        ))}
      </div>
      {rows === null ? (
        <Loader2 className="size-5 animate-spin text-brass" />
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-coal p-12 text-center text-sm text-muted">No enquiries here.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((e) => (
            <article key={e.id} className="rounded-2xl border border-white/10 bg-coal p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl">{e.name}</h2>
                    <StatusPill tone={e.type === "party" || e.type === "corporate" ? "amber" : "grey"}>{e.type}</StatusPill>
                    <span className="text-xs text-muted">{formatDate(e.created_at, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-sand">
                    {e.phone && (
                      <a href={telHref(e.phone)} className="inline-flex items-center gap-1 hover:text-brass">
                        <Phone className="size-3.5" /> {e.phone}
                      </a>
                    )}
                    {e.email && (
                      <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1 hover:text-brass">
                        <Mail className="size-3.5" /> {e.email}
                      </a>
                    )}
                    {e.event_date && <span>Event: {formatDate(e.event_date)}</span>}
                    {e.guests && <span>{e.guests} guests</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={e.status} onChange={(ev) => setStatus(e, ev.target.value as Status)} className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs text-sand">
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-coal">
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  {can(me, "admin") && (
                    <button type="button" onClick={() => remove(e)} className="p-2 text-muted hover:text-ember" aria-label="Delete">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-cream/90">{e.message}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
