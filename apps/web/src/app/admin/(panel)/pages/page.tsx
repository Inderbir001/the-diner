"use client";

import { PageTitle } from "@/components/admin/shell";
import { ResourceManager, type ResourceConfig } from "@/components/admin/resource-manager";
import { StatusPill } from "@/components/admin/drawer";

const config: ResourceConfig = {
  resource: "pages",
  singular: "Page",
  searchKeys: ["title", "slug"],
  publicUrl: (r) => `/${r.slug}`,
  defaults: { slug: "", title: "", content: "", seo_description: "", is_published: true },
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "URL", type: "slug", from: "title", required: true, help: "thediner.in/<slug>" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "seo_description", label: "SEO description", type: "textarea", rows: 2 },
    { name: "content", label: "Content", type: "markdown", rows: 18 },
  ],
  columns: [
    { key: "title", label: "Title", render: (r) => <span className="text-cream">{String(r.title)}</span> },
    { key: "slug", label: "URL", render: (r) => `/${r.slug}` },
    { key: "is_published", label: "Status", render: (r) => (r.is_published ? <StatusPill tone="green">Live</StatusPill> : <StatusPill tone="grey">Hidden</StatusPill>) },
  ],
};

export default function PagesAdminPage() {
  return (
    <>
      <PageTitle title="Pages" description="House policy, privacy, terms — or any simple page you want to add." />
      <ResourceManager config={config} />
    </>
  );
}
