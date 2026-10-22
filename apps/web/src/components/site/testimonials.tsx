import { Star } from "lucide-react";
import type { Testimonial } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";

export function Testimonials({ items, reviewsUrl }: { items: Testimonial[]; reviewsUrl?: string }) {
  if (!items.length) return null;
  return (
    <section className="container-x py-24 sm:py-32" aria-label="Guest reviews">
      <SectionHeading eyebrow="Guest notes" title="What the regulars say." align="center" />
      <div className="mt-14 mx-auto max-w-5xl columns-1 gap-5 sm:columns-2">
        {items.map((t, i) => (
          <Reveal key={t.id} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
            <figure className="rounded-[24px] bg-coal p-7 ring-1 ring-black/10">
              <div className="flex gap-0.5 text-brass" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-lg font-semibold leading-relaxed text-cream">“{t.text}”</blockquote>
              <figcaption className="mt-5 text-sm text-muted">
                {t.author}
                {t.source ? ` · ${t.source}` : ""}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      {reviewsUrl && (
        <div className="mt-10 text-center">
          <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Read more reviews on Google ↗
          </a>
        </div>
      )}
    </section>
  );
}
