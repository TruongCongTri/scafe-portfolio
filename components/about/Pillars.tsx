"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useGSAP } from "@/lib/gsap";
import { revealScene, sceneTimeline, SHAPES } from "@/lib/scene";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./Pillars.css";

export function Pillars() {
  const root = useRef<HTMLElement>(null);
  const { pillars } = useI18n().content;

  useGSAP(
    () => {
      if (!root.current) return;
      revealScene(root.current, SHAPES.right);
      const timeline = sceneTimeline(root.current, 1.1, 3.4);
      [1, 2].forEach((index) => {
        const position = index - 1;
        timeline
          .to(`[data-pillar="${index - 1}"] .pillars__left > *, [data-pillar="${index - 1}"] .pillars__right > *`, { yPercent: -40, autoAlpha: 0, duration: 0.25 }, position + 0.3)
          .from(`[data-pillar="${index}"] .pillars__left > *, [data-pillar="${index}"] .pillars__right > *`, { yPercent: 40, autoAlpha: 0, duration: 0.3 }, position + 0.6)
          .fromTo(
            `[data-pillar-image="${index}"]`,
            { clipPath: "polygon(0% 100%, 50% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 50% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.7 },
            position + 0.3
          );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="pillars scene scene--overlap">
      <div className="stage pillars__stage">
        <VectorGrid color="rgba(225, 212, 195, 0.22)" />
        <div className="pillars__images">
          {pillars.map((pillar, index) => (
            <figure key={pillar.subtitle} data-pillar-image={index}>
              <Image src={pillar.image} alt="" fill sizes="33vw" className="cover" />
            </figure>
          ))}
        </div>
        {pillars.map((pillar, index) => (
          <article key={pillar.subtitle} data-pillar={index} className="pillars__item box">
            <div className="pillars__left">
              <p className="pillars__text">{pillar.text}</p>
              <h2 className="pillars__title display">
                {pillar.title[0]}
                <br />
                {pillar.title[1]}
              </h2>
            </div>
            <div className="pillars__right">
              <div className="pillars__num display">0{index + 1}</div>
              <h3 className="pillars__subtitle serif">{pillar.subtitle}</h3>
            </div>
          </article>
        ))}
        <TimezoneBar />
      </div>
    </section>
  );
}
