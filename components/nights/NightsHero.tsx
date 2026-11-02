"use client";

import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, refreshSoon, useGSAP } from "@/lib/gsap";
import { onSiteReady } from "@/lib/site";
import { useContactForm } from "@/components/shell/ContactForms";
import { DropArrow } from "@/components/ui/Icons";
import { RectButton } from "@/components/ui/RectButton";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./NightsHero.css";

export function NightsHero() {
  const openForm = useContactForm();
  const { nights } = useI18n().t;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      if (!section) return;

      const build = contextSafe!(() => {
        gsap
          .timeline({ delay: 0.1 })
          .fromTo(".drop-arrow .arrow", { yPercent: -125 }, { yPercent: 0, duration: 0.85, ease: "quart.out" }, 0)
          .fromTo(".nights-hero__text", { y: "3rem", opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "quart.out" }, 0.15)
          .fromTo(".nights-hero__bt", { "--p": 1 }, { "--p": 0, duration: 0.85, ease: "quart.out" }, 0.15);

        // Darkens and slides up by half as the events scroll over it.
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          gsap
            .timeline({
              defaults: { duration: 2, ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${window.innerHeight}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(section, { "--end": 0 }, { "--end": 1 }, 0)
            .fromTo(".nights-hero__box", { yPercent: 0 }, { yPercent: -50 }, 0);
        });

        refreshSoon();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="nights-hero scene">
      <div className="stage nights-hero__stage">
        <VectorGrid color="rgba(225, 212, 195, 0.14)" />
        <div className="nights-hero__box box">
          <div className="nights-hero__header">
            <SplitLines as="h1" className="nights-hero__title display">
              <span>{nights.heroTitle[0]}</span>
              <br />
              <span className="nights-hero__indent">{nights.heroTitle[1]}</span>
            </SplitLines>
            <div className="nights-hero__sub">
              <DropArrow />
              <h2 className="serif">{nights.heroSubtitle}</h2>
            </div>
          </div>
          <div className="nights-hero__footer">
            <p className="nights-hero__text">{nights.heroText}</p>
            <RectButton label={nights.heroCta} className="nights-hero__bt" onClick={() => openForm("contact")} />
          </div>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
