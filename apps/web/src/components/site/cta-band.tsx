import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SplitWords, Reveal } from "@/components/motion/reveal";
import { GrillMark } from "./logo";

/** Big red call-to-action block with a framed photo. */
export function CtaBand({
  title = "Your table's waiting.",
  text = "Book in under a minute. Walk-ins welcome too.",
  image,
  primary = { href: "/reserve", label: "Book a table" },
  secondary = { href: "/private-parties", label: "Plan a party" },
}: {
  title?: string;
  text?: string;
  image?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
}) {
  return (
    <section className="container-x py-16" aria-label="Reserve">
      <div className="relative grid overflow-hidden rounded-[36px] bg-brass text-cream lg:grid-cols-2">
        <GrillMark className="pointer-events-none absolute -right-16 -top-16 size-80 text-ink/10" />
        <div className="relative p-8 sm:p-14 lg:py-20">
          <SplitWords text={title} className="font-display text-5xl leading-[0.88] sm:text-8xl" />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg font-semibold text-cream/90">{text}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={primary.href} className="btn-dark !px-8 !py-4 text-base">
                {primary.label} <ArrowRight className="size-4" />
              </Link>
              {secondary && (
                <Link href={secondary.href} className="btn !border-2 !border-cream/60 !px-8 !py-4 text-base text-cream hover:!bg-cream hover:!text-brass">
                  {secondary.label}
                </Link>
              )}
            </div>
          </Reveal>
        </div>
        {image && (
          <div className="relative min-h-[280px] lg:min-h-full">
            <Image src={image} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
