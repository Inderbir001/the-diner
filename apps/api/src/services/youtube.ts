import { env } from "../env";
import { db } from "../lib/supabase";
import { getSetting } from "../lib/settings";

/**
 * YouTube uploads. Uses the Data API when YOUTUBE_API_KEY is set (more fields, up to 50 videos),
 * otherwise the public channel RSS feed (no key needed, latest 15 videos).
 */
interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
}

async function channelId(): Promise<string | null> {
  const social = await getSetting("social");
  return social.youtubeChannelId || env.YOUTUBE_CHANNEL_ID || null;
}

async function viaApi(channel: string, key: string): Promise<{ videos: Video[]; title: string | null }> {
  const uploads = channel.replace(/^UC/, "UU");
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.search = new URLSearchParams({ part: "snippet", playlistId: uploads, maxResults: "30", key }).toString();
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  const json = (await res.json()) as {
    error?: { message: string };
    items?: {
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        channelTitle: string;
        resourceId: { videoId: string };
      };
    }[];
  };
  if (!res.ok || json.error) throw new Error(`YouTube: ${json.error?.message ?? res.statusText}`);
  const items = (json.items ?? []).filter((i) => i.snippet.title !== "Private video" && i.snippet.title !== "Deleted video");
  return {
    title: items[0]?.snippet.channelTitle ?? null,
    videos: items.map((i) => ({
      id: i.snippet.resourceId.videoId,
      title: i.snippet.title,
      description: i.snippet.description,
      publishedAt: i.snippet.publishedAt,
    })),
  };
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

async function viaRss(channel: string): Promise<{ videos: Video[]; title: string | null }> {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channel)}`, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`YouTube RSS: ${res.status} — check the channel ID`);
  const xml = await res.text();
  const title = xml.match(/<author>\s*<name>([^<]*)<\/name>/)?.[1] ?? null;
  const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => ({
    id: entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "",
    title: decode(entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""),
    description: decode(entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? ""),
    publishedAt: entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? new Date().toISOString(),
  }));
  return { title: title ? decode(title) : null, videos: videos.filter((v) => v.id) };
}

export async function syncYouTube(): Promise<number> {
  const channel = await channelId();
  if (!channel) return 0;
  const { videos, title } = env.YOUTUBE_API_KEY ? await viaApi(channel, env.YOUTUBE_API_KEY) : await viaRss(channel);

  const rows = videos.map((v) => ({
    platform: "youtube",
    external_id: v.id,
    media_type: "video",
    caption: v.description ? `${v.title}\n\n${v.description}` : v.title,
    permalink: `https://www.youtube.com/watch?v=${v.id}`,
    media_url: `https://www.youtube-nocookie.com/embed/${v.id}`,
    thumbnail_url: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    published_at: v.publishedAt,
  }));
  if (rows.length) {
    const { error } = await db.from("social_posts").upsert(rows, { onConflict: "platform,external_id" });
    if (error) throw new Error(error.message);
  }
  await db.from("integrations").upsert({ platform: "youtube", account_id: channel, account_name: title });
  return rows.length;
}
