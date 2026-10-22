"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Plus, Search, Trash2 } from "lucide-react";
import type { ResourceName } from "@diner/shared";
import { adminApi } from "@/lib/admin/client";
import { cn } from "@/lib/utils";
import { Drawer } from "./drawer";
import { FieldGrid, type Field } from "./fields";

type Row = Record<string, unknown> & { id: string };

export interface Column {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
  className?: string;
}

export interface ResourceConfig {
  resource: ResourceName;
  singular: string;
  fields: Field[];
  columns: Column[];
  defaults: Record<string, unknown>;
  searchKeys?: string[];
  /** show up/down controls that save sort_order */
  sortable?: boolean;
  thumbnailKey?: string;
  publicUrl?: (row: Row) => string | null;
}

/** Generic list + slide-over editor for any content table exposed by the API. */
export function ResourceManager({
  config,
  filter,
  extraDefaults,
  toolbar,
  onChanged,
}: {
  config: ResourceConfig;
  filter?: (row: Row) => boolean;
  extraDefaults?: Record<string, unknown>;
  toolbar?: React.ReactNode;
  onChanged?: () => void;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await adminApi<{ data: Row[] }>(`/content/${config.resource}`);
      setRows(res.data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
    }
  }, [config.resource]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (rows ?? [])
      .filter((r) => !filter || filter(r))
      .filter((r) => !term || (config.searchKeys ?? ["title", "name"]).some((k) => String(r[k] ?? "").toLowerCase().includes(term)));
  }, [rows, q, filter, config.searchKeys]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const { id, created_at, updated_at, ...payload } = editing as Row & { created_at?: string; updated_at?: string };
    void created_at;
    void updated_at;
    // only send fields this form knows about
    const body = Object.fromEntries(Object.entries(payload).filter(([k]) => config.fields.some((f) => f.name === k)));
    try {
      if (id) await adminApi(`/content/${config.resource}/${id}`, { method: "PATCH", json: body });
      else await adminApi(`/content/${config.resource}`, { method: "POST", json: body });
      toast.success(`${config.singular} saved — live on the site in a few seconds.`);
      setEditing(null);
      await load();
      onChanged?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!confirm(`Delete this ${config.singular.toLowerCase()}? This can't be undone.`)) return;
    try {
      await adminApi(`/content/${config.resource}/${row.id}`, { method: "DELETE" });
      toast.success("Deleted");
      setEditing(null);
      await load();
      onChanged?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function reorder(index: number, dir: -1 | 1) {
    const list = [...visible];
    const j = index + dir;
    if (j < 0 || j >= list.length) return;
    [list[index], list[j]] = [list[j], list[index]];
    const ids = list.map((r) => r.id);
    setRows((prev) => {
      if (!prev) return prev;
      const order = new Map(ids.map((id, i) => [id, i + 1]));
      return [...prev].map((r) => (order.has(r.id) ? { ...r, sort_order: order.get(r.id) } : r)).sort((a, b) => Number(a.sort_order) - Number(b.sort_order));
    });
    try {
      await adminApi(`/content/${config.resource}/reorder`, { method: "POST", json: { ids } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reorder failed");
      void load();
    }
  }

  const isNew = editing && !editing.id;
  const publicUrl = editing && editing.id && config.publicUrl ? config.publicUrl(editing as Row) : null;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-xs">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="field !py-2 !pl-10 text-sm" />
        </label>
        {toolbar}
        <button type="button" className="btn-primary sm:ml-auto" onClick={() => setEditing({ ...config.defaults, ...extraDefaults })}>
          <Plus className="size-4" /> New {config.singular.toLowerCase()}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-coal">
        {rows === null ? (
          <div className="flex justify-center p-12">
            <Loader2 className="size-5 animate-spin text-brass" />
          </div>
        ) : visible.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted">Nothing here yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  {config.sortable && <th className="w-16 px-3 py-3" aria-label="Order" />}
                  {config.thumbnailKey && <th className="w-16 px-3 py-3" aria-label="Image" />}
                  {config.columns.map((c) => (
                    <th key={c.key} className={cn("px-3 py-3 font-semibold", c.className)}>
                      {c.label}
                    </th>
                  ))}
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {visible.map((row, i) => (
                  <tr key={row.id} className="cursor-pointer transition hover:bg-white/[0.03]" onClick={() => setEditing(row)}>
                    {config.sortable && (
                      <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex">
                          <button type="button" className="p-1 text-muted hover:text-cream disabled:opacity-20" disabled={i === 0} onClick={() => reorder(i, -1)} aria-label="Move up">
                            <ArrowUp className="size-4" />
                          </button>
                          <button type="button" className="p-1 text-muted hover:text-cream disabled:opacity-20" disabled={i === visible.length - 1} onClick={() => reorder(i, 1)} aria-label="Move down">
                            <ArrowDown className="size-4" />
                          </button>
                        </div>
                      </td>
                    )}
                    {config.thumbnailKey && (
                      <td className="px-3 py-2">
                        {row[config.thumbnailKey] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={String(row[config.thumbnailKey])} alt="" className="size-10 rounded-lg object-cover" loading="lazy" />
                        ) : (
                          <div className="size-10 rounded-lg bg-white/5" />
                        )}
                      </td>
                    )}
                    {config.columns.map((c) => (
                      <td key={c.key} className={cn("px-3 py-3", c.className)}>
                        {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                      </td>
                    ))}
                    <td className="px-3" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => remove(row)} className="p-2 text-muted hover:text-ember" aria-label="Delete">
                        <Trash2 className="size-4" />
                      </button>
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
        title={isNew ? `New ${config.singular.toLowerCase()}` : `Edit ${config.singular.toLowerCase()}`}
        footer={
          <>
            <div className="flex gap-2">
              {!isNew && editing && (
                <button type="button" onClick={() => remove(editing as Row)} className="btn-ghost !text-ember">
                  <Trash2 className="size-4" /> Delete
                </button>
              )}
              {publicUrl && (
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <ExternalLink className="size-4" /> View
                </a>
              )}
            </div>
            <button type="button" onClick={save} disabled={saving} className="btn-primary">
              {saving && <Loader2 className="size-4 animate-spin" />} Save
            </button>
          </>
        }
      >
        {editing && <FieldGrid fields={config.fields} values={editing} onChange={(name, v) => setEditing((e) => ({ ...e!, [name]: v }))} />}
      </Drawer>
    </div>
  );
}

export const yesNo = (v: unknown) => (v ? "Yes" : "—");
