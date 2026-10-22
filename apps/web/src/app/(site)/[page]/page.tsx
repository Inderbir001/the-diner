import { notFound } from "next/navigation";
import { getPage, getPageSlugs } from "@/lib/data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { JsonLd } from "@/components/site/json-ld";

/** Admin-editable pages: /policy, /privacy, /terms and any new page created in /admin/pages. */
export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await getPageSlugs();
  return pages.map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[page]">) {
  const { page: slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return pageMetadata({ title: page.title, description: page.seo_description ?? undefined, path: `/${page.slug}` });
}

export default async function ContentPage({ params }: PageProps<"/[page]">) {
  const { page: slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: `/${page.slug}` }])} />
      <PageHero title={page.title} crumbs={[{ name: page.title }]} />
      <section className="container-x pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-invert prose-lg prose-diner max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }} />
          <p className="mt-12 text-xs text-muted">Last updated {formatDate(page.updated_at)}</p>
        </div>
      </section>
    </>
  );
}
