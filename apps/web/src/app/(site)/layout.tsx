import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSettings } from "@/lib/data";
import { restaurantJsonLd, websiteJsonLd } from "@/lib/seo";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { MobileActionBar } from "@/components/site/mobile-action-bar";

export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const ga = settings.seo.gaMeasurementId;

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] btn-primary">
        Skip to content
      </a>
      <JsonLd data={[restaurantJsonLd(settings), websiteJsonLd(settings.general.name)]} />
      <Header general={settings.general} bookingEnabled={settings.booking.enabled} announcement={settings.announcement} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <MobileActionBar general={settings.general} />
      <Analytics />
      <SpeedInsights />
      {ga ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga.replace(/[^A-Z0-9-]/gi, "")}');`}
          </Script>
        </>
      ) : null}
    </div>
  );
}
