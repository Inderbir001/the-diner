import Image from "next/image";
import type { HomeSettings } from "@diner/shared";
import { Reveal, SplitWords } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";

export function Story({ home }: { home: HomeSettings }) {
  return (
    <section className="bg-paper py-24 text-ink sm:py-32" aria-label="Our story">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        {home.storyImage && (
          <Reveal className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
              <Image src={home.storyImage} alt="Guests at The Diner" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-3 rotate-[-4deg] animate-[bob_3.5s_ease-in-out_infinite] rounded-2xl bg-brass px-6 py-4 text-cream shadow-2xl sm:-right-8">
              <p className="font-display text-3xl leading-none">Pet friendly</p>
              <p className="text-xs font-bold uppercase tracking-widest">Bring the dog</p>
            </div>
          </Reveal>
        )}
        <div className="lg:col-span-7">
          <Reveal y={12}>
            <p className="eyebrow mb-4">
              <span className="h-[3px] w-8 bg-brass" aria-hidden />
              Our story
            </p>
          </Reveal>
          <SplitWords text={home.storyTitle} className="font-display text-5xl leading-[0.88] text-ink sm:text-7xl lg:text-8xl" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-base font-medium sm:mt-8 sm:text-lg leading-relaxed text-ink/75">{home.storyBody}</p>
          </Reveal>
          {home.stats.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {home.stats.map((s, i) => (
                <Reveal key={s.label} delay={0.08 * i} className="rounded-2xl bg-ink p-5 text-cream">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl leading-none text-brass sm:text-5xl"><CountUp value={s.value} /></span>
                    <span className="mt-2 block text-[0.7rem] font-bold uppercase tracking-widest text-sand">{s.label}</span>
                  </dd>
                </Reveal>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
