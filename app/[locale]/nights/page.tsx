import { getI18n, pageMetadata } from "@/i18n/server";
import { NightsHero } from "@/components/nights/NightsHero";
import { Positions } from "@/components/nights/Positions";
import { Contact } from "@/components/ui/Contact";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/lib/content";
import "./page.css";

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata("/nights", t.meta.nights, t.meta.pages.nights);
}

export default async function NightsPage() {
  const { t, content } = await getI18n();
  const events = content.nights
    .filter((night) => night.date)
    .map((night) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: night.title,
      description: night.text,
      image: `${site.url}${night.image}`,
      startDate: `${night.date}T${night.time?.slice(0, 5) ?? "19:00"}:00+07:00`,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "BarOrPub",
        name: site.name,
        address: { "@type": "PostalAddress", streetAddress: t.site.address, addressCountry: "VN" },
      },
      organizer: { "@type": "Organization", name: site.name, url: site.url },
    }));

  return (
    <>
      <JsonLd data={events} />
      <NightsHero />
      <Positions />
      <Contact />
    </>
  );
}
