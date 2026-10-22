import { SplitWords, Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal y={12}>
          <p className="eyebrow mb-5">{eyebrow}</p>
        </Reveal>
      )}
      <SplitWords
        as={as}
        text={title}
        className="font-display text-4xl leading-[1.02] tracking-tight text-cream sm:text-5xl lg:text-6xl"
      />
      {intro && (
        <Reveal delay={0.15}>
          <p className={cn("mt-6 max-w-xl text-lg leading-relaxed text-sand", align === "center" && "mx-auto")}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
