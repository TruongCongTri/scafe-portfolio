import { withLocale, type Locale } from "@/i18n/config";
import { site, type NightEvent } from "./content";

// Structured data for one event, so search can show its date and place.
export const eventSchema = (night: NightEvent, address: string, locale: Locale) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: night.title,
  description: night.text,
  url: `${site.url}${withLocale(locale, `/nights/${night.id}`)}`,
  image: night.image.startsWith("http") ? night.image : `${site.url}${night.image}`,
  startDate: `${night.date}T${night.time?.slice(0, 5) ?? "19:00"}:00+07:00`,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "BarOrPub",
    name: site.name,
    address: { "@type": "PostalAddress", streetAddress: address, addressCountry: "VN" },
  },
  organizer: { "@type": "Organization", name: site.name, url: site.url },
});
