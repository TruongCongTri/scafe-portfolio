import type { Metadata } from "next";
import { NightsHero } from "@/components/nights/NightsHero";
import { Positions } from "@/components/nights/Positions";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export const metadata: Metadata = { title: "Nights" };

export default function NightsPage() {
  return (
    <>
      <NightsHero />
      <Positions />
      <Contact flow />
    </>
  );
}
