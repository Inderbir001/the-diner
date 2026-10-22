import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@diner/shared";
import { formatPrice } from "@/lib/utils";

/** Prefer dishes photographed at the restaurant over stand-in photos. */
function pickFour(dishes: MenuItem[]) {
  const withPhoto = dishes.filter((d) => d.image_url);
  const real = withPhoto.filter((d) => d.image_url!.startsWith("/images/diner/") || d.image_url!.includes("supabase"));
  return [...real, ...withPhoto.filter((d) => !real.includes(d))].slice(0, 4);
}

/** Editorial layout: one large featured dish and three supporting dishes. */
export function SignatureDishes({ dishes }: { dishes: MenuItem[] }) {
  const [featured, ...rest] = pickFour(dishes);
  if (!featured) return null;

  return (
    <section aria-labelledby="dishes-title" className="bg-ivory pb-16 pt-12 text-charcoal sm:pb-20 lg:pb-24 lg:pt-16">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 border-t border-charcoal/10 pt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-chilli">From the kitchen</p>
            <h2 id="dishes-title" className="mt-2 text-4xl sm:text-5xl">Signature dishes</h2>
          </div>
          <Link href="/menu" className="link-underline hidden min-h-11 items-center text-sm font-semibold sm:inline-flex">
            See the full menu →
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Link href="/menu" className="group lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-charcoal">
              <Image
                src={featured.image_url!}
                alt={featured.name}
                fill
                sizes="(min-width:1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-6">
              <h3 className="text-3xl sm:text-4xl">{featured.name}</h3>
              {featured.price !== null && <p className="shrink-0 text-xl font-semibold text-chilli">{formatPrice(featured.price)}</p>}
            </div>
            {featured.description && <p className="mt-2 max-w-xl leading-relaxed text-stone">{featured.description}</p>}
          </Link>

          <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10 lg:col-span-5 lg:self-start">
            {rest.map((d) => (
              <li key={d.id}>
                <Link href="/menu" className="group grid grid-cols-[96px_minmax(0,1fr)] gap-5 py-5 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <span className="relative aspect-square overflow-hidden rounded-[16px] bg-charcoal">
                    <Image src={d.image_url!} alt={d.name} fill sizes="120px" className="object-cover transition-transform duration-200 group-hover:scale-[1.03]" />
                  </span>
                  <span className="min-w-0 self-center">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-xl leading-tight sm:text-2xl">{d.name}</span>
                      {d.price !== null && <span className="shrink-0 font-semibold text-chilli">{formatPrice(d.price)}</span>}
                    </span>
                    {d.description && <span className="mt-1.5 block text-sm leading-relaxed text-stone">{d.description}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/menu" className="btn-outline-dark mt-8 w-full sm:hidden">
          See the full menu
        </Link>
      </div>
    </section>
  );
}
