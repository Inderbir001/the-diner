import { env } from "../env";
import { logger } from "./logger";

/**
 * Ask the Next.js site to refresh cached pages for the given tags.
 * Never throws: a failed revalidation only delays the update until the next ISR window.
 */
export async function revalidate(tags: readonly string[]): Promise<void> {
  if (!tags.length) return;
  try {
    const res = await fetch(new URL("/api/revalidate", env.WEB_URL), {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": env.REVALIDATE_SECRET },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) logger.warn({ status: res.status, tags }, "revalidate failed");
  } catch (err) {
    logger.warn({ err, tags }, "revalidate request error");
  }
}
