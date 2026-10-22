import { env } from "../env";
import { db, MEDIA_BUCKET, publicMediaUrl } from "../lib/supabase";
import { logger } from "../lib/logger";

/**
 * Instagram API with Instagram Login (professional accounts).
 * Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
 * Long-lived tokens last 60 days and are refreshed automatically here.
 */
const GRAPH = "https://graph.instagram.com";

interface IgMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

async function ig<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(path, GRAPH);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  const json = (await res.json()) as T & { error?: { message: string } };
  if (!res.ok || json.error) throw new Error(`Instagram: ${json.error?.message ?? res.statusText}`);
  return json;
}

export async function getInstagramToken(): Promise<{ token: string; expiresAt: string | null } | null> {
  const { data } = await db
    .from("integrations")
    .select("access_token, token_expires_at")
    .eq("platform", "instagram")
    .maybeSingle();
  if (data?.access_token) return { token: data.access_token, expiresAt: data.token_expires_at };
  if (env.INSTAGRAM_ACCESS_TOKEN) return { token: env.INSTAGRAM_ACCESS_TOKEN, expiresAt: null };
  return null;
}

/** Validate a token, store it and the account name. Used when an admin connects Instagram. */
export async function connectInstagram(token: string) {
  const me = await ig<{ user_id?: string; id: string; username: string }>("/me", {
    fields: "user_id,username",
    access_token: token,
  });
  let finalToken = token;
  let expiresAt: string | null = null;
  try {
    const refreshed = await refreshToken(token);
    finalToken = refreshed.token;
    expiresAt = refreshed.expiresAt;
  } catch (err) {
    // short-lived or freshly issued tokens can't be refreshed yet; keep the original
    logger.info({ err }, "instagram token not refreshable yet");
  }
  await db.from("integrations").upsert({
    platform: "instagram",
    access_token: finalToken,
    token_expires_at: expiresAt,
    account_id: me.user_id ?? me.id,
    account_name: me.username,
    last_error: null,
  });
  return { username: me.username };
}

async function refreshToken(token: string) {
  const json = await ig<{ access_token: string; expires_in: number }>("/refresh_access_token", {
    grant_type: "ig_refresh_token",
    access_token: token,
  });
  return {
    token: json.access_token,
    expiresAt: new Date(Date.now() + json.expires_in * 1000).toISOString(),
  };
}

/** Refresh when less than 15 days remain (tokens must be at least 24h old to refresh). */
async function maybeRefresh(current: { token: string; expiresAt: string | null }) {
  const remaining = current.expiresAt ? Date.parse(current.expiresAt) - Date.now() : 0;
  if (current.expiresAt && remaining > 15 * 86_400_000) return current.token;
  try {
    const next = await refreshToken(current.token);
    await db
      .from("integrations")
      .upsert({ platform: "instagram", access_token: next.token, token_expires_at: next.expiresAt });
    return next.token;
  } catch (err) {
    logger.warn({ err }, "instagram token refresh failed");
    return current.token;
  }
}

/** Instagram CDN links expire, so images are copied into Supabase Storage. */
async function mirror(id: string, sourceUrl: string): Promise<string | null> {
  const path = `social/instagram/${id}.jpg`;
  const existing = await db.storage.from(MEDIA_BUCKET).list("social/instagram", { search: `${id}.jpg`, limit: 1 });
  if (existing.data?.some((f) => f.name === `${id}.jpg`)) return publicMediaUrl(path);
  try {
    const res = await fetch(sourceUrl, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    const { error } = await db.storage
      .from(MEDIA_BUCKET)
      .upload(path, bytes, { contentType: res.headers.get("content-type") ?? "image/jpeg", upsert: true });
    if (error) throw error;
    return publicMediaUrl(path);
  } catch (err) {
    logger.warn({ err, id }, "instagram media mirror failed");
    return null;
  }
}

export async function syncInstagram(): Promise<number> {
  const current = await getInstagramToken();
  if (!current) return 0;
  const token = await maybeRefresh(current);

  const { data } = await ig<{ data: IgMedia[] }>("/me/media", {
    fields: "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
    limit: "30",
    access_token: token,
  });

  let count = 0;
  for (const m of data) {
    const preview = m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url;
    const mirrored = preview ? await mirror(m.id, preview) : null;
    const { error } = await db.from("social_posts").upsert(
      {
        platform: "instagram",
        external_id: m.id,
        media_type: m.media_type.toLowerCase(),
        caption: m.caption ?? null,
        permalink: m.permalink,
        // video files on the IG CDN expire too; reels open on Instagram via the permalink
        media_url: mirrored,
        thumbnail_url: mirrored,
        published_at: m.timestamp,
      },
      { onConflict: "platform,external_id", ignoreDuplicates: false },
    );
    if (error) logger.warn({ error, id: m.id }, "instagram upsert failed");
    else count++;
  }
  return count;
}
