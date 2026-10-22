import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { GrillMark } from "./logo";

/** Red call-to-action block with a photo. */
export function CtaBand({
  title = "Your table's waiting",
  text = "Book in under a minute. Walk-ins are always welcome too.",
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
    <section className="container-x py-12 sm:py-16" aria-label="Reserve">
      <Reveal className="relative grid overflow-hidden rounded-[32px] bg-brass text-snow shadow-lift lg:grid-cols-2">
        <GrillMark className="pointer-events-none absolute -bottom-10 left-1/3 size-72 text-night/10" />
        <div className="relative p-8 sm:p-12 lg:py-16">
          <h2 className="text-4xl text-snow sm:text-5xl">{title}</h2>
          <p className="mt-4 max-w-md text-lg text-snow/85">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primary.href} className="btn-dark !px-7 !py-4 text-base">
              {primary.label} <ArrowRight className="size-4" />
            </Link>
            {secondary && (
              <Link href={secondary.href} className="btn border-2 border-snow/50 !px-7 !py-4 text-base text-snow hover:bg-snow hover:text-brass">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
        {image && (
          <div className="relative min-h-[260px]">
            <Image src={image} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
      </Reveal>
    </section>
  );
}
