import { z } from "zod";

const time = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM (24h)");
const url = z.string().trim().max(2000);

export const hoursSchema = z.object({
  day: z.string(),
  open: time,
  close: time,
  closed: z.boolean().default(false),
});

export const generalSettingsSchema = z.object({
  name: z.string().min(1).default("The Diner Restobar"),
  legalName: z.string().default(""),
  tagline: z.string().default(""),
  description: z.string().default(""),
  phones: z.array(z.string()).default([]),
  whatsapp: z.string().default(""),
  email: z.string().default(""),
  address: z
    .object({
      street: z.string().default(""),
      locality: z.string().default(""),
      city: z.string().default("Bengaluru"),
      region: z.string().default("Karnataka"),
      postalCode: z.string().default(""),
      country: z.string().default("IN"),
    })
    .default({ street: "", locality: "", city: "Bengaluru", region: "Karnataka", postalCode: "", country: "IN" }),
  landmark: z.string().default(""),
  geo: z.object({ lat: z.number(), lng: z.number() }).default({ lat: 12.9858, lng: 77.7296 }),
  mapUrl: url.default(""),
  mapEmbedUrl: url.default(""),
  priceRange: z.string().default("₹₹"),
  costForTwo: z.string().default(""),
  cuisines: z.array(z.string()).default([]),
  hours: z.array(hoursSchema).default([]),
  hoursNote: z.string().default(""),
  features: z.array(z.string()).default([]),
});

export const socialSettingsSchema = z.object({
  instagram: url.default(""),
  instagramHandle: z.string().default(""),
  youtube: url.default(""),
  youtubeChannelId: z.string().default(""),
  facebook: url.default(""),
  zomato: url.default(""),
  swiggy: url.default(""),
  googleReviews: url.default(""),
  tripadvisor: url.default(""),
});

export const seoSettingsSchema = z.object({
  defaultTitle: z.string().default("The Diner Restobar"),
  titleTemplate: z.string().default("%s | The Diner Restobar"),
  description: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  ogImage: url.default(""),
  googleSiteVerification: z.string().default(""),
  gaMeasurementId: z.string().default(""),
});

const experienceSchema = z.object({ title: z.string(), description: z.string(), image: url });
const statSchema = z.object({ value: z.string(), label: z.string() });
const packageSchema = z.object({ name: z.string(), price: z.string(), description: z.string() });

export const homeSettingsSchema = z.object({
  heroEyebrow: z.string().default(""),
  heroTitle: z.string().default(""),
  heroSubtitle: z.string().default(""),
  heroImage: url.default(""),
  heroVideo: url.default(""),
  /** smaller photos shown beside the headline */
  heroSideImages: z.array(url).default([]),
  storyTitle: z.string().default(""),
  storyBody: z.string().default(""),
  storyImage: url.default(""),
  stats: z.array(statSchema).default([]),
  marquee: z.array(z.string()).default([]),
  experiences: z.array(experienceSchema).default([]),
  partyPackages: z.array(packageSchema).default([]),
});

export const bookingSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  slotMinutes: z.number().int().min(15).max(120).default(30),
  firstSeating: time.default("12:00"),
  lastSeating: time.default("23:30"),
  capacityPerSlot: z.number().int().min(1).default(60),
  maxPartySize: z.number().int().min(1).default(20),
  minNoticeMinutes: z.number().int().min(0).default(60),
  maxDaysAhead: z.number().int().min(1).max(365).default(60),
  areas: z.array(z.string()).default(["Indoor", "Rooftop"]),
  occasions: z.array(z.string()).default([]),
  blackoutDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).default([]),
  autoConfirm: z.boolean().default(false),
  policyNote: z.string().default(""),
});

export const notificationSettingsSchema = z.object({
  bookingEmails: z.array(z.string()).default([]),
  enquiryEmails: z.array(z.string()).default([]),
  sendGuestConfirmation: z.boolean().default(true),
});

export const announcementSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  text: z.string().default(""),
  linkLabel: z.string().default(""),
  linkUrl: z.string().default(""),
});

export const settingsSchemas = {
  general: generalSettingsSchema,
  social: socialSettingsSchema,
  seo: seoSettingsSchema,
  home: homeSettingsSchema,
  booking: bookingSettingsSchema,
  notifications: notificationSettingsSchema,
  announcement: announcementSettingsSchema,
} as const;

export type SettingsKey = keyof typeof settingsSchemas;
export const SETTINGS_KEYS = Object.keys(settingsSchemas) as SettingsKey[];
/** Settings sections the anon key may read (mirrors the RLS policy). */
export const PUBLIC_SETTINGS_KEYS = ["general", "social", "seo", "home", "booking", "announcement"] as const;

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type SocialSettings = z.infer<typeof socialSettingsSchema>;
export type SeoSettings = z.infer<typeof seoSettingsSchema>;
export type HomeSettings = z.infer<typeof homeSettingsSchema>;
export type BookingSettings = z.infer<typeof bookingSettingsSchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type AnnouncementSettings = z.infer<typeof announcementSettingsSchema>;

export type SettingsMap = {
  [K in SettingsKey]: z.infer<(typeof settingsSchemas)[K]>;
};

/** Parse a raw settings value, filling defaults for anything missing or malformed. */
export function parseSettings<K extends SettingsKey>(key: K, value: unknown): SettingsMap[K] {
  const schema = settingsSchemas[key];
  const result = schema.safeParse(value ?? {});
  if (result.success) return result.data as SettingsMap[K];
  return schema.parse({}) as SettingsMap[K];
}
