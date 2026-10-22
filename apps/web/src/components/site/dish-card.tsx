import Image from "next/image";
import { Flame, Sparkles } from "lucide-react";
import type { MenuItem } from "@diner/shared";
import { cn, formatPrice } from "@/lib/utils";

export function VegMark({ veg, className }: { veg: boolean; className?: string }) {
  return (
    <span
      className={cn("inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border-2 bg-coal", veg ? "border-leaf" : "border-brass", className)}
      title={veg ? "Vegetarian" : "Non-vegetarian"}
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span className={cn("size-1.5 rounded-full", veg ? "bg-leaf" : "bg-brass")} />
    </span>
  );
}

/** Photo card used on the menu and the home page. */
export function DishCard({ dish, priority, sizes = "(min-width:1280px) 25vw, (min-width:640px) 45vw, 100vw" }: { dish: MenuItem; priority?: boolean; sizes?: string }) {
  return (
    <article className={cn("group flex h-full flex-col overflow-hidden rounded-2xl bg-coal sm:rounded-3xl shadow-card transition hover:-translate-y-1 hover:shadow-lift", !dish.is_available && "opacity-60")}>
      <div className="relative aspect-[4/3] overflow-hidden bg-smoke">
        {dish.image_url ? (
          <Image src={dish.image_url} alt={dish.name} fill priority={priority} sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : null}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
          {dish.is_signature && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brass px-2 py-0.5 text-[0.65rem] font-bold text-snow shadow sm:px-2.5 sm:py-1 sm:text-[0.7rem]">
              <Sparkles className="size-3" /> Must try
            </span>
          )}
          {dish.is_spicy && (
            <span className="inline-flex items-center gap-1 rounded-full bg-coal/95 px-2 py-0.5 text-[0.65rem] font-bold text-brass shadow sm:px-2.5 sm:py-1 sm:text-[0.7rem]">
              <Flame className="size-3" /> Spicy
            </span>
          )}
        </div>
        {!dish.is_available && (
          <span className="absolute inset-x-0 bottom-0 bg-night/80 py-1.5 text-center text-xs font-bold text-snow">Sold out today</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex items-start gap-2">
          <VegMark veg={dish.is_veg} className="mt-0.5 sm:mt-1" />
          <h3 className="flex-1 text-[0.95rem] font-bold leading-snug sm:text-lg">{dish.name}</h3>
        </div>
        {dish.description && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-sand sm:mt-2 sm:text-sm">{dish.description}</p>}
        <div className="mt-auto flex items-end justify-between pt-3 sm:pt-4">
          {dish.price !== null ? (
            <p className="font-display text-xl font-extrabold tracking-tight text-cream sm:text-2xl">
              {formatPrice(dish.price)}
              {dish.price_note && <span className="ml-1 text-xs font-semibold text-muted">{dish.price_note}</span>}
            </p>
          ) : (
            <p className="text-sm font-semibold text-muted">Ask your server</p>
          )}
        </div>
      </div>
    </article>
  );
}
