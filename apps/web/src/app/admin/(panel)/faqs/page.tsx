"use client";

import { PageTitle } from "@/components/admin/shell";
import { ResourceManager, type ResourceConfig } from "@/components/admin/resource-manager";
import { StatusPill } from "@/components/admin/drawer";

const config: ResourceConfig = {
  resource: "faqs",
  singular: "Question",
  sortable: true,
  searchKeys: ["question", "answer"],
  defaults: { question: "", answer: "", sort_order: 999, is_published: true },
  fields: [
    { name: "question", label: "Question", type: "text", required: true, wide: true },
    { name: "answer", label: "Answer", type: "textarea", rows: 4, required: true },
    { name: "is_published", label: "Visible", type: "boolean" },
  ],
  columns: [
    { key: "question", label: "Question", render: (r) => <span className="text-cream">{String(r.question)}</span> },
    { key: "is_published", label: "Status", render: (r) => (r.is_published ? <StatusPill tone="green">Live</StatusPill> : <StatusPill tone="grey">Hidden</StatusPill>) },
  ],
};

export default function FaqsAdminPage() {
  return (
    <>
      <PageTitle title="FAQs" description="Shown on the home and contact pages, and marked up for Google's FAQ results." />
      <ResourceManager config={config} />
    </>
  );
}
