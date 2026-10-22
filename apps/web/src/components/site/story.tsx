import Image from "next/image";
import { PawPrint } from "lucide-react";
import type { HomeSettings } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";

export function Story({ home }: { home: HomeSettings }) {
  return (
    <section className="py-20 sm:py-28" aria-label="Our story">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {home.storyImage && (
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] shadow-lift sm:aspect-[5/5]">
              <Image src={home.storyImage} alt="Guests at The Diner" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 right-4 flex items-center gap-3 rounded-2xl bg-coal px-5 py-4 shadow-lift">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-brass text-snow">
                <PawPrint className="size-5" />
              </span>
              <span>
                <span className="block font-display font-bold leading-tight">Pet friendly</span>
                <span className="block text-sm text-muted">Bring the dog along</span>
              </span>
            </div>
          </Reveal>
        )}
        <Reveal>
          <p className="eyebrow mb-3">Our story</p>
          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem]">{home.storyTitle}</h2>
          <p className="mt-6 text-lg leading-relaxed text-sand">{home.storyBody}</p>
          {home.stats.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {home.stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-coal p-4 shadow-card">
                  <dt className="text-xs font-semibold text-muted">{s.label}</dt>
                  <dd className="mt-1 font-display text-3xl font-bold text-brass">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
      </div>
    </section>
  );
}
