import { db } from "../lib/supabase";
import { logger } from "../lib/logger";
import { revalidate } from "../lib/revalidate";
import { syncInstagram } from "./instagram";
import { syncYouTube } from "./youtube";

export type Platform = "instagram" | "youtube";
const runners: Record<Platform, () => Promise<number>> = { instagram: syncInstagram, youtube: syncYouTube };

let running: Promise<Record<Platform, { ok: boolean; count: number; error?: string }>> | null = null;

/** Pull the latest Instagram posts and YouTube videos, then refresh the website. Overlapping calls share one run. */
export function syncSocial(platforms: Platform[] = ["instagram", "youtube"]) {
  if (running) return running;
  running = (async () => {
    const results = {} as Record<Platform, { ok: boolean; count: number; error?: string }>;
    for (const p of platforms) {
      try {
        const count = await runners[p]();
        results[p] = { ok: true, count };
        await db
          .from("integrations")
          .upsert({ platform: p, last_synced_at: new Date().toISOString(), last_error: null });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        results[p] = { ok: false, count: 0, error: message };
        logger.error({ err, platform: p }, "social sync failed");
        await db.from("integrations").upsert({ platform: p, last_error: message });
      }
    }
    if (Object.values(results).some((r) => r.ok && r.count > 0)) await revalidate(["social"]);
    logger.info({ results }, "social sync finished");
    return results;
  })().finally(() => {
    running = null;
  });
  return running;
}
