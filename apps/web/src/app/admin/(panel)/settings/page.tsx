"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { SettingsKey, SettingsMap } from "@diner/shared";
import { adminApi } from "@/lib/admin/client";
import { cn } from "@/lib/utils";
import { PageTitle } from "@/components/admin/shell";
import { FieldGrid, type Field } from "@/components/admin/fields";

const TABS: { key: SettingsKey; label: string; description: string; fields: Field[] }[] = [
  {
    key: "general",
    label: "Business info",
    description: "Name, contact details, address and opening hours. Used across the site, in Google's business data and in emails.",
    fields: [
      { name: "name", label: "Business name", type: "text", required: true },
      { name: "legalName", label: "Legal / company name", type: "text" },
      { name: "tagline", label: "Tagline", type: "text", wide: true },
      { name: "description", label: "Short description", type: "textarea", rows: 3, help: "Used for Google and the contact page." },
      { name: "phones", label: "Phone numbers", type: "stringList", placeholder: "+91 …" },
      { name: "whatsapp", label: "WhatsApp number", type: "text", placeholder: "+9199…" },
      { name: "email", label: "Email", type: "email" },
      { name: "address.street", label: "Street", type: "text", wide: true },
      { name: "address.locality", label: "Area", type: "text" },
      { name: "address.city", label: "City", type: "text" },
      { name: "address.region", label: "State", type: "text" },
      { name: "address.postalCode", label: "PIN code", type: "text" },
      { name: "landmark", label: "Landmark", type: "text" },
      { name: "geo.lat", label: "Latitude", type: "number", help: "Right-click your pin in Google Maps to copy exact coordinates." },
      { name: "geo.lng", label: "Longitude", type: "number" },
      { name: "mapUrl", label: "Google Maps link", type: "url", wide: true },
      { name: "mapEmbedUrl", label: "Google Maps embed URL", type: "url", wide: true, help: "Google Maps → Share → Embed a map → copy the src=\"…\" URL." },
      { name: "priceRange", label: "Price range", type: "text", placeholder: "₹₹" },
      { name: "costForTwo", label: "Cost for two", type: "text" },
      { name: "cuisines", label: "Cuisines", type: "stringList" },
      { name: "features", label: "Amenities", type: "stringList" },
      {
        name: "hours", label: "Opening hours", type: "objectList",
        fields: [
          { name: "day", label: "Day", type: "text" },
          { name: "closed", label: "Closed all day", type: "boolean" },
          { name: "open", label: "Opens", type: "time" },
          { name: "close", label: "Closes", type: "time", help: "Times after midnight (e.g. 00:30) count as the same night." },
        ],
      },
      { name: "hoursNote", label: "Hours note", type: "text", wide: true, placeholder: "Kitchen closes at 12:00 AM." },
    ],
  },
  {
    key: "home",
    label: "Home page",
    description: "Hero, story, numbers, the scrolling ticker, experiences and party packages.",
    fields: [
      { name: "heroEyebrow", label: "Hero label", type: "text" },
      { name: "heroTitle", label: "Hero headline", type: "text", wide: true, help: "Use | to break lines — every second line turns red. e.g. Rooftop|Restobar|Whitefield" },
      { name: "heroSubtitle", label: "Hero text", type: "textarea", rows: 2 },
      { name: "heroImage", label: "Hero main photo (landscape)", type: "image", folder: "home" },
      { name: "heroSideImages", label: "Hero small photos (2 squares)", type: "imageList", folder: "home" },
      { name: "heroVideo", label: "Hero video (optional MP4, plays muted)", type: "image", folder: "home" },
      { name: "storyTitle", label: "Story heading", type: "text", wide: true },
      { name: "storyBody", label: "Story text", type: "textarea", rows: 5 },
      { name: "storyImage", label: "Story image", type: "image", folder: "home" },
      { name: "stats", label: "Numbers", type: "objectList", fields: [{ name: "value", label: "Value", type: "text" }, { name: "label", label: "Label", type: "text" }] },
      { name: "marquee", label: "Scrolling ticker words", type: "stringList" },
      {
        name: "experiences", label: "Experiences", type: "objectList",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea", rows: 2 },
          { name: "image", label: "Image", type: "image", folder: "home" },
        ],
      },
      { name: "dealsTitle", label: "Best-prices section heading", type: "text", wide: true },
      { name: "dealsIntro", label: "Best-prices section intro", type: "textarea", rows: 2 },
      {
        name: "deals", label: "Deals & prices (shown big on the home page)", type: "objectList",
        fields: [
          { name: "price", label: "Price", type: "text", placeholder: "₹99" },
          { name: "title", label: "What it is", type: "text", placeholder: "Social Hours — bar drinks & bites" },
          { name: "note", label: "Small label", type: "text", placeholder: "Daily 4–8 PM" },
          { name: "href", label: "Link (optional)", type: "text", placeholder: "/events/social-hours" },
        ],
      },
      {
        name: "partyPackages", label: "Party packages", type: "objectList",
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "price", label: "Price", type: "text" },
          { name: "description", label: "What's included", type: "textarea", rows: 2 },
        ],
      },
    ],
  },
  {
    key: "booking",
    label: "Booking rules",
    description: "Control when and how guests can book online.",
    fields: [
      { name: "enabled", label: "Online booking on", type: "boolean" },
      { name: "autoConfirm", label: "Auto-confirm bookings", type: "boolean", help: "Off: new bookings arrive as ‘pending’ for you to confirm." },
      { name: "firstSeating", label: "First seating", type: "time" },
      { name: "lastSeating", label: "Last seating", type: "time" },
      { name: "slotMinutes", label: "Minutes between slots", type: "number" },
      { name: "capacityPerSlot", label: "Max guests per slot", type: "number" },
      { name: "maxPartySize", label: "Largest party bookable online", type: "number" },
      { name: "minNoticeMinutes", label: "Minimum notice (minutes)", type: "number" },
      { name: "maxDaysAhead", label: "Book up to (days ahead)", type: "number" },
      { name: "areas", label: "Seating areas", type: "stringList" },
      { name: "occasions", label: "Occasions", type: "stringList" },
      { name: "blackoutDates", label: "Closed / fully booked dates (YYYY-MM-DD)", type: "stringList", placeholder: "2026-12-31" },
      { name: "policyNote", label: "Booking policy note", type: "textarea", rows: 2 },
    ],
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "Who gets emailed about new bookings and enquiries. Requires RESEND_API_KEY on the API.",
    fields: [
      { name: "bookingEmails", label: "Booking alert emails", type: "stringList" },
      { name: "enquiryEmails", label: "Enquiry alert emails", type: "stringList" },
      { name: "sendGuestConfirmation", label: "Email guests their booking confirmation", type: "boolean" },
    ],
  },
  {
    key: "seo",
    label: "SEO",
    description: "Default title and description for Google, social share image and tracking.",
    fields: [
      { name: "defaultTitle", label: "Home page title (≤ 60 chars)", type: "text", wide: true },
      { name: "titleTemplate", label: "Title template", type: "text", wide: true, help: "%s is replaced by each page's title." },
      { name: "description", label: "Meta description (≤ 160 chars)", type: "textarea", rows: 2 },
      { name: "keywords", label: "Target keywords", type: "stringList" },
      { name: "ogImage", label: "Social share image (1200×630)", type: "image", folder: "home" },
      { name: "googleSiteVerification", label: "Google Search Console verification code", type: "text" },
      { name: "gaMeasurementId", label: "Google Analytics ID (G-…)", type: "text" },
    ],
  },
  {
    key: "social",
    label: "Social links",
    description: "Profile links shown in the footer and sent to Google as ‘sameAs’.",
    fields: [
      { name: "instagram", label: "Instagram URL", type: "url" },
      { name: "instagramHandle", label: "Instagram handle (without @)", type: "text" },
      { name: "youtube", label: "YouTube channel URL", type: "url" },
      { name: "youtubeChannelId", label: "YouTube channel ID (UC…)", type: "text", help: "Needed for auto-sync. Find it at youtube.com/account_advanced." },
      { name: "facebook", label: "Facebook URL", type: "url" },
      { name: "zomato", label: "Zomato URL", type: "url" },
      { name: "swiggy", label: "Swiggy URL", type: "url" },
      { name: "googleReviews", label: "Google reviews URL", type: "url" },
      { name: "tripadvisor", label: "Tripadvisor URL", type: "url" },
    ],
  },
  {
    key: "announcement",
    label: "Announcement bar",
    description: "The thin bar at the very top of the site.",
    fields: [
      { name: "enabled", label: "Show bar", type: "boolean" },
      { name: "text", label: "Message", type: "text", wide: true },
      { name: "linkLabel", label: "Link label", type: "text" },
      { name: "linkUrl", label: "Link URL", type: "text", placeholder: "/events" },
    ],
  },
];

const getPath = (obj: Record<string, unknown>, path: string) =>
  path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);

function setPath<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  if (!rest.length) return { ...obj, [head]: value };
  return { ...obj, [head]: setPath((obj[head] as Record<string, unknown>) ?? {}, rest.join("."), value) };
}

function SettingsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<SettingsKey>((params.get("tab") as SettingsKey) ?? "general");
  const [all, setAll] = useState<SettingsMap | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    adminApi<{ data: SettingsMap }>("/settings")
      .then((r) => setAll(r.data))
      .catch((e) => toast.error(e.message));
  }, []);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const current = TABS.find((t) => t.key === tab)!;
  const values = (all?.[tab] ?? {}) as Record<string, unknown>;
  const flat = Object.fromEntries(current.fields.map((f) => [f.name, getPath(values, f.name)]));

  async function save() {
    if (!all) return;
    setSaving(true);
    try {
      // settings have no nullable fields: a cleared image becomes ""
      const body = JSON.parse(JSON.stringify(all[tab], (_k, v) => (v === null ? "" : v))) as Record<string, unknown>;
      // drop empty rows from simple lists
      for (const f of current.fields) if (f.type === "stringList") body[f.name] = ((body[f.name] as string[]) ?? []).map((s) => s.trim()).filter(Boolean);
      const res = await adminApi<{ data: SettingsMap[SettingsKey] }>(`/settings/${tab}`, { method: "PUT", json: body });
      setAll({ ...all, [tab]: res.data });
      setDirty(false);
      toast.success("Saved — the website updates in a few seconds.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageTitle title="Site settings" description="Everything on the website that isn't a menu item, post or event lives here." />
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Settings sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                if (dirty && !confirm("Discard unsaved changes?")) return;
                setDirty(false);
                setTab(t.key);
                router.replace(`/admin/settings?tab=${t.key}`);
              }}
              className={cn("shrink-0 rounded-xl px-4 py-2.5 text-left text-sm", tab === t.key ? "bg-white/[0.08] text-cream" : "text-sand hover:text-cream")}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <section className="rounded-2xl border border-white/10 bg-coal p-6 sm:p-8">
          <h2 className="font-display text-2xl">{current.label}</h2>
          <p className="mb-8 mt-1 text-sm text-sand">{current.description}</p>
          {!all ? (
            <Loader2 className="size-5 animate-spin text-brass" />
          ) : (
            <FieldGrid
              key={tab}
              fields={current.fields}
              values={flat}
              onChange={(name, v) => {
                setDirty(true);
                setAll((a) => (a ? { ...a, [tab]: setPath(a[tab] as Record<string, unknown>, name, v) } : a));
              }}
            />
          )}
          <div className="sticky bottom-0 -mx-6 mt-8 flex items-center justify-end gap-3 border-t border-white/10 bg-coal/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
            {dirty && <span className="text-xs text-brass">Unsaved changes</span>}
            <button type="button" onClick={save} disabled={saving || !all} className="btn-primary">
              {saving && <Loader2 className="size-4 animate-spin" />} Save {current.label.toLowerCase()}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsInner />
    </Suspense>
  );
}
