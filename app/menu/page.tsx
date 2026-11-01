import type { Metadata } from "next";
import { Collection } from "@/components/menu/Collection";
import { MenuHero } from "@/components/menu/MenuHero";
import { Signatures } from "@/components/menu/Signatures";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return (
    <>
      <MenuHero />
      <Signatures />
      <Collection />
      <Contact flow />
    </>
  );
}
