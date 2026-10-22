import type { MetadataRoute } from "next";
import { getEvents, getPageSlugs, getPosts } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, events, pages] = await Promise.all([getPosts(), getEvents(), getPageSlugs()]);
  const now = new Date();
  const staticRoutes: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "daily"],
    ["/menu", 0.9, "weekly"],
    ["/reserve", 0.9, "monthly"],
    ["/events", 0.8, "daily"],
    ["/private-parties", 0.8, "monthly"],
    ["/gallery", 0.6, "weekly"],
    ["/blog", 0.7, "weekly"],
    ["/contact", 0.7, "monthly"],
  ];
  return [
    ...staticRoutes.map(([path, priority, changeFrequency]) => ({ url: absoluteUrl(path), lastModified: now, changeFrequency, priority })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: p.cover_image ? [absoluteUrl(p.cover_image)] : undefined,
    })),
    ...events.map((e) => ({ url: absoluteUrl(`/events/${e.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...pages.map((p) => ({ url: absoluteUrl(`/${p.slug}`), lastModified: new Date(p.updated_at), changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
