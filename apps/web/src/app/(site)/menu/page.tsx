import { getMenu, getSettings } from "@/lib/data";
import { breadcrumbJsonLd, menuJsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
import { MenuBrowser } from "@/components/site/menu-browser";
import { JsonLd } from "@/components/site/json-ld";
import { CtaBand } from "@/components/site/cta-band";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Menu — Andhra, North Indian, Biryani, Cocktails & Beer",
  description:
    "The full food and drinks menu at The Diner Restobar, Whitefield: Guntur chicken, Hyderabadi dum biryani, tandoori, pizzas, cocktails, draught and craft beer, with prices.",
  path: "/menu",
});

export default async function MenuPage() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);
  return (
    <>
      <JsonLd data={[menuJsonLd(menu, settings.general.name), breadcrumbJsonLd([{ name: "Menu", path: "/menu" }])]} />
      <PageHero
        eyebrow="Food & drinks"
        title="Spice, smoke & something cold."
        intro="Andhra heat, tandoor classics, dum biryani and a bar that pours until late. Look for the house favourites."
        crumbs={[{ name: "Menu" }]}
      />
      <MenuBrowser sections={menu} />
      <div className="mt-24">
        <CtaBand title="Hungry yet?" text="Book a table and we'll have the Guntur chicken ready." secondary={null} image={settings.home.heroImage} />
      </div>
    </>
  );
}
