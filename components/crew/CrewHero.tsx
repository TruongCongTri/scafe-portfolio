"use client";

import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, refreshSoon, SplitText, useGSAP } from "@/lib/gsap";
import { onSiteReady } from "@/lib/site";
import { DropArrow } from "@/components/ui/Icons";
import { Lines } from "@/components/ui/Lines";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./CrewHero.css";

// In viewport heights: the intro leaves as the first person's column takes over.
const TEXT_EXIT_DISTANCE = 0.8;

export function CrewHero() {
  const { title, subtitle, text } = useI18n().t.crewPage;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      if (!section) return;
      const height = () => window.innerHeight;

      const build = contextSafe!(() => {
        gsap
          .timeline({ delay: 0.1 })
          .fromTo(".drop-arrow .arrow", { yPercent: -125 }, { yPercent: 0, duration: 0.85, ease: "quart.out" }, 0)
          .fromTo(".crew-hero__text", { y: "1.5rem", opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "quart.out" }, 0.15)
          .fromTo(".crew-hero__right", { "--p": 0 }, { "--p": 1, duration: 0.85, ease: "quad.inOut" }, 0);

        gsap.matchMedia().add("(min-width: 1025px)", () => {
          const split = SplitText.create(".crew-hero__text", { type: "lines", mask: "lines" });
          gsap.fromTo(
            split.lines,
            { yPercent: 0 },
            {
              yPercent: -100,
              ease: "quart.inOut",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${height() * TEXT_EXIT_DISTANCE}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        refreshSoon();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="crew-hero">
      <div className="crew-hero__left box">
        <div>
          <SplitLines as="h1" className="crew-hero__title display">
            <Lines lines={title} />
          </SplitLines>
          <h2 className="crew-hero__subtitle serif">{subtitle}</h2>
        </div>
        <DropArrow />
      </div>
      <div className="crew-hero__right">
        <div className="crew-hero__inner">
          <p className="crew-hero__text">{text}</p>
        </div>
      </div>
      <TimezoneBar />
    </section>
  );
}
