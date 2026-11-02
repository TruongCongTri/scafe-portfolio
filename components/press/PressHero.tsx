"use client";

import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, refreshSoon, useGSAP } from "@/lib/gsap";
import { onSiteReady } from "@/lib/site";
import { DropArrow } from "@/components/ui/Icons";
import { Lines } from "@/components/ui/Lines";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./PressHero.css";

export function PressHero() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const build = contextSafe!(() => {
        gsap
          .timeline({ delay: 0.1 })
          .fromTo(".drop-arrow .arrow", { yPercent: -125 }, { yPercent: 0, duration: 0.85, ease: "quart.out" }, 0)
          .fromTo(".press-hero__text", { y: "3rem", opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "quart.out" }, 0.15);

        // The arrow keeps pointing the way down while the first section rises.
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          gsap.fromTo(
            ".drop-arrow",
            { y: 0 },
            {
              y: () => window.innerHeight / 2,
              ease: "none",
              scrollTrigger: { trigger: ".press-hero__bg", start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
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
    <section ref={root} className="press-hero">
      <div className="press-hero__bg">
        <div className="press-hero__grid">
          <VectorGrid color="rgba(225, 212, 195, 0.14)" />
        </div>
      </div>
      <div className="press-hero__box box">
        <SplitLines as="h1" className="press-hero__title display">
          <Lines lines={t.press.heroTitle} />
        </SplitLines>
        <div className="press-hero__footer">
          <DropArrow />
          <p className="press-hero__text">{t.press.heroText}</p>
        </div>
      </div>
      <TimezoneBar />
    </section>
  );
}
