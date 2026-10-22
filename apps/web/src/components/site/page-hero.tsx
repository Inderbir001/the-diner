import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SplitWords } from "@/components/motion/reveal";

/** Compact header block for inner pages, with visible breadcrumbs (matching the BreadcrumbList JSON-LD). */
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
    <section className="relative overflow-hidden pb-10 pt-8 sm:pb-14 sm:pt-12">
      
      <div className={image ? "container-x relative grid gap-10 lg:grid-cols-12 lg:items-center" : "container-x relative"}>
        <div className={image ? "lg:col-span-7" : undefined}>
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
                <li>
                  <Link href="/" className="hover:text-cream">Home</Link>
                </li>
                {crumbs.map((c) => (
                  <li key={c.name} className="flex items-center gap-1">
                    <ChevronRight className="size-3.5" aria-hidden />
                    {c.href ? (
                      <Link href={c.href} className="hover:text-cream">{c.name}</Link>
                    ) : (
                      <span aria-current="page" className="font-semibold text-sand">{c.name}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <SplitWords as="h1" text={title} className="max-w-4xl text-[2.6rem] sm:text-6xl lg:text-[4rem]" />
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sand">{intro}</p>}
          {children}
        </div>
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-lift lg:col-span-5">
            <Image src={image} alt="" fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
