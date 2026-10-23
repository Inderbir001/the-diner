import Image from "next/image";
import Link from "next/link";
import { Reveal, SplitWords } from "@/components/motion/reveal";

/** Header block for inner pages, with visible breadcrumbs (matching the BreadcrumbList JSON-LD). */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string | null;
  image?: string | null;
  crumbs?: { name: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 sm:pb-20 sm:pt-44">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[560px] rounded-full bg-brass/20 blur-[140px]" aria-hidden />
      <div className={image ? "container-x relative grid gap-10 lg:grid-cols-12 lg:items-end" : "container-x relative"}>
        <div className={image ? "lg:col-span-7" : undefined}>
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <li>
                <Link href="/" className="hover:text-cream">Home</Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-cream">{c.name}</Link>
                  ) : (
                    <span aria-current="page" className="text-sand">{c.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <Reveal y={12}>
            <p className="eyebrow mb-5">
              <span className="h-[3px] w-8 bg-brass" aria-hidden />
              {eyebrow}
            </p>
          </Reveal>
        )}
        <SplitWords
          as="h1"
          immediate
          text={title}
          className="max-w-5xl font-display text-[clamp(3.2rem,10vw,9rem)] leading-[0.86]"
        />
        {intro && (
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-sand">{intro}</p>
          </Reveal>
        )}
        {children}
        </div>
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] ring-1 ring-white/10 lg:col-span-5">
            <Image src={image} alt="" fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
