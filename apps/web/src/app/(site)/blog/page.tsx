import { getPosts } from "@/lib/data";
import { breadcrumbJsonLd, pageMetadata, absoluteUrl } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 3600;

export const metadata = {
  ...pageMetadata({
    title: "Journal — Food, Drinks & Nights Out in Whitefield",
    description:
      "Stories, guides and news from The Diner Restobar: where to watch cricket in Whitefield, team party planning, Andhra food and beer pairings, and what's new on the menu.",
    path: "/blog",
  }),
  alternates: { canonical: absoluteUrl("/blog"), types: { "application/rss+xml": absoluteUrl("/blog/rss.xml") } },
};

export default async function BlogPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Journal", path: "/blog" }])} />
      <PageHero
        eyebrow="The journal"
        title="Notes from the kitchen and the bar."
        intro="Guides to eating, drinking and partying in Whitefield — plus what's new at The Diner."
        crumbs={[{ name: "Journal" }]}
      />
      <section className="container-x pb-24" aria-label="Posts">
        {lead ? (
          <>
            <Reveal>
              <PostCard post={lead} large priority />
            </Reveal>
            {rest.length > 0 && (
              <div className="mt-20 grid gap-x-8 gap-y-16 border-t border-black/10 pt-16 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 0.08}>
                    <PostCard post={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-sand">The first stories are on their way.</p>
        )}
      </section>
    </>
  );
}
