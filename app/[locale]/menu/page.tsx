import { getI18n, pageMetadata } from "@/i18n/server";
import { Collection } from "@/components/menu/Collection";
import { MenuHero } from "@/components/menu/MenuHero";
import { Signatures } from "@/components/menu/Signatures";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata("/menu", t.meta.menu, t.meta.pages.menu);
}

export default function MenuPage() {
  return (
    <>
      <MenuHero />
      <Signatures />
      <Collection />
      <Contact />
    </>
  );
}
