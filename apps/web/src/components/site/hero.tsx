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
    <section className="relative overflow-hidden bg-ink pb-16 pt-32 sm:pt-36 lg:pb-24">
      {/* red glow + oversized grill mark for depth */}
      <div className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-brass/25 blur-[140px]" aria-hidden />
      <GrillMark className="pointer-events-none absolute -bottom-24 -left-24 size-[420px] text-white/[0.03]" />

      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <motion.div {...rise(0.05)} className="mb-7 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-wider text-sand">
              <MapPin className="size-3.5 text-brass" /> {home.heroEyebrow || general.address.locality}
            </span>
            <OpenStatus hours={general.hours} />
          </motion.div>

          <h1 className="font-display text-[clamp(4.2rem,12.5vw,11.5rem)] leading-[0.84] tracking-[0.005em]">
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

          <motion.p {...rise(0.45)} className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-sand sm:text-xl">
            {home.heroSubtitle}
          </motion.p>

          <motion.div {...rise(0.55)} className="mt-9 flex flex-wrap items-center gap-3">
            {bookingEnabled && (
              <Link href="/reserve" className="btn-primary !px-8 !py-4 text-base">
                Book a table <ArrowRight className="size-4" />
              </Link>
            )}
            <Link href="/menu" className="btn-ghost !px-8 !py-4 text-base">
              See the menu
            </Link>
            <span className="ml-1 flex items-center gap-1.5 text-sm font-bold text-cream">
              <Star className="size-4 fill-ember text-ember" /> 4.4 on Google
            </span>
          </motion.div>
        </div>

        <motion.div
          className="relative lg:col-span-5"
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
        >
          <div className="grid grid-cols-2 gap-3">
            {home.heroImage && (
              <div className="relative col-span-2 aspect-[16/11] overflow-hidden rounded-[28px] ring-1 ring-white/10">
                <Image src={home.heroImage} alt={`${general.name} rooftop`} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              </div>
            )}
            {side.map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-[28px] ring-1 ring-white/10">
                <Image src={src} alt="" fill priority={i === 0} sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
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
