import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, getSettings } from "@/lib/data";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { extractHeadings, renderMarkdown } from "@/lib/markdown";
import { formatDate, readingTime } from "@/lib/utils";
import { JsonLd } from "@/components/site/json-ld";
import { PostCard } from "@/components/site/post-card";
import { CtaBand } from "@/components/site/cta-band";
import { ReadingProgress } from "@/components/site/reading-progress";
import { SplitWords } from "@/components/motion/reveal";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const meta = pageMetadata({
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    path: `/blog/${post.slug}`,
    image: post.cover_image,
    type: "article",
  });
  return {
    ...meta,
    keywords: post.tags,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: post.published_at ?? undefined, modifiedTime: post.updated_at, tags: post.tags },
  };
}

const slugifyHeading = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, posts, settings] = await Promise.all([getPost(slug), getPosts(), getSettings()]);
  if (!post) notFound();

  // give h2/h3 ids so the table of contents can link to them
  const html = renderMarkdown(post.content).replace(/<(h[23])>(.*?)<\/\1>/g, (_, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, "");
    return `<${tag} id="${slugifyHeading(text)}">${inner}</${tag}>`;
  });
  const headings = extractHeadings(post.content).filter((h) => h.level === 2);
  const related = posts
    .filter((p) => p.id !== post.id)
    .sort((a, b) => b.tags.filter((t) => post.tags.includes(t)).length - a.tags.filter((t) => post.tags.includes(t)).length)
    .slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={[
          articleJsonLd(post, settings.general.name),
          breadcrumbJsonLd([
            { name: "Journal", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article>
        <header className="container-x pb-12 pt-40 sm:pt-48">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted">
            <Link href="/" className="hover:text-cream">Home</Link> <span aria-hidden>/</span>{" "}
            <Link href="/blog" className="hover:text-cream">Journal</Link>
          </nav>
          <p className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
            {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
            <span aria-hidden>·</span>
            <span>{readingTime(post.content)} min read</span>
            <span aria-hidden>·</span>
            <span>{post.author}</span>
          </p>
          <SplitWords as="h1" immediate text={post.title} className="mt-6 max-w-5xl font-display text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.88]" />
          {post.excerpt && <p className="mt-8 max-w-2xl text-xl leading-relaxed text-sand">{post.excerpt}</p>}
        </header>

        {post.cover_image && (
          <div className="container-x">
            <div className="relative aspect-[21/10] overflow-hidden rounded-[28px]">
              <Image src={post.cover_image} alt={post.cover_alt ?? post.title} fill priority sizes="(min-width:1320px) 1224px, 100vw" className="object-cover" />
            </div>
          </div>
        )}

        <div className="container-x mt-16 grid gap-12 lg:grid-cols-12">
          {headings.length > 1 && (
            <aside className="hidden lg:col-span-3 lg:block">
              <nav aria-label="In this article" className="sticky top-32">
                <p className="eyebrow mb-4">In this article</p>
                <ol className="space-y-2 border-l border-white/10 text-sm">
                  {headings.map((h) => (
                    <li key={h.text}>
                      <a href={`#${slugifyHeading(h.text)}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-sand hover:border-brass hover:text-cream">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}
          <div className={headings.length > 1 ? "lg:col-span-8 lg:col-start-5" : "mx-auto max-w-3xl lg:col-span-12"}>
            <div className="prose prose-invert prose-lg prose-diner max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
            {post.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8">
                {post.tags.map((t) => (
                  <li key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-sand">
                    #{t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>

      <div className="mt-24">
        <CtaBand title="Read enough? Come eat." image={settings.home.heroImage} />
      </div>

      {related.length > 0 && (
        <section className="container-x py-24" aria-label="More from the journal">
          <h2 className="mb-10 font-display text-4xl">Keep reading</h2>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
