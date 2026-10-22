import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#fffaf4",
  colorScheme: "light",
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo, general } = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.description,
    keywords: seo.keywords,
    applicationName: general.name,
    authors: [{ name: general.name }],
    creator: general.name,
    formatDetection: { telephone: true, address: true, email: true },
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: general.name,
      title: seo.defaultTitle,
      description: seo.description,
      url: SITE_URL,
      images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630, alt: general.name }] : undefined,
    },
    twitter: { card: "summary_large_image", title: seo.defaultTitle, description: seo.description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    verification: seo.googleSiteVerification ? { google: seo.googleSiteVerification } : undefined,
    other: {
      "geo.region": "IN-KA",
      "geo.placename": `${general.address.locality}, ${general.address.city}`,
      "geo.position": `${general.geo.lat};${general.geo.lng}`,
      ICBM: `${general.geo.lat}, ${general.geo.lng}`,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${bricolage.variable} ${jakarta.variable} ${bebas.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          theme="light"
          position="bottom-center"
          toastOptions={{ className: "!bg-coal !border-black/10 !text-cream !rounded-2xl" }}
        />
      </body>
    </html>
  );
}
