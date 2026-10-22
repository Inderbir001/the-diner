import type { GeneralSettings, HomeSettings, Testimonial } from "@diner/shared";

/** One restrained strip: two offers, the Google rating, review count and cost for two. */
export function Offers({ home, general, review }: { home: HomeSettings; general: GeneralSettings; review?: Testimonial }) {
  const stat = (re: RegExp) => home.stats.find((s) => re.test(s.label));
  const items = [
    ...home.deals.slice(0, 2).map((d) => ({ value: d.price, label: d.title, note: d.note, accent: true })),
    stat(/rating/i) && { value: stat(/rating/i)!.value, label: "Google rating", note: "", accent: false },
    stat(/review/i) && { value: stat(/review/i)!.value, label: "Google reviews", note: "", accent: false },
    general.costForTwo && { value: `≈${general.costForTwo}`, label: "For two", note: "Food and drinks", accent: false },
  ].filter(Boolean) as { value: string; label: string; note: string; accent: boolean }[];

  return (
    <section aria-labelledby="offers-title" className="bg-ivory py-16 text-charcoal sm:py-20">
      <div className="container-x">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-chilli">Offers and reviews</p>
            <h2 id="offers-title" className="mt-2 text-4xl sm:text-5xl">{home.dealsTitle || "Good food, fair prices."}</h2>
          </div>
          {home.dealsIntro && <p className="text-stone lg:col-span-5">{home.dealsIntro}</p>}
        </div>

        <dl className="mt-10 grid grid-cols-2 overflow-hidden rounded-[16px] border border-charcoal/10 bg-white/55 md:grid-cols-5">
          {items.map((it, i) => (
            <div
              key={it.label}
              className={`p-5 sm:p-6 ${i % 2 === 1 ? "border-l border-charcoal/10" : ""} ${i >= 2 ? "border-t border-charcoal/10 md:border-t-0" : ""} md:border-l md:first:border-l-0`}
            >
              <dt className="sr-only">{it.label}</dt>
              <dd>
                <span className={`block font-display text-4xl leading-none ${it.accent ? "text-chilli" : "text-charcoal"}`}>{it.value}</span>
                <span className="mt-2 block text-sm font-semibold">{it.label}</span>
                {it.note && <span className="block text-sm text-stone">{it.note}</span>}
              </dd>
            </div>
          ))}
        </dl>

        {review && (
          <figure className="mt-10 max-w-3xl">
            <blockquote className="font-display text-2xl leading-snug sm:text-3xl">“{review.text}”</blockquote>
            <figcaption className="mt-3 text-sm text-stone">
              {review.author}
              {review.source ? ` · ${review.source} review` : ""}
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
