import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";

const ALLOWED_TAGS = ["settings", "menu", "events", "posts", "gallery", "testimonials", "faqs", "pages", "social"];

function authorised(given: string | null) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Called by the Render API after admin edits and social syncs, so changes go live within seconds. */
export async function POST(request: Request) {
  if (!authorised(request.headers.get("x-revalidate-secret"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = z.object({ tags: z.array(z.enum(ALLOWED_TAGS)).min(1) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid tags" }, { status: 400 });

  for (const tag of parsed.data.tags) revalidateTag(tag, { expire: 0 });
  // settings affect every page (header, footer, structured data)
  if (parsed.data.tags.includes("settings")) revalidatePath("/", "layout");
  return Response.json({ revalidated: parsed.data.tags, now: Date.now() });
}
