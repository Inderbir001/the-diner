import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  parseSettings,
  PUBLIC_SETTINGS_KEYS,
  type DinerEvent,
  type Faq,
  type GalleryImage,
  type MenuCategory,
  type MenuItem,
  type Page,
  type Post,
  type SettingsMap,
  type SocialPost,
  type Testimonial,
} from "@diner/shared";
import { hasSupabase, SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";
import * as fb from "./fallback";

/** Cached content refreshes hourly, or immediately when the API revalidates a tag after an admin edit. */
const REVALIDATE_SECONDS = 3600;

function client(tags: string[]) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS, tags } }),
    },
  });
}

async function query<T>(tags: string[], fallback: T, run: (db: ReturnType<typeof client>) => PromiseLike<{ data: unknown; error: unknown }>): Promise<T> {
  if (!hasSupabase) return fallback;
  try {
    const { data, error } = await run(client(tags));
    if (error) throw error;
    return (data as T) ?? fallback;
  } catch (err) {
    console.error(`[data] ${tags.join(",")} query failed`, err);
    return fallback;
  }
}

type PublicSettings = Pick<SettingsMap, (typeof PUBLIC_SETTINGS_KEYS)[number]>;

export const getSettings = cache(async (): Promise<PublicSettings> => {
  const rows = await query<{ key: string; value: unknown }[] | null>(["settings"], null, (db) =>
    db.from("settings").select("key, value"),
  );
  if (!rows) return fb.fallbackSettings;
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(
    PUBLIC_SETTINGS_KEYS.map((k) => [k, k in byKey ? parseSettings(k, byKey[k]) : fb.fallbackSettings[k]]),
  ) as PublicSettings;
});

export const getMenu = cache(async () => {
  const [categories, items] = await Promise.all([
    query<MenuCategory[]>(["menu"], fb.fallbackCategories, (db) =>
      db.from("menu_categories").select("*").order("sort_order"),
    ),
    query<MenuItem[]>(["menu"], fb.fallbackItems, (db) => db.from("menu_items").select("*").order("sort_order")),
  ]);
  return categories
    .map((c) => ({ ...c, items: items.filter((i) => i.category_id === c.id) }))
    .filter((c) => c.items.length > 0);
});
export type MenuSection = Awaited<ReturnType<typeof getMenu>>[number];

export const getSignatureDishes = cache(async () => {
  const menu = await getMenu();
  return menu.flatMap((c) => c.items.filter((i) => i.is_signature && i.is_available)).slice(0, 8);
});

export const getEvents = cache(async () => {
  const events = await query<DinerEvent[]>(["events"], fb.fallbackEvents, (db) =>
    db.from("events").select("*").order("starts_at"),
  );
  const now = Date.now() - 6 * 3600_000;
  // recurring events always show; one-off events disappear once they're over
  return events.filter((e) => e.is_recurring || Date.parse(e.ends_at ?? e.starts_at) >= now);
});

export const getEvent = cache(async (slug: string) => {
  const events = await query<DinerEvent[]>(["events"], fb.fallbackEvents, (db) =>
    db.from("events").select("*").eq("slug", slug).limit(1),
  );
  return events.find((e) => e.slug === slug) ?? null;
});

export const getPosts = cache(async (limit = 100) =>
  query<Post[]>(["posts"], fb.fallbackPosts.slice(0, limit), (db) =>
    db
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, cover_alt, tags, author, published_at, updated_at, created_at, status, seo_title, seo_description, content")
      .order("published_at", { ascending: false })
      .limit(limit),
  ),
);

export const getPost = cache(async (slug: string) => {
  const posts = await query<Post[]>(["posts"], fb.fallbackPosts, (db) => db.from("posts").select("*").eq("slug", slug).limit(1));
  return posts.find((p) => p.slug === slug) ?? null;
});

export const getFaqs = cache(async () =>
  query<Faq[]>(["faqs"], fb.fallbackFaqs, (db) => db.from("faqs").select("*").order("sort_order")),
);

export const getTestimonials = cache(async () =>
  query<Testimonial[]>(["testimonials"], [], (db) => db.from("testimonials").select("*").order("sort_order")),
);

export const getGallery = cache(async () =>
  query<GalleryImage[]>(["gallery"], fb.fallbackGallery, (db) => db.from("gallery_images").select("*").order("sort_order")),
);

export const getSocialPosts = cache(async (platform: "instagram" | "youtube", limit = 12) =>
  query<SocialPost[]>(["social"], [], (db) =>
    db
      .from("social_posts")
      .select("*")
      .eq("platform", platform)
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(limit),
  ),
);

export const getPage = cache(async (slug: string) => {
  const pages = await query<Page[]>(["pages"], fb.fallbackPages, (db) => db.from("pages").select("*").eq("slug", slug).limit(1));
  return pages.find((p) => p.slug === slug) ?? null;
});

export const getPageSlugs = cache(async () =>
  query<{ slug: string; updated_at: string }[]>(["pages"], fb.fallbackPages, (db) => db.from("pages").select("slug, updated_at")),
);
