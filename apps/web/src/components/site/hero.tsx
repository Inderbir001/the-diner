"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, MapPin, Star } from "lucide-react";
import type { GeneralSettings, HomeSettings } from "@diner/shared";
import { OpenStatus } from "./open-status";
import { GrillMark } from "./logo";

const EASE = [0.16, 1, 0.3, 1] as const;

/** "Rooftop|Restobar|Whitefield" → one headline line per segment; every second line in red. */
function headlineLines(title: string) {
  const parts = title.includes("|") ? title.split("|") : title.split(/(?<=[.,!?])\s+/);
  return parts.map((p) => p.trim()).filter(Boolean);
}

export function Hero({ home, general, bookingEnabled }: { home: HomeSettings; general: GeneralSettings; bookingEnabled: boolean }) {
  const reduce = useReducedMotion();
  const lines = headlineLines(home.heroTitle || general.name);
  const side = home.heroSideImages.filter(Boolean).slice(0, 2);
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } };

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pb-24 pt-32 sm:pt-36 lg:block lg:min-h-0 lg:pb-16">
      {/* the headline is capped by screen height too, so the whole hero fits a laptop screen at 100% */}
      {/* phones and tablets: the rooftop photo fills the first screen behind the text */}
      {home.heroImage && (
        <div className="absolute inset-0 lg:hidden" aria-hidden>
          <Image src={home.heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/45 to-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgb(239_62_54/0.35),transparent_60%)]" />
        </div>
      )}
      {/* red glow + oversized grill mark for depth */}
      <div className="pointer-events-none absolute -right-40 -top-40 hidden size-[640px] rounded-full bg-brass/25 blur-[140px] lg:block" aria-hidden />
      <GrillMark className="pointer-events-none absolute -bottom-24 -left-24 hidden size-[420px] text-white/[0.03] lg:block" />

      <div className="container-x relative grid gap-12 text-center lg:grid-cols-12 lg:items-center lg:text-left">
        <div className="lg:col-span-7">
          <motion.div {...rise(0.05)} className="mb-6 flex flex-wrap items-center justify-center gap-2.5 lg:mb-5 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-wider text-sand">
              <MapPin className="size-3.5 text-brass" /> {home.heroEyebrow || general.address.locality}
            </span>
            <OpenStatus hours={general.hours} />
          </motion.div>

          <h1 className="font-display text-[clamp(4.4rem,19vw,8rem)] leading-[0.84] tracking-[0.005em] drop-shadow-[0_4px_24px_rgb(0_0_0/0.5)] lg:text-[clamp(3.6rem,min(12.5vw,13.5svh),11.5rem)] lg:drop-shadow-none">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={i % 2 === 1 ? "block text-brass" : "block"}
                  initial={reduce ? false : { y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p {...rise(0.45)} className="mx-auto mt-5 max-w-md text-base font-medium leading-relaxed text-cream/85 sm:max-w-xl sm:text-xl lg:mx-0 lg:mt-6 lg:text-lg lg:text-sand xl:text-xl">
            {home.heroSubtitle}
          </motion.p>

          <motion.div {...rise(0.55)} className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
            {bookingEnabled && (
              <Link href="/reserve" className="btn-primary !px-4 !py-3.5 text-sm sm:!px-8 sm:!py-4 sm:text-base">
                Book a table <ArrowRight className="size-4" />
              </Link>
            )}
            <Link href="/menu" className="btn-ghost !px-4 !py-3.5 text-sm backdrop-blur sm:!px-8 sm:!py-4 sm:text-base">
              See the menu
            </Link>
            <span className="col-span-2 mt-1 flex items-center justify-center gap-1.5 text-sm font-bold text-cream sm:ml-1 sm:mt-0">
              <Star className="size-4 fill-ember text-ember" /> 4.4 on Google
            </span>
          </motion.div>
        </div>

        <motion.div
          className="relative hidden lg:col-span-5 lg:ml-auto lg:block lg:w-full lg:max-w-[60svh]"
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
        >
          <div className="grid grid-cols-2 gap-3">
            {home.heroImage && (
              <div className="relative col-span-2 aspect-[16/11] overflow-hidden rounded-[28px] ring-1 ring-white/10">
                <Image src={home.heroImage} alt={`${general.name} rooftop`} fill sizes="100vw" className="object-cover" /> {/* same sizes as the phone backdrop, so its preload is reused */}
              </div>
            )}
            {side.map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-[28px] ring-1 ring-white/10">
                <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
              </div>
            ))}
          </div>
          {/* spinning stamp */}
          <div className="absolute -left-6 top-[38%] hidden size-32 sm:block lg:-left-12">
            <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow" aria-hidden>
              <defs>
                <path id="stamp-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
              </defs>
              <circle cx="50" cy="50" r="49" className="fill-brass" />
              <text className="fill-cream font-display text-[11.5px] tracking-[0.18em]">
                <textPath href="#stamp-circle">OPEN TILL 12:30 AM • ROOFTOP •</textPath>
              </text>
            </svg>
            <GrillMark className="absolute inset-[34%] text-cream" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
