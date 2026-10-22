"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight, MapPin } from "lucide-react";
import type { GeneralSettings, HomeSettings } from "@diner/shared";
import { SplitWords } from "@/components/motion/reveal";
import { OpenStatus } from "./open-status";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ home, general, bookingEnabled }: { home: HomeSettings; general: GeneralSettings; bookingEnabled: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden pb-14 pt-40 sm:pb-20">
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: imgY }}
        initial={reduce ? false : { scale: 1.18 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        {home.heroVideo ? (
          <video
            className="size-full object-cover"
            src={home.heroVideo}
            poster={home.heroImage || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : home.heroImage ? (
          <Image src={home.heroImage} alt="" fill priority sizes="100vw" quality={75} className="object-cover" />
        ) : null}
      </motion.div>
      {/* layered gradients keep text legible on any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_100%,rgb(232_71_62/0.22),transparent_55%)]" />

      <motion.div style={reduce ? undefined : { y: contentY, opacity: fade }} className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-sand">
            <MapPin className="size-3.5 text-brass" />
            {home.heroEyebrow || `${general.address.locality}, ${general.address.city}`}
          </span>
          <OpenStatus hours={general.hours} />
        </motion.div>

        <SplitWords
          as="h1"
          immediate
          delay={0.35}
          text={home.heroTitle || general.name}
          className="max-w-5xl font-display text-[clamp(3rem,9vw,8.5rem)] font-light leading-[0.92] tracking-[-0.03em] text-cream"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE }}
            className="max-w-lg text-lg leading-relaxed text-sand lg:col-span-6"
          >
            {home.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.05, ease: EASE }}
            className="flex flex-wrap gap-3 lg:col-span-6 lg:justify-end"
          >
            {bookingEnabled && (
              <Link href="/reserve" className="btn-primary !px-8 !py-4 text-base">
                Book a table <ArrowDownRight className="size-4 -rotate-90" />
              </Link>
            )}
            <Link href="/menu" className="btn-ghost !px-8 !py-4 text-base">
              See the menu
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
