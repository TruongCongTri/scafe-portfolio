"use client";

import Image from "next/image";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { SplitLines } from "@/components/ui/SplitLines";
import "./MenuHero.css";

export function MenuHero() {
  return (
    <section className="menu-hero scene">
      <div className="stage menu-hero__stage box">
        <figure className="menu-hero__bg">
          <Image src="/images/shelf.webp" alt="A crowded back bar lined with bottles" fill sizes="100vw" preload className="cover" />
        </figure>
        <SplitLines as="h1" className="menu-hero__title display">
          Ready for an
          <br />
          unforgettable night?
        </SplitLines>
        <TimezoneBar />
      </div>
    </section>
  );
}
