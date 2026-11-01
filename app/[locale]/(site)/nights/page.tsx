import { getI18n, pageMetadata } from "@/i18n/server";
import { NightsHero } from "@/components/nights/NightsHero";
import { Positions } from "@/components/nights/Positions";
import { Contact } from "@/components/ui/Contact";
import { JsonLd } from "@/components/ui/JsonLd";
import { eventSchema } from "@/lib/eventSchema";
import "./page.css";

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata("/nights", t.meta.nights, t.meta.pages.nights);
}

export default async function NightsPage() {
  const { locale, t, content } = await getI18n();
  const events = content.nights.filter((night) => night.date).map((night) => eventSchema(night, t.site.address, locale));

  return (
    <>
      <JsonLd data={events} />
      <NightsHero />
      <Positions />
      <Contact />
    </>
  );
}
