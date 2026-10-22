"use client";

import { PageTitle } from "@/components/admin/shell";
import { ResourceManager, type ResourceConfig } from "@/components/admin/resource-manager";
import { StatusPill } from "@/components/admin/drawer";
import { formatEventDate } from "@/lib/utils";

const config: ResourceConfig = {
  resource: "events",
  singular: "Event",
  thumbnailKey: "image_url",
  publicUrl: (r) => `/events/${r.slug}`,
  defaults: {
    title: "", slug: "", summary: "", body: "", image_url: null, starts_at: null, ends_at: null, is_recurring: false,
    recurrence_label: "", price_label: "", cta_label: "", cta_url: "", is_featured: false, is_published: true,
  },
  fields: [
    { name: "title", label: "Title", type: "text", required: true, wide: true },
    { name: "slug", label: "URL slug", type: "slug", from: "title", required: true },
    { name: "starts_at", label: "Starts", type: "datetime", required: true },
    { name: "ends_at", label: "Ends", type: "datetime" },
    { name: "is_recurring", label: "Repeats every week", type: "boolean", help: "Recurring events always show; one-off events disappear after they end." },
    { name: "recurrence_label", label: "Repeat label", type: "text", placeholder: "Every Saturday, 9 PM" },
    { name: "price_label", label: "Price / entry", type: "text", placeholder: "Free entry" },
    { name: "is_featured", label: "Feature on home page", type: "boolean" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "summary", label: "One-line summary", type: "textarea", rows: 2 },
    { name: "image_url", label: "Image", type: "image", folder: "events" },
    { name: "body", label: "Details", type: "markdown", rows: 8 },
    { name: "cta_label", label: "Button label", type: "text", placeholder: "Get tickets" },
    { name: "cta_url", label: "Button link", type: "url", help: "Leave empty to link to table booking." },
  ],
  columns: [
    { key: "title", label: "Event", render: (r) => <span className="font-medium text-cream">{String(r.title)}</span> },
    { key: "starts_at", label: "When", render: (r) => (r.is_recurring ? String(r.recurrence_label || "Weekly") : r.starts_at ? formatEventDate(String(r.starts_at)) : "—") },
    { key: "is_published", label: "Status", render: (r) => (r.is_published ? <StatusPill tone="green">Live</StatusPill> : <StatusPill tone="grey">Hidden</StatusPill>) },
  ],
};

export default function EventsAdminPage() {
  return (
    <>
      <PageTitle title="Events" description="Live music, DJ nights, match screenings and specials. Events get their own page and Google event listing." />
      <ResourceManager config={config} />
    </>
  );
}
