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
    <section className="relative overflow-hidden pb-16 pt-40 sm:pb-20 sm:pt-48">
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
        </>
      )}
      <div className="absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brass/10 blur-[120px]" aria-hidden />
      <div className="container-x relative">
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
            <p className="eyebrow mb-5">{eyebrow}</p>
          </Reveal>
        )}
        <SplitWords
          as="h1"
          immediate
          text={title}
          className="max-w-5xl font-display text-[clamp(2.75rem,7vw,6.5rem)] font-light leading-[0.95] tracking-[-0.03em]"
        />
        {intro && (
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-sand">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
