"use client";

import { PageTitle } from "@/components/admin/shell";
import { ResourceManager, type ResourceConfig } from "@/components/admin/resource-manager";
import { StatusPill } from "@/components/admin/drawer";

const config: ResourceConfig = {
  resource: "gallery",
  singular: "Photo",
  sortable: true,
  thumbnailKey: "url",
  searchKeys: ["alt", "caption", "category"],
  defaults: { url: null, alt: "", caption: "", category: "ambience", sort_order: 999, is_published: true },
  fields: [
    { name: "url", label: "Photo", type: "image", folder: "gallery", required: true },
    { name: "alt", label: "Describe the photo (for Google & screen readers)", type: "text", wide: true, required: true },
    { name: "caption", label: "Caption", type: "text" },
    {
      name: "category", label: "Category", type: "select", required: true,
      options: ["ambience", "food", "bar", "events", "rooftop", "people"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })),
    },
    { name: "is_published", label: "Visible", type: "boolean" },
  ],
  columns: [
    { key: "alt", label: "Description", render: (r) => <span className="text-cream">{String(r.alt || "—")}</span> },
    { key: "category", label: "Category", render: (r) => <span className="capitalize">{String(r.category)}</span> },
    { key: "is_published", label: "Status", render: (r) => (r.is_published ? <StatusPill tone="green">Visible</StatusPill> : <StatusPill tone="grey">Hidden</StatusPill>) },
  ],
};

export default function GalleryAdminPage() {
  return (
    <>
      <PageTitle title="Gallery" description="Upload photos of the venue, food and nights out. Instagram posts appear on the gallery page automatically too." />
      <ResourceManager config={config} />
    </>
  );
}
