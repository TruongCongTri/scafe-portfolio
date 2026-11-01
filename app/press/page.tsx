import type { Metadata } from "next";
import { Articles } from "@/components/press/Articles";
import { Featured } from "@/components/press/Featured";
import { PressHero } from "@/components/press/PressHero";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export const metadata: Metadata = { title: "Press" };

export default function PressPage() {
  return (
    <>
      <PressHero />
      <Featured />
      <Articles />
      <Contact flow />
    </>
  );
}
