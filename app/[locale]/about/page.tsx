import { getI18n } from "@/i18n/server";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutTeam } from "@/components/about/AboutTeam";
import { Alley } from "@/components/about/Alley";
import { Partners } from "@/components/about/Partners";
import { Pillars } from "@/components/about/Pillars";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t.meta.about };
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Alley />
      <Pillars />
      <Partners />
      <AboutTeam />
      <Contact />
    </>
  );
}
