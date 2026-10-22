import { getGallery, getSettings, getSocialPosts } from "@/lib/data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { InstagramFeed, YouTubeFeed } from "@/components/site/social-feed";
import { JsonLd } from "@/components/site/json-ld";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Gallery — Rooftop, Food, Cocktails & Nights Out",
  description:
    "Photos and videos from The Diner Restobar in Whitefield: the rooftop, the bar, biryani and tandoor plates, live music and DJ nights. Updated from our Instagram and YouTube.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const [images, settings, instagram, youtube] = await Promise.all([
    getGallery(),
    getSettings(),
    getSocialPosts("instagram", 16),
    getSocialPosts("youtube", 6),
  ]);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Gallery", path: "/gallery" }])} />
      <PageHero eyebrow="Gallery" title="A look around." intro="The room, the rooftop, the plates and the people." crumbs={[{ name: "Gallery" }]} />
      <section className="container-x pb-12" aria-label="Photos">
        <GalleryGrid images={images} />
      </section>
      <YouTubeFeed videos={youtube} social={settings.social} limit={6} />
      {instagram.length > 0 && <InstagramFeed posts={instagram} social={settings.social} limit={16} />}
    </>
  );
}
