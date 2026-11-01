"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useGSAP } from "@/lib/gsap";
import { revealScene, sceneTimeline, SHAPES } from "@/lib/scene";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Alley.css";

export function Alley() {
  const root = useRef<HTMLElement>(null);
  const { alley } = useI18n().t.about;

  useGSAP(
    () => {
      if (!root.current) return;
      revealScene(root.current, SHAPES.ridge);
      sceneTimeline(root.current, 0.5, 2.6)
        .fromTo(".alley__bg img", { scale: 1.25 }, { scale: 1.02, duration: 1 }, 0)
        .fromTo(
          ".alley__title",
          { yPercent: 12, y: () => window.innerHeight },
          { yPercent: -100, y: 0, duration: 0.62 },
          0
        )
        .fromTo(".alley__subtitle", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.62);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="alley scene scene--overlap">
      <div className="stage alley__stage">
        <figure className="alley__bg">
          <Image src="/images/room/base.webp" alt={alley.alt} fill sizes="100vw" className="cover" />
        </figure>
        <h2 className="alley__title display">{alley.title}</h2>
        <p className="alley__subtitle serif">{alley.subtitle}</p>
        <TimezoneBar />
      </div>
    </section>
  );
}
