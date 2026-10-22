import { getEvents, getGallery, getSettings, getSignatureDishes, getSocialPosts, getTestimonials } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { Hero } from "@/components/site/hero";
import { Tonight } from "@/components/site/tonight";
import { SignatureDishes } from "@/components/site/signature-dishes";
import { Rooftop } from "@/components/site/rooftop";
import { Offers } from "@/components/site/offers";
import { GalleryReserve } from "@/components/site/gallery-reserve";

export const revalidate = 3600;

export const metadata = { alternates: { canonical: SITE_URL } };

export default async function HomePage() {
  const [settings, dishes, events, testimonials, instagram, gallery] = await Promise.all([
    getSettings(),
    getSignatureDishes(),
    getEvents(),
    getTestimonials(),
    getSocialPosts("instagram", 8),
    getGallery(),
  ]);
  const { home, general, social, booking, announcement } = settings;

  const ctaImage = (gallery.find((g) => /team|party|celebrat/i.test(g.alt)) ?? gallery[0])?.url ?? home.heroImage;
  const used = new Set([home.heroImage, home.storyImage, ctaImage]);
  // latest Instagram posts once the account is connected; otherwise our own gallery, people first, no repeats
  const synced = instagram.filter((p) => p.thumbnail_url);
  const photos =
    synced.length >= 5
      ? synced.map((p) => ({ url: p.thumbnail_url!, alt: p.caption?.slice(0, 120) || "Instagram post from The Diner" }))
      : [...gallery.filter((g) => g.category !== "food"), ...gallery.filter((g) => g.category === "food")]
          .filter((g) => !used.has(g.url))
          .map((g) => ({ url: g.url, alt: g.alt }));

  return (
    <>
      <Hero home={home} general={general} bookingEnabled={booking.enabled} />
      <Tonight events={events} general={general} announcement={announcement} bookingEnabled={booking.enabled} />
      <SignatureDishes dishes={dishes} />
      <Rooftop home={home} />
      <Offers home={home} general={general} review={testimonials[0]} />
      <GalleryReserve photos={photos} social={social} general={general} bookingEnabled={booking.enabled} ctaImage={ctaImage} />
    </>
  );
}
