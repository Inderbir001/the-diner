import { Star } from "lucide-react";
import type { Testimonial } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";

export function Testimonials({ items, reviewsUrl }: { items: Testimonial[]; reviewsUrl?: string }) {
  if (!items.length) return null;
  return (
    <section className="container-x py-24 sm:py-32" aria-label="Guest reviews">
      <SectionHeading eyebrow="Guest notes" title="What the regulars say." align="center" />
      <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((t, i) => (
          <Reveal key={t.id} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
            <figure className="glass rounded-[24px] p-7">
              <div className="flex gap-0.5 text-brass" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-xl leading-snug">“{t.text}”</blockquote>
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
