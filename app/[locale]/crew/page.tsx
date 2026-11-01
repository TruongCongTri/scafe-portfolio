import { getI18n } from "@/i18n/server";
import { CrewClose } from "@/components/crew/CrewClose";
import { CrewHero } from "@/components/crew/CrewHero";
import { Leads } from "@/components/crew/Leads";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t.meta.crew };
}

export default function CrewPage() {
  return (
    <>
      <CrewHero />
      <Leads />
      <CrewClose />
      <Contact />
    </>
  );
}
