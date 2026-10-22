import { getFaqs, getSettings } from "@/lib/data";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
import { Visit } from "@/components/site/visit";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { SectionHeading } from "@/components/site/section-heading";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Contact & Directions — Pattandur Agrahara, Whitefield",
  description:
    "Find The Diner Restobar at 107/4 Pattandur Agrahara Main Road, Whitefield, Bengaluru, near ITPL Gate 3. Opening hours, phone, WhatsApp, directions and parking.",
  path: "/contact",
});

export default async function ContactPage() {
  const [{ general }, faqs] = await Promise.all([getSettings(), getFaqs()]);
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Contact", path: "/contact" }]), ...(faqs.length ? [faqJsonLd(faqs)] : [])]} />
      <PageHero eyebrow="Contact" title="Come say hello." intro={general.description} crumbs={[{ name: "Contact" }]} />
      <Visit general={general} />
      <section className="container-x py-16" aria-label="Send a message">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Write to us" title="Questions, feedback, collaborations." />
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
      </section>
      {faqs.length > 0 && (
        <section className="container-x py-24" aria-label="FAQ">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="FAQ" title="Before you come." />
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
