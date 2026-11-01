import type { Metadata } from "next";
import { CrewHero } from "@/components/crew/CrewHero";
import { CrewRest } from "@/components/crew/CrewRest";
import { Leads } from "@/components/crew/Leads";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export const metadata: Metadata = { title: "Crew" };

export default function CrewPage() {
  return (
    <>
      <CrewHero />
      <Leads />
      <CrewRest />
      <Contact />
    </>
  );
}
