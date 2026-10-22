"use client";

import { PageTitle } from "@/components/admin/shell";
import { ResourceManager, type ResourceConfig } from "@/components/admin/resource-manager";
import { StatusPill } from "@/components/admin/drawer";
import { formatDate } from "@/lib/utils";

const config: ResourceConfig = {
  resource: "posts",
  singular: "Post",
  thumbnailKey: "cover_image",
  searchKeys: ["title", "excerpt"],
  publicUrl: (r) => (r.status === "published" ? `/blog/${r.slug}` : null),
  defaults: {
    title: "", slug: "", excerpt: "", content: "", cover_image: null, cover_alt: "", tags: [], author: "The Diner Team",
    status: "draft", published_at: null, seo_title: "", seo_description: "",
  },
  fields: [
    { name: "title", label: "Title", type: "text", required: true, wide: true },
    { name: "slug", label: "URL slug", type: "slug", from: "title", required: true, help: "thediner.in/blog/<slug> — keep it short and keyword-rich." },
    { name: "status", label: "Status", type: "select", required: true, options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
    { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, help: "Shown on the blog list and in search results if no SEO description is set." },
    { name: "cover_image", label: "Cover image", type: "image", folder: "blog" },
    { name: "cover_alt", label: "Cover image description (alt text)", type: "text", wide: true },
    { name: "content", label: "Article", type: "markdown", rows: 20 },
    { name: "tags", label: "Tags", type: "tags" },
    { name: "author", label: "Author", type: "text" },
    { name: "published_at", label: "Publish date", type: "datetime", help: "Leave empty to use the moment you publish. Future dates schedule the post." },
    { name: "seo_title", label: "SEO title (max 70 chars)", type: "text", wide: true },
    { name: "seo_description", label: "SEO description (max 170 chars)", type: "textarea", rows: 2 },
  ],
  columns: [
    { key: "title", label: "Title", render: (r) => <span className="font-medium text-cream">{String(r.title)}</span> },
    { key: "status", label: "Status", render: (r) => <StatusPill tone={r.status === "published" ? "green" : "grey"}>{String(r.status)}</StatusPill> },
    { key: "published_at", label: "Published", render: (r) => (r.published_at ? formatDate(String(r.published_at)) : "—"), className: "hidden md:table-cell" },
  ],
};

export default function BlogAdminPage() {
  return (
    <>
      <PageTitle
        title="Blog"
        description="Posts help people find The Diner on Google. Aim for one useful, local post a week (e.g. ‘best rooftop bars in Whitefield’, match-night guides, new dishes)."
      />
      <ResourceManager config={config} />
    </>
  );
}
