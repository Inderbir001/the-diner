"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { API_URL, SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabase } from "@/lib/env";

let client: SupabaseClient | null = null;

/** Browser Supabase client — used only for admin sign-in; all data goes through the API. */
export function supabaseBrowser(): SupabaseClient | null {
  if (!hasSupabase) return null;
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "diner-admin" },
  });
  return client;
}

export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

async function token(): Promise<string | null> {
  const sb = supabaseBrowser();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.access_token ?? null;
}

/** Authenticated call to the Render API's /v1/admin routes. */
export async function adminApi<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const t = await token();
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
  if (t) headers.Authorization = `Bearer ${t}`;
  let body = init.body;
  if (init.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }
  let res: Response;
  try {
    res = await fetch(`${API_URL}/v1/admin${path}`, { ...init, headers, body });
  } catch {
    throw new AdminApiError("Can't reach the API. Is the backend running?", 0);
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const fields = data.fields as Record<string, string[]> | undefined;
    const detail = fields ? Object.entries(fields).map(([k, v]) => `${k}: ${v[0]}`).join(", ") : "";
    throw new AdminApiError([data.error ?? `Request failed (${res.status})`, detail].filter(Boolean).join(" — "), res.status, fields);
  }
  return data as T;
}

export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  const form = new FormData();
  form.append("folder", folder);
  form.append("file", file);
  const { url } = await adminApi<{ url: string }>("/media", { method: "POST", body: form });
  return url;
}

export async function downloadCsv(path: string, filename: string) {
  const t = await token();
  const res = await fetch(`${API_URL}/v1/admin${path}`, { headers: t ? { Authorization: `Bearer ${t}` } : {} });
  if (!res.ok) throw new AdminApiError("Export failed", res.status);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** datetime-local value (IST) <-> ISO string */
export function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const ist = new Date(d.getTime() + 330 * 60_000);
  return ist.toISOString().slice(0, 16);
}
export function localInputToIso(v: string): string | null {
  return v ? new Date(`${v}:00+05:30`).toISOString() : null;
}
