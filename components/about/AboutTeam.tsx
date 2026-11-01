"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onSiteReady } from "@/lib/site";
import { Lines } from "@/components/ui/Lines";
import { RectButton } from "@/components/ui/RectButton";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./AboutTeam.css";

// In viewport heights: must match the overlap with Partners in about/page.css.
const OPEN_DISTANCE = 1.25;

export function AboutTeam() {
  const copy = useI18n().t.about.partners;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      const bg = section?.querySelector<HTMLElement>(".about-team__bg-wrapper");
      if (!section || !bg) return;

      const build = contextSafe!(() => {
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          gsap
            .timeline({
              defaults: { ease: "quad.inOut" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${window.innerHeight * OPEN_DISTANCE}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(bg, { "--x1": "50%" }, { "--x1": "0%", duration: 2 }, 0)
            .fromTo(bg, { "--x2": "50%" }, { "--x2": "0%", duration: 1.8 }, 0.2)
            .fromTo(bg, { "--x3": "50%" }, { "--x3": "100%", duration: 1.8 }, 0.2)
            .fromTo(bg, { "--x4": "50%" }, { "--x4": "100%", duration: 2 }, 0)
            .fromTo(bg, { "--x5": "50%" }, { "--x5": "100%", duration: 1.75 }, 0.25)
            .fromTo(".about-team__figure", { scale: 1 }, { scale: 1.1, duration: 2 }, 0);
        });

        ScrollTrigger.refresh();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="about-team">
      <div className="about-team__bg">
        <div className="about-team__bg-wrapper">
          <figure className="about-team__figure">
            <Image src="/images/taps-room.webp" alt={copy.photoAlt} fill sizes="100vw" className="cover" />
          </figure>
          <TimezoneBar />
        </div>
      </div>
      <div className="about-team__box box">
        <h2 className="about-team__title display">
          <Lines lines={copy.photoTitle} />
        </h2>
        <RectButton label={copy.photoCta} href="/crew" />
      </div>
    </section>
  );
}
