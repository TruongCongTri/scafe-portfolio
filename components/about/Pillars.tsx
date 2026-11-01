"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { trackViewportEnd } from "@/lib/scene";
import { onSiteReady, prefersReducedMotion } from "@/lib/site";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./Pillars.css";

const SNAP_THRESHOLD = 0.2;

export function Pillars() {
  const root = useRef<HTMLElement>(null);
  const { pillars } = useI18n().content;

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      const box = section?.querySelector<HTMLElement>(".pillars__box");
      if (!section || !box) return;
      const height = () => window.innerHeight;
      const reduced = prefersReducedMotion();

      const build = contextSafe!(() => {
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          trackViewportEnd(box);

          const clip = (value: string) => () => {
            box.style.clipPath = value;
          };
          gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${height()}`,
                scrub: true,
                invalidateOnRefresh: true,
                onEnter: clip(""),
                onEnterBack: clip(""),
                onLeave: clip("unset"),
                onLeaveBack: clip(""),
              },
            })
            .fromTo(box, { "--y1": 0 }, { "--y1": 1, duration: 2, ease: "quart.in" }, 0)
            .fromTo(box, { "--y2": 0 }, { "--y2": 1, duration: 1.85, ease: "quart.in" }, 0.15)
            .fromTo(box, { "--y3": 0 }, { "--y3": 1, duration: 2, ease: "quad.in" }, 0)
            .fromTo(box, { "--y4": 0 }, { "--y4": 1, duration: 1.85, ease: "quad.in" }, 0.15)
            .fromTo(box, { "--y5": 0 }, { "--y5": 1, duration: 1.9, ease: "quart.in" }, 0.1);

          const figures = gsap.utils.toArray<HTMLElement>(".pillars__figure");
          gsap.utils.toArray<HTMLElement>(".pillars__item").forEach((item, index) => {
            if (!reduced) {
              ScrollTrigger.create({
                trigger: item,
                start: "top bottom",
                end: "top top",
                invalidateOnRefresh: true,
                snap: {
                  snapTo: (value, self) => {
                    const forward = self?.direction === 1;
                    return value > (forward ? SNAP_THRESHOLD : 1 - SNAP_THRESHOLD) ? 1 : 0;
                  },
                  duration: 1.5,
                  delay: 0.12,
                  ease: "power1.inOut",
                },
              });
            }

            // Each photo wipes up over the last as its words arrive.
            if (!index) return;
            gsap
              .timeline({ scrollTrigger: { trigger: item, start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true } })
              .fromTo(figures[index], { "--y1": 0 }, { "--y1": 1, duration: 1.85, ease: "quart.inOut" }, 0.15)
              .fromTo(figures[index], { "--y2": 0 }, { "--y2": 1, duration: 2, ease: "quart.inOut" }, 0)
              .fromTo(figures[index], { "--y3": 0 }, { "--y3": 1, duration: 2, ease: "quad.inOut" }, 0)
              .fromTo(figures[index], { "--y4": 0 }, { "--y4": 1, duration: 1.9, ease: "quad.inOut" }, 0.1)
              .fromTo(figures[index], { "--y5": 0 }, { "--y5": 1, duration: 1.85, ease: "quad.inOut" }, 0.15);
          });
        });

        ScrollTrigger.refresh();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="pillars">
      <div className="pillars__box">
        <div className="pillars__grid">
          <VectorGrid color="rgba(225, 212, 195, 0.22)" />
        </div>
        <div className="pillars__images">
          <div className="pillars__images-wrapper">
            {pillars.map((pillar) => (
              <figure key={pillar.subtitle} className="pillars__figure">
                <Image src={pillar.image} alt="" fill sizes="33vw" className="cover" />
              </figure>
            ))}
          </div>
        </div>
        {pillars.map((pillar, index) => (
          <article key={pillar.subtitle} className="pillars__item">
            <div className="pillars__inner box">
              <div className="pillars__left">
                <p className="pillars__text">{pillar.text}</p>
                <h2 className="pillars__title display">
                  {pillar.title[0]}
                  <br />
                  {pillar.title[1]}
                </h2>
              </div>
              <figure className="pillars__photo">
                <Image src={pillar.image} alt="" fill sizes="100vw" className="cover" />
              </figure>
              <div className="pillars__right">
                <div className="pillars__num display">0{index + 1}</div>
                <h3 className="pillars__subtitle serif">{pillar.subtitle}</h3>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
