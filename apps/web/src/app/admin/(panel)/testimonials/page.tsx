"use client";

import { PageTitle } from "@/components/admin/shell";
import { ResourceManager, type ResourceConfig } from "@/components/admin/resource-manager";
import { StatusPill } from "@/components/admin/drawer";

const config: ResourceConfig = {
  resource: "testimonials",
  singular: "Review",
  sortable: true,
  searchKeys: ["author", "text"],
  defaults: { author: "", text: "", rating: 5, source: "Google", sort_order: 999, is_published: true },
  fields: [
    { name: "author", label: "Guest name", type: "text", required: true },
    { name: "source", label: "Source", type: "text", placeholder: "Google, Zomato…" },
    { name: "rating", label: "Stars", type: "select", required: true, options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: "★".repeat(n) })) },
    { name: "is_published", label: "Show on website", type: "boolean" },
    { name: "text", label: "Review", type: "textarea", rows: 4, required: true },
  ],
  columns: [
    { key: "author", label: "Guest" },
    { key: "text", label: "Review", render: (r) => <span className="line-clamp-1 text-sand">{String(r.text)}</span> },
    { key: "is_published", label: "Status", render: (r) => (r.is_published ? <StatusPill tone="green">Live</StatusPill> : <StatusPill tone="grey">Hidden</StatusPill>) },
  ],
};

export default function TestimonialsAdminPage() {
  return (
    <>
      <PageTitle title="Reviews" description="Only publish real reviews from real guests (copy them from Google or Zomato with the guest's name as shown there)." />
      <ResourceManager config={config} />
    </>
  );
}
