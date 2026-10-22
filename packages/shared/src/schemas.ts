import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const hhmm = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM");
const phone = z
  .string()
  .trim()
  .min(8, "Enter a valid phone number")
  .max(20)
  .regex(/^[+\d][\d\s-]{6,}$/, "Enter a valid phone number");
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));
const slug = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only");

// ---------------------------------------------------------------------------
// public forms
// ---------------------------------------------------------------------------
export const bookingRequestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone,
  email: z.union([z.email("Enter a valid email"), z.literal("")]).optional(),
  partySize: z.coerce.number().int().min(1).max(500),
  date: isoDate,
  time: hhmm,
  area: optionalText(40),
  occasion: optionalText(40),
  notes: optionalText(500),
  /** honeypot — must stay empty */
  company: z.string().max(200).optional(),
});
export type BookingRequest = z.input<typeof bookingRequestSchema>;

export const enquiryRequestSchema = z.object({
  type: z.enum(["general", "party", "corporate", "feedback"]).default("general"),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.union([phone, z.literal("")]).optional(),
  email: z.union([z.email("Enter a valid email"), z.literal("")]).optional(),
  eventDate: z.union([isoDate, z.literal("")]).optional(),
  guests: z.coerce.number().int().min(1).max(1000).optional(),
  message: z.string().trim().min(5, "Tell us a little more").max(2000),
  company: z.string().max(200).optional(),
});
export type EnquiryRequest = z.input<typeof enquiryRequestSchema>;

// ---------------------------------------------------------------------------
// admin resources (column names match the database)
// ---------------------------------------------------------------------------
export const BOOKING_STATUSES = ["pending", "confirmed", "seated", "completed", "cancelled", "no_show"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const bookingAdminSchema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(5).max(20),
  email: z.string().trim().max(200).nullish(),
  party_size: z.coerce.number().int().min(1).max(500),
  booking_date: isoDate,
  booking_time: hhmm,
  area: z.string().max(40).nullish(),
  occasion: z.string().max(40).nullish(),
  notes: z.string().max(1000).nullish(),
  status: z.enum(BOOKING_STATUSES).default("confirmed"),
  admin_notes: z.string().max(2000).nullish(),
  source: z.string().max(40).default("admin"),
});

export const EVENT_THEMES = ["red", "dark", "light"] as const;
export type EventTheme = (typeof EVENT_THEMES)[number];

export const menuCategorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug,
  description: z.string().max(400).nullish(),
  kind: z.enum(["food", "drinks"]).default("food"),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const menuItemSchema = z.object({
  category_id: z.uuid(),
  name: z.string().trim().min(1).max(120),
  description: z.string().max(600).nullish(),
  price: z.coerce.number().min(0).nullish(),
  price_note: z.string().max(60).nullish(),
  image_url: z.string().max(2000).nullish(),
  is_veg: z.boolean().default(false),
  is_spicy: z.boolean().default(false),
  is_signature: z.boolean().default(false),
  is_available: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  sort_order: z.coerce.number().int().default(0),
});

export const eventSchema = z.object({
  title: z.string().trim().min(1).max(140),
  slug,
  summary: z.string().max(300).nullish(),
  body: z.string().max(20000).nullish(),
  image_url: z.string().max(2000).nullish(),
  starts_at: z.string().min(1),
  ends_at: z.string().nullish(),
  is_recurring: z.boolean().default(false),
  recurrence_label: z.string().max(80).nullish(),
  price_label: z.string().max(80).nullish(),
  cta_label: z.string().max(40).nullish(),
  cta_url: z.string().max(2000).nullish(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  /** poster template fields */
  kicker: z.string().max(60).nullish(),
  highlights: z.array(z.string().max(60)).max(6).default([]),
  theme: z.enum(EVENT_THEMES).default("red"),
  display_mode: z.enum(["template", "image"]).default("template"),
});

export const postSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug,
  excerpt: z.string().max(400).nullish(),
  content: z.string().max(100000).default(""),
  cover_image: z.string().max(2000).nullish(),
  cover_alt: z.string().max(200).nullish(),
  tags: z.array(z.string()).default([]),
  author: z.string().max(80).default("The Diner Team"),
  status: z.enum(["draft", "published"]).default("draft"),
  published_at: z.string().nullish(),
  seo_title: z.string().max(70).nullish(),
  seo_description: z.string().max(170).nullish(),
});

export const gallerySchema = z.object({
  url: z.string().min(1).max(2000),
  alt: z.string().max(200).default(""),
  caption: z.string().max(300).nullish(),
  category: z.string().max(40).default("ambience"),
  sort_order: z.coerce.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  author: z.string().trim().min(1).max(80),
  text: z.string().trim().min(1).max(1000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  source: z.string().max(40).nullish(),
  sort_order: z.coerce.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const faqSchema = z.object({
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(3000),
  sort_order: z.coerce.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const pageSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(140),
  content: z.string().max(100000).default(""),
  seo_description: z.string().max(170).nullish(),
  is_published: z.boolean().default(true),
});

export const enquiryAdminSchema = z.object({
  status: z.enum(["new", "in_progress", "closed"]),
});

export const socialPostAdminSchema = z.object({
  is_hidden: z.boolean().optional(),
  is_pinned: z.boolean().optional(),
});

/**
 * Generic CRUD resources exposed by the admin API.
 * `revalidate` lists the cache tags the website must refresh after a change.
 */
export const RESOURCES = {
  "menu-categories": { table: "menu_categories", schema: menuCategorySchema, order: "sort_order", revalidate: ["menu"] },
  "menu-items": { table: "menu_items", schema: menuItemSchema, order: "sort_order", revalidate: ["menu"] },
  events: { table: "events", schema: eventSchema, order: "starts_at", revalidate: ["events"] },
  posts: { table: "posts", schema: postSchema, order: "created_at", revalidate: ["posts"] },
  gallery: { table: "gallery_images", schema: gallerySchema, order: "sort_order", revalidate: ["gallery"] },
  testimonials: { table: "testimonials", schema: testimonialSchema, order: "sort_order", revalidate: ["testimonials"] },
  faqs: { table: "faqs", schema: faqSchema, order: "sort_order", revalidate: ["faqs"] },
  pages: { table: "pages", schema: pageSchema, order: "slug", revalidate: ["pages"] },
} as const;
export type ResourceName = keyof typeof RESOURCES;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
