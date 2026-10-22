import type { BookingStatus } from "./schemas";

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  kind: "food" | "drinks";
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_note: string | null;
  image_url: string | null;
  is_veg: boolean;
  is_spicy: boolean;
  is_signature: boolean;
  is_available: boolean;
  tags: string[];
  sort_order: number;
}

export interface Booking {
  id: string;
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  party_size: number;
  booking_date: string;
  booking_time: string;
  area: string | null;
  occasion: string | null;
  notes: string | null;
  status: BookingStatus;
  source: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  type: "general" | "party" | "corporate" | "feedback";
  name: string;
  phone: string | null;
  email: string | null;
  event_date: string | null;
  guests: number | null;
  message: string;
  status: "new" | "in_progress" | "closed";
  created_at: string;
}

export interface DinerEvent {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  image_url: string | null;
  starts_at: string;
  ends_at: string | null;
  is_recurring: boolean;
  recurrence_label: string | null;
  price_label: string | null;
  cta_label: string | null;
  cta_url: string | null;
  is_featured: boolean;
  is_published: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  cover_alt: string | null;
  tags: string[];
  author: string;
  status: "draft" | "published";
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  category: string;
  sort_order: number;
  is_published: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating: number;
  source: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  seo_description: string | null;
  is_published: boolean;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  platform: "instagram" | "youtube";
  external_id: string;
  media_type: string;
  caption: string | null;
  permalink: string;
  media_url: string | null;
  thumbnail_url: string | null;
  published_at: string;
  is_hidden: boolean;
  is_pinned: boolean;
}

export interface IntegrationStatus {
  platform: "instagram" | "youtube";
  connected: boolean;
  account_id: string | null;
  account_name: string | null;
  token_expires_at: string | null;
  last_synced_at: string | null;
  last_error: string | null;
}
