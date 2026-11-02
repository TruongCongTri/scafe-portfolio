"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, refreshSoon, useGSAP } from "@/lib/gsap";
import { onSiteReady } from "@/lib/site";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Alley.css";

// Back to front: the full photo, then cutouts of the nearer planes.
const LAYERS = ["base", "far", "mid", "near"];
// In viewport heights: the reveal ends as the title is about to cross the screen.
const REVEAL_DISTANCE = 2.0375;

export function Alley() {
  const root = useRef<HTMLElement>(null);
  const { alley } = useI18n().t.about;

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      const bg = section?.querySelector<HTMLElement>(".alley__bg");
      if (!section || !bg) return;

      const build = contextSafe!(() => {
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          const reveal = gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${window.innerHeight * REVEAL_DISTANCE}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            // The ridge's peak leads on the right while the inner points slide left.
            .fromTo(bg, { "--y3": "100%" }, { "--y3": "0%", duration: 2, ease: "quad.inOut" }, 0)
            .fromTo(bg, { "--x2": "27.7%" }, { "--x2": "10%", duration: 2, ease: "quad.inOut" }, 0)
            .fromTo(bg, { "--x3": "92.7%" }, { "--x3": "75%", duration: 2, ease: "quart.inOut" }, 0)
            .fromTo(bg, { "--y4": "100%" }, { "--y4": "0%", duration: 1.75, ease: "quad.inOut" }, 0.25)
            .fromTo(bg, { "--y2": "100%" }, { "--y2": "0%", duration: 1.35, ease: "quart.inOut" }, 0.65)
            .fromTo(bg, { "--y1": "100%" }, { "--y1": "0%", duration: 1.1, ease: "quart.inOut" }, 0.9);

          // The nearer the plane, the less far it travels.
          gsap.utils.toArray<HTMLElement>(".alley__layer").forEach((layer, index) => {
            reveal.fromTo(
              layer,
              { yPercent: 10 + 2.5 ** (LAYERS.length - index) },
              { yPercent: 0, duration: 2.7, ease: "quart.inOut" },
              0
            );
          });

          gsap
            .timeline({
              defaults: { duration: 2, ease: "none" },
              scrollTrigger: { trigger: bg, start: "top bottom", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
            })
            .fromTo(".alley__figure", { yPercent: 0 }, { yPercent: -20 }, 1.65)
            .fromTo(".alley__subtitle", { yPercent: 0 }, { yPercent: 250 }, 1.65);
        });

        refreshSoon();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="alley">
      <div className="alley__bg">
        <div className="alley__bg-wrapper">
          <figure className="alley__figure">
            {LAYERS.map((layer, index) => (
              <Image
                key={layer}
                src={`/images/room/${layer}.webp`}
                alt={index === 0 ? alley.alt : ""}
                fill
                sizes="(max-width: 1024px) 85vw, 100vw"
                className="alley__layer cover"
              />
            ))}
          </figure>
          <TimezoneBar />
        </div>
      </div>
      <div className="alley__box">
        <h2 className="alley__title display">{alley.title}</h2>
        <p className="alley__subtitle serif">{alley.subtitle}</p>
      </div>
    </section>
  );
}
