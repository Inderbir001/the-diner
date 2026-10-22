"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EyeOff, Eye, Loader2, Pin, RefreshCw } from "lucide-react";
import type { IntegrationStatus, SocialPost } from "@diner/shared";
import { adminApi } from "@/lib/admin/client";
import { cn, formatDate } from "@/lib/utils";
import { PageTitle } from "@/components/admin/shell";
import { StatusPill } from "@/components/admin/drawer";
import { SocialIcon } from "@/components/site/social-icon";

export default function SocialAdminPage() {
  const [status, setStatus] = useState<IntegrationStatus[]>([]);
  const [hasYtKey, setHasYtKey] = useState(false);
  const [posts, setPosts] = useState<SocialPost[] | null>(null);
  const [platform, setPlatform] = useState<"instagram" | "youtube">("instagram");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [s, p] = await Promise.all([
      adminApi<{ data: IntegrationStatus[]; youtubeApiKey: boolean }>("/social/status"),
      adminApi<{ data: SocialPost[] }>(`/social/posts?platform=${platform}`),
    ]);
    setStatus(s.data);
    setHasYtKey(s.youtubeApiKey);
    setPosts(p.data);
  }, [platform]);
  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, [load]);

  const ig = status.find((s) => s.platform === "instagram");
  const yt = status.find((s) => s.platform === "youtube");

  async function sync(p?: "instagram" | "youtube") {
    setBusy(`sync-${p ?? "all"}`);
    try {
      const res = await adminApi<{ data: Record<string, { ok: boolean; count: number; error?: string }> }>("/social/sync", { method: "POST", json: p ? { platform: p } : {} });
      for (const [name, r] of Object.entries(res.data)) {
        if (r.ok) toast.success(`${name}: ${r.count} posts synced`);
        else toast.error(`${name}: ${r.error}`);
      }
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setBusy(null);
    }
  }

  async function connect(e: React.FormEvent) {
    e.preventDefault();
    setBusy("connect");
    try {
      const res = await adminApi<{ data: { username: string } }>("/social/instagram/connect", { method: "POST", json: { token } });
      toast.success(`Connected @${res.data.username}. Importing posts…`);
      setToken("");
      setTimeout(() => void load(), 4000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not connect");
    } finally {
      setBusy(null);
    }
  }

  async function disconnect() {
    if (!confirm("Disconnect Instagram? Existing posts stay on the site until you hide them.")) return;
    await adminApi("/social/instagram/disconnect", { method: "POST" });
    void load();
  }

  async function toggle(p: SocialPost, key: "is_hidden" | "is_pinned") {
    setPosts((list) => list?.map((x) => (x.id === p.id ? { ...x, [key]: !p[key] } : x)) ?? list);
    await adminApi(`/social/posts/${p.id}`, { method: "PATCH", json: { [key]: !p[key] } }).catch((e) => toast.error(e.message));
  }

  return (
    <>
      <PageTitle
        title="Instagram & YouTube"
        description="New Instagram posts and YouTube videos appear on the website automatically (checked every 30 minutes). Hide or pin any post below."
        actions={
          <button type="button" className="btn-primary" onClick={() => sync()} disabled={!!busy}>
            {busy === "sync-all" ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Sync now
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-coal p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <SocialIcon name="instagram" className="size-5 text-brass" /> Instagram
            </h2>
            {ig?.connected ? <StatusPill tone="green">Connected</StatusPill> : <StatusPill tone="grey">Not connected</StatusPill>}
          </div>
          {ig?.connected ? (
            <dl className="mt-4 space-y-1 text-sm text-sand">
              {ig.account_name && <div>Account: <span className="text-cream">@{ig.account_name}</span></div>}
              {ig.token_expires_at && <div>Token renews automatically · expires {formatDate(ig.token_expires_at)}</div>}
              <div>Last sync: {ig.last_synced_at ? formatDate(ig.last_synced_at, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "never"}</div>
              {ig.last_error && <div className="text-ember">Last error: {ig.last_error}</div>}
            </dl>
          ) : null}
          <form onSubmit={connect} className="mt-5 space-y-3">
            <label htmlFor="ig-token" className="label">{ig?.connected ? "Replace access token" : "Instagram access token"}</label>
            <input id="ig-token" value={token} onChange={(e) => setToken(e.target.value)} className="field font-mono text-xs" placeholder="IGAA…" autoComplete="off" />
            <p className="text-xs text-muted">
              Generate a long-lived token for the @thedinerrestobar professional account in the Meta developer dashboard (Instagram API with Instagram Login). Step-by-step instructions are in the README.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={!token || !!busy} className="btn-primary">
                {busy === "connect" && <Loader2 className="size-4 animate-spin" />} Connect
              </button>
              {ig?.connected && (
                <>
                  <button type="button" onClick={() => sync("instagram")} disabled={!!busy} className="btn-ghost">Sync Instagram</button>
                  <button type="button" onClick={disconnect} className="btn-ghost !text-ember">Disconnect</button>
                </>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-coal p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <SocialIcon name="youtube" className="size-5 text-brass" /> YouTube
            </h2>
            {yt?.connected ? <StatusPill tone="green">Connected</StatusPill> : <StatusPill tone="grey">Not connected</StatusPill>}
          </div>
          <dl className="mt-4 space-y-1 text-sm text-sand">
            {yt?.account_name && <div>Channel: <span className="text-cream">{yt.account_name}</span></div>}
            <div>Mode: {hasYtKey ? "YouTube Data API (latest 30 videos)" : "Public feed (latest 15 videos, no API key needed)"}</div>
            <div>Last sync: {yt?.last_synced_at ? formatDate(yt.last_synced_at, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "never"}</div>
            {yt?.last_error && <div className="text-ember">Last error: {yt.last_error}</div>}
          </dl>
          <p className="mt-5 text-sm text-sand">
            Add your channel ID (starts with <code className="text-cream">UC</code>) and channel link under{" "}
            <Link href="/admin/settings?tab=social" className="text-brass underline">Settings → Social links</Link>, then press sync.
          </p>
          <button type="button" onClick={() => sync("youtube")} disabled={!!busy} className="btn-ghost mt-4">
            {busy === "sync-youtube" && <Loader2 className="size-4 animate-spin" />} Sync YouTube
          </button>
        </section>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          {(["instagram", "youtube"] as const).map((p) => (
            <button key={p} type="button" onClick={() => setPlatform(p)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold capitalize", platform === p ? "bg-brass text-ink" : "bg-white/5 text-sand")}>
              {p}
            </button>
          ))}
        </div>
        {posts === null ? (
          <Loader2 className="size-5 animate-spin text-brass" />
        ) : posts.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-coal p-12 text-center text-sm text-muted">No posts synced yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {posts.map((p) => (
              <li key={p.id} className={cn("overflow-hidden rounded-2xl border border-white/10 bg-coal", p.is_hidden && "opacity-40")}>
                <a href={p.permalink} target="_blank" rel="noopener noreferrer" className={cn("relative block bg-smoke", platform === "youtube" ? "aspect-video" : "aspect-square")}>
                  {p.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.thumbnail_url} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
                  )}
                </a>
                <div className="flex items-center justify-between p-2">
                  <span className="text-xs text-muted">{formatDate(p.published_at, { day: "numeric", month: "short" })}</span>
                  <div className="flex">
                    <button type="button" onClick={() => toggle(p, "is_pinned")} className={cn("p-1.5", p.is_pinned ? "text-brass" : "text-muted hover:text-cream")} aria-label={p.is_pinned ? "Unpin" : "Pin to top"} title="Pin to top">
                      <Pin className="size-4" />
                    </button>
                    <button type="button" onClick={() => toggle(p, "is_hidden")} className="p-1.5 text-muted hover:text-cream" aria-label={p.is_hidden ? "Show" : "Hide"} title={p.is_hidden ? "Show on site" : "Hide from site"}>
                      {p.is_hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
