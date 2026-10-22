import { getSettings } from "@/lib/data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
import { BookingForm } from "@/components/site/booking-form";
import { JsonLd } from "@/components/site/json-ld";
import { telHref, whatsappHref } from "@/lib/utils";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Book a Table",
  description:
    "Reserve a table at The Diner Restobar, Whitefield. Rooftop, indoor and private dining. Instant online booking for dinner, match nights and celebrations.",
  path: "/reserve",
});

export default async function ReservePage() {
  const { booking, general } = await getSettings();
  const address = `${general.address.street}, ${general.address.locality}, ${general.address.city} ${general.address.postalCode}`;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Book a table", path: "/reserve" }])} />
      <PageHero
        eyebrow="Reservations"
        title="Save me a seat."
        intro="Pick a time and we'll hold your table. Groups, birthdays and match nights welcome."
        crumbs={[{ name: "Book a table" }]}
      />
      <section className="container-x pb-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <BookingForm settings={booking} venue={general.name} address={address} phone={general.phones[0]} />
          </div>
          <aside className="space-y-5 lg:col-span-4">
            <div className="glass rounded-[24px] p-7">
              <p className="eyebrow">Prefer to talk?</p>
              <p className="mt-3 text-sand">Call or WhatsApp and we'll book it for you.</p>
              <div className="mt-5 flex flex-col gap-2">
                {general.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="font-display text-2xl hover:text-brass">
                    {p}
                  </a>
                ))}
                {general.whatsapp && (
                  <a href={whatsappHref(general.whatsapp, "Hi! I'd like to book a table.")} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3">
                    WhatsApp us
                  </a>
                )}
              </div>
            </div>
            <div className="glass rounded-[24px] p-7">
              <p className="eyebrow">Big group?</p>
              <p className="mt-3 text-sand">
                Parties of more than {booking.maxPartySize} get set menus and a dedicated space.
              </p>
              <a href="/private-parties" className="btn-ghost mt-5">
                Party enquiry →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
