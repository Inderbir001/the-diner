import { BadgePercent, Beer, Clock, UtensilsCrossed } from "lucide-react";
import { getMenu, getSettings } from "@/lib/data";
import { breadcrumbJsonLd, menuJsonLd, pageMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { MenuBrowser } from "@/components/site/menu-browser";
import { JsonLd } from "@/components/site/json-ld";
import { CtaBand } from "@/components/site/cta-band";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Menu & Prices — Andhra, Biryani, Starters, Cocktails & Beer",
  description:
    "The full food and drinks menu with prices at The Diner Restobar, Whitefield: Guntur chicken, Hyderabadi dum biryani, tandoori, momos, pizzas, cocktails, draught beer and pitchers. Starters from ₹199.",
  path: "/menu",
});

export default async function MenuPage() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);
  const minOf = (kind: "food" | "drinks") => {
    const prices = menu.filter((s) => s.kind === kind).flatMap((s) => s.items.map((i) => i.price)).filter((p): p is number => p !== null && p >= 99);
    return prices.length ? Math.min(...prices) : null;
  };
  const dishCount = menu.reduce((n, s) => n + s.items.length, 0);
  const highlights = [
    { icon: UtensilsCrossed, label: `${dishCount}+ dishes & drinks` },
    { icon: BadgePercent, label: `Food from ${formatPrice(minOf("food"))}` },
    { icon: Beer, label: `Drinks from ${formatPrice(minOf("drinks"))}` },
    { icon: Clock, label: settings.general.hoursNote || "Kitchen open late" },
  ];

  return (
    <>
      <JsonLd data={[menuJsonLd(menu, settings.general.name), breadcrumbJsonLd([{ name: "Menu", path: "/menu" }])]} />
      <PageHero
        eyebrow="Our menu is our jaan"
        title="Big flavours, honest prices"
        intro="Andhra spice, tandoor classics, dum biryani, bar bites and a bar that pours till late — all at prices that make Whitefield smile."
        crumbs={[{ name: "Menu" }]}
      >
        <ul className="mt-7 flex flex-wrap gap-2">
          {highlights.map((h) => (
            <li key={h.label} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-semibold">
              <h.icon className="size-4 text-brass" /> {h.label}
            </li>
          ))}
        </ul>
      </PageHero>
      <MenuBrowser sections={menu} />
      <CtaBand title="Hungry yet?" text="Book a table and we'll have the Guntur chicken ready." secondary={null} image={settings.home.heroImage} />
    </>
  );
}
