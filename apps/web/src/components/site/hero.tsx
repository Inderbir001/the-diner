"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, MapPin, Star } from "lucide-react";
import type { GeneralSettings, HomeSettings } from "@diner/shared";
import { to12h } from "@/lib/utils";
import { OpenStatus } from "./open-status";

const EASE = [0.16, 1, 0.3, 1] as const;

/** "Great food. Fair prices.|Rooftop vibes." — the part after | is shown in brand red. */
function headline(title: string) {
  const [first, ...rest] = title.split("|");
  return { first: first.trim(), accent: rest.join(" ").trim() };
}

export function Hero({
  home,
  general,
  bookingEnabled,
  startersFrom,
}: {
  home: HomeSettings;
  general: GeneralSettings;
  bookingEnabled: boolean;
  startersFrom?: number | null;
}) {
  const reduce = useReducedMotion();
  const { first, accent } = headline(home.heroTitle || general.name);
  const side = home.heroSideImages.filter(Boolean)[0];
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: EASE } };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-48 -top-48 size-[620px] rounded-full bg-brass/10 blur-[120px]" aria-hidden />
      <div className="container-x relative grid gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
        <div>
          <motion.div {...rise(0)} className="mb-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coal px-3.5 py-1.5 text-sm font-semibold text-sand shadow-card">
              <MapPin className="size-4 text-brass" /> {home.heroEyebrow || general.address.locality}
            </span>
            <OpenStatus hours={general.hours} />
          </motion.div>

          <motion.h1 {...rise(0.05)} className="text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem]">
            {first} {accent && <span className="text-brass">{accent}</span>}
          </motion.h1>

          <motion.p {...rise(0.12)} className="mt-6 max-w-xl text-lg leading-relaxed text-sand sm:text-xl">
            {home.heroSubtitle}
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="btn-primary !px-7 !py-4 text-base">
              Explore the menu <ArrowRight className="size-4" />
            </Link>
            {bookingEnabled && (
              <Link href="/reserve" className="btn-ghost !px-7 !py-4 text-base">
                Book a table
              </Link>
            )}
          </motion.div>

          <motion.dl {...rise(0.24)} className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-black/10 rounded-2xl bg-coal py-4 shadow-card">
            <div className="px-4">
              <dt className="text-xs font-semibold text-muted">Cost for two</dt>
              <dd className="mt-1 font-display text-2xl font-bold">{general.costForTwo || "₹1,000"}</dd>
            </div>
            <div className="px-4">
              <dt className="text-xs font-semibold text-muted">Starters from</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-brass">₹{startersFrom ?? 199}</dd>
            </div>
            <div className="px-4">
              <dt className="text-xs font-semibold text-muted">Google rating</dt>
              <dd className="mt-1 flex items-center gap-1 font-display text-2xl font-bold">
                4.4 <Star className="size-4 fill-ember text-ember" />
              </dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        >
          {home.heroImage && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] shadow-lift">
              <Image src={home.heroImage} alt={`${general.name} rooftop`} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          )}
          {side && (
            <div className="absolute -bottom-8 -left-4 hidden aspect-square w-[38%] overflow-hidden rounded-[24px] border-[6px] border-ink shadow-lift sm:block lg:-left-10">
              <Image src={side} alt="" fill sizes="240px" className="object-cover" />
            </div>
          )}
          <div className="absolute -right-2 -top-5 rotate-3 rounded-2xl bg-brass px-5 py-3 text-snow shadow-lift sm:-right-5">
            <p className="text-xs font-semibold opacity-90">Open daily till</p>
            <p className="font-display text-2xl font-bold leading-none">{general.hours[0] ? to12h(general.hours[0].close) : "Late"}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
