import type { HomeSettings } from "@diner/shared";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal, SplitWords } from "@/components/motion/reveal";

export function Story({ home }: { home: HomeSettings }) {
  return (
    <section className="container-x py-24 sm:py-32" aria-label="Our story">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6 lg:order-2">
          <Reveal y={12}>
            <p className="eyebrow mb-5">Our story</p>
          </Reveal>
          <SplitWords
            text={home.storyTitle}
            className="font-display text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-8 text-lg leading-relaxed text-sand">
              {home.storyBody}
            </p>
          </Reveal>
          {home.stats.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {home.stats.map((s, i) => (
                <Reveal key={s.label} delay={0.1 + i * 0.08} className="bg-coal p-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl text-brass">{s.value}</span>
                    <span className="mt-1 block text-xs uppercase tracking-widest text-muted">{s.label}</span>
                  </dd>
                </Reveal>
              ))}
            </dl>
          )}
        </div>
        {home.storyImage && (
          <div className="relative lg:col-span-6">
            <ParallaxImage src={home.storyImage} alt="Inside The Diner" className="aspect-[4/5] w-full rounded-[28px]" />
            <div className="glass absolute -bottom-6 -right-2 hidden max-w-[14rem] rounded-2xl p-5 sm:block lg:-right-8">
              <p className="font-display text-xl italic leading-snug">“Come for the biryani, stay for the music.”</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
