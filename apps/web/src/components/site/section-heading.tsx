import { SplitWords, Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  className,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  /** "light" for sections on a paper or red background */
  tone?: "dark" | "light" | "red";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal y={12}>
          <p className={cn("eyebrow mb-4", tone === "red" && "text-ink")}>
            <span className={cn("h-[3px] w-8 bg-brass", tone === "red" && "bg-ink")} aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <SplitWords
        as={as}
        text={title}
        className={cn("font-display text-6xl leading-[0.88] sm:text-7xl lg:text-8xl", tone === "light" ? "text-ink" : "text-cream")}
      />
      {intro && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-6 max-w-xl text-lg font-medium leading-relaxed",
              tone === "light" ? "text-ink/70" : tone === "red" ? "text-cream/90" : "text-sand",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
