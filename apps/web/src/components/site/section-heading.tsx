import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "default",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  /** "dark" for sections on a night background */
  tone?: "default" | "dark" | "light" | "red";
  className?: string;
  as?: "h1" | "h2";
}) {
  const onDark = tone === "dark" || tone === "red";
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow mb-3", tone === "red" && "!text-snow/80")}>{eyebrow}</p>}
      <Tag className="text-4xl text-cream sm:text-5xl lg:text-[3.5rem]">{title}</Tag>
      {intro && (
        <p className={cn("mt-5 max-w-2xl text-lg leading-relaxed", onDark ? "text-snow/75" : "text-sand", align === "center" && "mx-auto")}>{intro}</p>
      )}
    </Reveal>
  );
}
