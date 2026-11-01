import { Crew } from "@/components/home/Crew";
import { Hero } from "@/components/home/Hero";
import { News } from "@/components/home/News";
import { Pours } from "@/components/home/Pours";
import { Room } from "@/components/home/Room";
import { Contact } from "@/components/ui/Contact";
import "./page.css";

export default function Home() {
  return (
    <>
      <Hero />
      <Pours />
      <Room />
      <Crew />
      <News />
      <Contact />
    </>
  );
}
