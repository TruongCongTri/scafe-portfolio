import { getI18n, pageMetadata } from "@/i18n/server";
import { Articles } from "@/components/press/Articles";
import { Featured } from "@/components/press/Featured";
import { PressHero } from "@/components/press/PressHero";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata("/press", t.meta.press, t.meta.pages.press);
}

export default function PressPage() {
  return (
    <>
      <PressHero />
      <Featured />
      <Articles />
      <Contact />
    </>
  );
}
