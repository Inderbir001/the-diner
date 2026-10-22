import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="font-display text-[1.65rem] italic tracking-tight" style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}>
        The Diner
      </span>
      <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.5em] text-brass">Restobar</span>
    </span>
  );
}
