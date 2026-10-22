import type { Metadata } from "next";
import type { DinerEvent, Faq, GeneralSettings, Post, SettingsMap, SocialSettings } from "@diner/shared";
import { SITE_URL } from "./env";
import type { MenuSection } from "./data";

export const absoluteUrl = (path = "/") => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

/** Per-page metadata with canonical URL and Open Graph defaults. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex,
}: {
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: title ?? undefined,
      description,
      url: absoluteUrl(path),
      type,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: "summary_large_image", title: title ?? undefined, description, ...(image ? { images: [image] } : {}) },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

const sameAs = (social: SocialSettings) =>
  [social.instagram, social.youtube, social.facebook, social.zomato, social.swiggy, social.tripadvisor].filter(Boolean);

const DAY_MAP: Record<string, string> = {
  Monday: "Mo", Tuesday: "Tu", Wednesday: "We", Thursday: "Th", Friday: "Fr", Saturday: "Sa", Sunday: "Su",
};

function openingHoursSpecification(general: GeneralSettings) {
  return general.hours
    .filter((h) => !h.closed)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.open,
      closes: h.close,
    }));
}

export function openingHoursText(general: GeneralSettings) {
  return general.hours.filter((h) => !h.closed).map((h) => `${DAY_MAP[h.day] ?? h.day} ${h.open}-${h.close}`);
}

/** Restaurant + BarOrPub entity — the core local-SEO signal. */
export function restaurantJsonLd(settings: Pick<SettingsMap, "general" | "social" | "seo" | "home" | "booking">) {
  const { general, social, seo, home } = settings;
  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "BarOrPub"],
    "@id": `${SITE_URL}/#restaurant`,
    name: general.name,
    alternateName: ["The Diner", "The Diner Whitefield", "Diner Restobar"],
    description: general.description || seo.description,
    url: SITE_URL,
    logo: absoluteUrl("/icon.svg"),
    image: [home.heroImage, seo.ogImage, home.storyImage].filter(Boolean).map((i) => absoluteUrl(i)),
    telephone: general.phones[0],
    email: general.email || undefined,
    priceRange: general.priceRange,
    servesCuisine: general.cuisines,
    acceptsReservations: settings.booking.enabled ? absoluteUrl("/reserve") : "True",
    hasMenu: absoluteUrl("/menu"),
    address: {
      "@type": "PostalAddress",
      streetAddress: general.address.street,
      addressLocality: general.address.city,
      addressRegion: general.address.region,
      postalCode: general.address.postalCode,
      addressCountry: general.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: general.geo.lat, longitude: general.geo.lng },
    hasMap: general.mapUrl || undefined,
    openingHoursSpecification: openingHoursSpecification(general),
    amenityFeature: general.features.map((f) => ({ "@type": "LocationFeatureSpecification", name: f, value: true })),
    sameAs: sameAs(social),
    parentOrganization: general.legalName ? { "@type": "Organization", name: general.legalName } : undefined,
  };
}

export function websiteJsonLd(name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name,
    publisher: { "@id": `${SITE_URL}/#restaurant` },
    inLanguage: "en-IN",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function menuJsonLd(sections: MenuSection[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${SITE_URL}/menu#menu`,
    name: `${name} Menu`,
    url: absoluteUrl("/menu"),
    inLanguage: "en-IN",
    hasMenuSection: sections.map((s) => ({
      "@type": "MenuSection",
      name: s.name,
      description: s.description ?? undefined,
      hasMenuItem: s.items.map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        description: i.description ?? undefined,
        image: i.image_url ? absoluteUrl(i.image_url) : undefined,
        suitableForDiet: i.is_veg ? "https://schema.org/VegetarianDiet" : undefined,
        offers:
          i.price !== null
            ? { "@type": "Offer", price: i.price, priceCurrency: "INR", availability: i.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }
            : undefined,
      })),
    })),
  };
}

export function eventJsonLd(event: DinerEvent, general: GeneralSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary ?? event.body ?? undefined,
    image: event.image_url ? [absoluteUrl(event.image_url)] : undefined,
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: absoluteUrl(`/events/${event.slug}`),
    location: {
      "@type": "Place",
      name: general.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: general.address.street,
        addressLocality: general.address.city,
        addressRegion: general.address.region,
        postalCode: general.address.postalCode,
        addressCountry: general.address.country,
      },
    },
    organizer: { "@type": "Organization", name: general.name, url: SITE_URL },
    offers: { "@type": "Offer", price: 0, priceCurrency: "INR", availability: "https://schema.org/InStock", url: absoluteUrl("/reserve") },
  };
}

export function articleJsonLd(post: Post, siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    image: post.cover_image ? [absoluteUrl(post.cover_image)] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author || siteName },
    publisher: { "@id": `${SITE_URL}/#restaurant` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
  };
}
