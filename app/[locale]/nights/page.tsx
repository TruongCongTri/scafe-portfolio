import { getI18n } from "@/i18n/server";
import { NightsHero } from "@/components/nights/NightsHero";
import { Positions } from "@/components/nights/Positions";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t.meta.nights };
}

export default function NightsPage() {
  return (
    <>
      <NightsHero />
      <Positions />
      <Contact flow />
    </>
  );
}
