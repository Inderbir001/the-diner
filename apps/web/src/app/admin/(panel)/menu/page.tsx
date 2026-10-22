"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MenuCategory } from "@diner/shared";
import { adminApi } from "@/lib/admin/client";
import { formatPrice, cn } from "@/lib/utils";
import { PageTitle } from "@/components/admin/shell";
import { ResourceManager, yesNo, type ResourceConfig } from "@/components/admin/resource-manager";
import { StatusPill } from "@/components/admin/drawer";

const categoryConfig: ResourceConfig = {
  resource: "menu-categories",
  singular: "Category",
  sortable: true,
  defaults: { name: "", slug: "", description: "", kind: "food", sort_order: 999, is_active: true },
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "slug", label: "URL anchor", type: "slug", from: "name", required: true },
    { name: "kind", label: "Type", type: "select", required: true, options: [{ value: "food", label: "Food" }, { value: "drinks", label: "Drinks" }] },
    { name: "is_active", label: "Visible on site", type: "boolean" },
    { name: "description", label: "Short description", type: "textarea", rows: 2 },
  ],
  columns: [
    { key: "name", label: "Name" },
    { key: "kind", label: "Type", render: (r) => <span className="capitalize">{String(r.kind)}</span> },
    { key: "is_active", label: "Visible", render: (r) => (r.is_active ? <StatusPill tone="green">Visible</StatusPill> : <StatusPill tone="grey">Hidden</StatusPill>) },
  ],
};

export default function MenuAdminPage() {
  const [tab, setTab] = useState<"items" | "categories">("items");
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [category, setCategory] = useState<string>("");

  const loadCategories = useCallback(async () => {
    const res = await adminApi<{ data: MenuCategory[] }>("/content/menu-categories");
    setCategories(res.data);
  }, []);
  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const catName = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const itemConfig: ResourceConfig = useMemo(
    () => ({
      resource: "menu-items",
      singular: "Dish",
      sortable: true,
      thumbnailKey: "image_url",
      searchKeys: ["name", "description"],
      defaults: {
        category_id: categories[0]?.id ?? "", name: "", description: "", price: null, price_note: "", image_url: null,
        is_veg: false, is_spicy: false, is_signature: false, is_available: true, tags: [], sort_order: 999,
      },
      fields: [
        { name: "name", label: "Dish name", type: "text", required: true },
        { name: "category_id", label: "Category", type: "select", required: true, options: categories.map((c) => ({ value: c.id, label: c.name })) },
        { name: "price", label: "Price (₹)", type: "number" },
        { name: "price_note", label: "Price note", type: "text", placeholder: "e.g. per pint, half / full" },
        { name: "is_veg", label: "Vegetarian", type: "boolean" },
        { name: "is_spicy", label: "Spicy", type: "boolean" },
        { name: "is_signature", label: "House favourite (shows on home page)", type: "boolean" },
        { name: "is_available", label: "Available today", type: "boolean", help: "Turn off to show it as sold out." },
        { name: "description", label: "Description", type: "textarea", rows: 2 },
        { name: "image_url", label: "Photo", type: "image", folder: "menu" },
        { name: "tags", label: "Tags", type: "tags" },
      ],
      columns: [
        { key: "name", label: "Dish", render: (r) => <span className="font-medium text-cream">{String(r.name)}</span> },
        { key: "category_id", label: "Category", render: (r) => catName[String(r.category_id)] ?? "—", className: "hidden md:table-cell" },
        { key: "price", label: "Price", render: (r) => formatPrice(r.price as number | null) || "—" },
        { key: "is_veg", label: "Veg", render: (r) => yesNo(r.is_veg), className: "hidden sm:table-cell" },
        { key: "is_signature", label: "Favourite", render: (r) => (r.is_signature ? <StatusPill tone="amber">★</StatusPill> : "—"), className: "hidden sm:table-cell" },
        { key: "is_available", label: "Status", render: (r) => (r.is_available ? <StatusPill tone="green">On</StatusPill> : <StatusPill tone="red">Sold out</StatusPill>) },
      ],
    }),
    [categories, catName],
  );

  return (
    <>
      <PageTitle title="Menu" description="Add dishes, change prices, mark items sold out and reorder categories. Changes go live within seconds." />
      <div className="mb-6 inline-flex rounded-full bg-white/5 p-1">
        {(["items", "categories"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={cn("rounded-full px-5 py-2 text-sm font-semibold capitalize", tab === t ? "bg-brass text-snow" : "text-sand")}>
            {t === "items" ? "Dishes" : "Categories"}
          </button>
        ))}
      </div>
      {tab === "items" ? (
        <ResourceManager
          key={categories.length}
          config={itemConfig}
          filter={category ? (r) => r.category_id === category : undefined}
          extraDefaults={category ? { category_id: category } : undefined}
          toolbar={
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="field !w-auto !py-2 text-sm">
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          }
        />
      ) : (
        <ResourceManager config={categoryConfig} onChanged={loadCategories} />
      )}
    </>
  );
}
