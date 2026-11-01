import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { Alley } from "@/components/about/Alley";
import { Partners } from "@/components/about/Partners";
import { Pillars } from "@/components/about/Pillars";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Alley />
      <Pillars />
      <Partners />
      <Contact />
    </>
  );
}
