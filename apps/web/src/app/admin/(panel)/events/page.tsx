"use client";

import type { DinerEvent } from "@diner/shared";
import { PageTitle } from "@/components/admin/shell";
import { ResourceManager, type ResourceConfig } from "@/components/admin/resource-manager";
import { StatusPill } from "@/components/admin/drawer";
import { EventPoster } from "@/components/site/event-poster";
import { formatEventDate } from "@/lib/utils";

const config: ResourceConfig = {
  resource: "events",
  singular: "Event",
  thumbnailKey: "image_url",
  publicUrl: (r) => `/events/${r.slug}`,
  preview: (v) => <EventPoster event={v as unknown as DinerEvent} sizes="380px" />,
  defaults: {
    title: "", slug: "", kicker: "Every Friday · 9 PM", summary: "", body: "", image_url: null, starts_at: new Date().toISOString(), ends_at: null,
    is_recurring: true, recurrence_label: "Every Friday", price_label: "", highlights: [], theme: "red", display_mode: "template",
    cta_label: "", cta_url: "", is_featured: true, is_published: true,
  },
  fields: [
    { name: "title", label: "Poster heading", type: "text", required: true, wide: true, placeholder: "Ladies Night" },
    { name: "kicker", label: "Top line (day / time)", type: "text", placeholder: "Every Saturday · 9 PM" },
    { name: "price_label", label: "Offer sticker", type: "text", placeholder: "₹499 · Free entry · 2 free shots" },
    { name: "summary", label: "One-line description", type: "textarea", rows: 2 },
    { name: "highlights", label: "Highlight chips (up to 6)", type: "stringList", placeholder: "Guest DJ" },
    {
      name: "theme", label: "Poster colour", type: "select", required: true,
      options: [{ value: "red", label: "Brand red" }, { value: "dark", label: "Black" }, { value: "light", label: "Cream" }],
    },
    {
      name: "display_mode", label: "Poster style", type: "select", required: true,
      options: [{ value: "template", label: "Our template (photo + text)" }, { value: "image", label: "My own poster artwork" }],
      help: "‘My own poster artwork’ shows the uploaded image exactly as it is (e.g. a Canva poster).",
    },
    { name: "image_url", label: "Photo or poster image", type: "image", folder: "events", help: "Drag a photo here or click to upload. Portrait (4:5) works best." },
    { name: "slug", label: "Page URL", type: "slug", from: "title", required: true, help: "thediner.in/events/<url>" },
    { name: "is_recurring", label: "Repeats every week", type: "boolean", help: "Recurring events always show; one-off events disappear after they end." },
    { name: "recurrence_label", label: "Repeat label (for listings)", type: "text", placeholder: "Every Saturday" },
    { name: "starts_at", label: "Starts", type: "datetime", required: true },
    { name: "ends_at", label: "Ends", type: "datetime" },
    { name: "is_featured", label: "Show on home page", type: "boolean" },
    { name: "is_published", label: "Live on website", type: "boolean" },
    { name: "body", label: "Event page details", type: "markdown", rows: 8 },
    { name: "cta_label", label: "Button label", type: "text", placeholder: "Get tickets" },
    { name: "cta_url", label: "Button link", type: "url", help: "Leave empty to link to table booking." },
  ],
  columns: [
    { key: "title", label: "Event", render: (r) => <span className="font-medium text-cream">{String(r.title)}</span> },
    { key: "starts_at", label: "When", render: (r) => String(r.kicker || (r.is_recurring ? r.recurrence_label || "Weekly" : r.starts_at ? formatEventDate(String(r.starts_at)) : "—")) },
    { key: "is_published", label: "Status", render: (r) => (r.is_published ? <StatusPill tone="green">Live</StatusPill> : <StatusPill tone="grey">Hidden</StatusPill>) },
  ],
};

export default function EventsAdminPage() {
  return (
    <>
      <PageTitle
        title="Events"
        description="Fill in the poster template — heading, day/time, offer, highlights, colour and a photo — and watch the preview update. Save and it's live on the website in seconds."
      />
      <ResourceManager config={config} />
    </>
  );
}
