"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { adminApi } from "@/lib/admin/client";
import { formatDate } from "@/lib/utils";
import { PageTitle } from "@/components/admin/shell";

interface Entry {
  id: number;
  actor_email: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export default function ActivityPage() {
  const [rows, setRows] = useState<Entry[] | null>(null);
  useEffect(() => {
    adminApi<{ data: Entry[] }>("/activity")
      .then((r) => setRows(r.data))
      .catch((e) => toast.error(e.message));
  }, []);

  return (
    <>
      <PageTitle title="Activity log" description="The last 200 changes made in the admin, and by whom." />
      {!rows ? (
        <Loader2 className="size-5 animate-spin text-brass" />
      ) : (
        <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/10 bg-coal text-sm">
          {rows.length === 0 && <li className="p-8 text-center text-muted">No activity yet.</li>}
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap gap-x-4 gap-y-1 px-5 py-3">
              <span className="w-40 shrink-0 text-xs text-muted">{formatDate(r.created_at, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</span>
              <span className="text-cream">{r.actor_email ?? "system"}</span>
              <span className="text-sand">
                {r.action} <span className="text-brass">{r.entity}</span>
                {r.details && "fields" in r.details ? ` (${(r.details.fields as string[]).join(", ")})` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
