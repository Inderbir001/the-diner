import Image from "next/image";
import Link from "next/link";
import { SplitWords, Reveal } from "@/components/motion/reveal";

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
      <div className="relative overflow-hidden rounded-[36px] border border-white/10 px-6 py-20 text-center sm:px-16 sm:py-28">
        {image && <Image src={image} alt="" fill sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-ink/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgb(232_71_62/0.35),transparent_60%)]" />
        <div className="relative">
          <SplitWords text={title} className="mx-auto max-w-3xl font-display text-5xl leading-none tracking-tight sm:text-7xl" />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-md text-lg text-sand">{text}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href={primary.href} className="btn-primary !px-8 !py-4">
                {primary.label}
              </Link>
              {secondary && (
                <Link href={secondary.href} className="btn-ghost !px-8 !py-4">
                  {secondary.label}
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
