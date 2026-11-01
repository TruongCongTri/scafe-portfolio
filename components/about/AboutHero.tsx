"use client";

import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onSiteReady } from "@/lib/site";
import { DropArrow } from "@/components/ui/Icons";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./AboutHero.css";

export function AboutHero() {
  const { title, subtitle, text } = useI18n().t.about.hero;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const build = contextSafe!(() => {
        gsap
          .timeline({ delay: 0.1 })
          .fromTo(".drop-arrow .arrow", { yPercent: -125 }, { yPercent: 0, duration: 0.85, ease: "quart.out" }, 0)
          .fromTo(".about-hero__text", { y: "3rem", opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "quart.out" }, 0.15);

        // The arrow keeps pointing the way down, into the landscape.
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          gsap.fromTo(
            ".drop-arrow",
            { y: 0 },
            {
              y: () => window.innerHeight * 1.05,
              ease: "none",
              scrollTrigger: { trigger: ".about-hero__bg", start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
            }
          );
        });

        ScrollTrigger.refresh();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="about-hero">
      <div className="about-hero__bg">
        <div className="about-hero__grid">
          <VectorGrid color="rgba(225, 212, 195, 0.14)" />
        </div>
      </div>
      <div className="about-hero__box box">
        <header className="about-hero__header">
          <SplitLines as="h1" className="about-hero__title display">
            <span>{title[0]}</span>
            <br />
            <span className="about-hero__indent">{title[1]}</span>
            <br />
            <span>{title[2]}</span>
          </SplitLines>
          <DropArrow className="about-hero__arrow" />
        </header>
        <footer className="about-hero__footer">
          <h2 className="serif">{subtitle}</h2>
          <p className="about-hero__text">{text}</p>
        </footer>
      </div>
      <TimezoneBar />
    </section>
  );
}
