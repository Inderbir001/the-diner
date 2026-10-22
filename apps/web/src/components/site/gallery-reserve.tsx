import Image from "next/image";
import Link from "next/link";
import type { GeneralSettings, SocialSettings } from "@diner/shared";
import { cn, telHref } from "@/lib/utils";

type Photo = { url: string; alt: string };

/** Small curated mosaic (latest Instagram posts when synced, otherwise our gallery) and the closing reservation call. */
export function GalleryReserve({
  photos,
  social,
  general,
  bookingEnabled,
}: {
  photos: Photo[];
  social: SocialSettings;
  general: GeneralSettings;
  bookingEnabled: boolean;
}) {
  const five = photos.slice(0, 5);
  return (
    <>
      {five.length >= 3 && (
        <section aria-labelledby="gallery-title" className="bg-charcoal py-16 sm:py-20">
          <div className="container-x">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow">{social.instagramHandle ? `@${social.instagramHandle}` : "Gallery"}</p>
                <h2 id="gallery-title" className="mt-2 text-4xl text-ivory sm:text-5xl">A night at The Diner</h2>
              </div>
              <Link href="/gallery" className="link-underline hidden min-h-11 items-center text-sm font-semibold text-ivory sm:inline-flex">
                Open the gallery →
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
              {five.map((p, i) => (
                <li
                  key={p.url}
                  className={cn("relative overflow-hidden rounded-[16px] bg-charcoal-2", i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-square", i >= 3 && "hidden md:block")}
                >
                  <Image src={p.url} alt={p.alt} fill sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"} className="object-cover" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* no photo here, so nothing repeats from above: a warm chilli glow and fine grain on charcoal */}
      <section aria-labelledby="reserve-title" className="relative isolate overflow-hidden border-t border-ivory/10 bg-charcoal-2">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_120%,rgb(217_75_61/0.28),transparent_60%)]" aria-hidden />
        <div className="grain absolute inset-0 -z-10 opacity-[0.07]" aria-hidden />
        <div className="container-x py-20 text-center sm:py-24">
          <p className="eyebrow">Reservations</p>
          <h2 id="reserve-title" className="mx-auto mt-3 max-w-2xl text-4xl text-ivory sm:text-6xl">
            Save your table for tonight
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-ivory/80">Rooftop or indoor, two guests or twenty. It takes under a minute.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {bookingEnabled && (
              <Link href="/reserve" className="btn-primary w-full !px-10 sm:w-auto">
                Book a table
              </Link>
            )}
            {general.phones[0] && (
              <a href={telHref(general.phones[0])} className="btn-ghost w-full sm:w-auto">
                Call {general.phones[0]}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
