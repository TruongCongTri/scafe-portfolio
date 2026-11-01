"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onSiteReady } from "@/lib/site";
import { Lines } from "@/components/ui/Lines";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./MenuHero.css";

// In viewport heights: the hero falls back while the first signature rises over it.
const EXIT_START = 0.25;
const EXIT_DISTANCE = 0.75;

export function MenuHero() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      if (!section) return;
      const height = () => window.innerHeight;

      const build = contextSafe!(() => {
        gsap.fromTo(".menu-hero__bg", { "--p": 1 }, { "--p": 0, duration: 1.1, ease: "quart.out" });

        gsap.matchMedia().add("(min-width: 1025px)", () => {
          gsap
            .timeline({
              defaults: { duration: 2, ease: "quad.in" },
              scrollTrigger: {
                trigger: section,
                start: () => `top+=${height() * EXIT_START} top`,
                end: () => `+=${height() * EXIT_DISTANCE}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(".menu-hero__stage", { yPercent: 0 }, { yPercent: -30 }, 0)
            .fromTo(".menu-hero__box", { scale: 1 }, { scale: 0.85 }, 0);
        });

        ScrollTrigger.refresh();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="menu-hero scene">
      <div className="stage menu-hero__stage">
        <figure className="menu-hero__bg">
          <Image src="/images/shelf.webp" alt={t.menu.heroAlt} fill sizes="100vw" preload className="cover" />
        </figure>
        <div className="menu-hero__box box">
          <SplitLines as="h1" className="menu-hero__title display">
            <Lines lines={t.menu.heroTitle} />
          </SplitLines>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
