"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Content } from "@/lib/content";
import { gsap, refreshSoon, SplitText, useGSAP } from "@/lib/gsap";
import { revealScene, SHAPES } from "@/lib/scene";
import { MASK_OFFSET, onSiteReady, prefersReducedMotion } from "@/lib/site";
import { useContactForm } from "@/components/shell/ContactForms";
import { Arrow } from "@/components/ui/Icons";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Signatures.css";

// In viewport heights: must match .signature --scene and its overlap in menu/page.css.
const REVEAL_DISTANCE = 1.25;
const NEXT_SCENE_START = 1.75;
const EXIT_DISTANCE = 1.25;
const SNAP_THRESHOLD = 0.3;

type SignatureProps = { item: Content["signatures"][number]; even: boolean; last: boolean };

function Signature({ item, even, last }: SignatureProps) {
  const root = useRef<HTMLElement>(null);
  const openForm = useContactForm();
  const { t } = useI18n();

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      const stage = section?.querySelector<HTMLElement>(".signature__stage");
      if (!section || !stage) return;

      const height = () => window.innerHeight;
      const reduced = prefersReducedMotion();

      const build = contextSafe!(() => {
        const media = gsap.matchMedia();

        media.add("(min-width: 1025px)", () => {
          const title = SplitText.create(".signature__title", { type: "lines", mask: "lines" });
          const tag = SplitText.create(".signature__tag", { type: "lines", mask: "lines" });

          gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${height() * REVEAL_DISTANCE}`,
                scrub: true,
                invalidateOnRefresh: true,
                snap: reduced
                  ? undefined
                  : {
                      snapTo: (value, self) => {
                        const forward = self?.direction === 1;
                        return value > (forward ? SNAP_THRESHOLD : 1 - SNAP_THRESHOLD) ? 1 : 0;
                      },
                      duration: 1.25,
                      delay: 0.12,
                      ease: "power1.inOut",
                    },
              },
            })
            .fromTo(
              section,
              { backgroundColor: "rgba(26, 8, 9, 0)" },
              { backgroundColor: "rgba(26, 8, 9, 0.75)", duration: 2, ease: "quart.inOut" },
              0
            )
            .fromTo(".signature__bg", { yPercent: 30 }, { yPercent: 0, duration: 2, ease: "quad.inOut" }, 0)
            // The outer points lead and the inner two trail, which bends the rising edge.
            .fromTo(stage, { "--y1": "100%" }, { "--y1": "0%", duration: 1.75, ease: "quad.inOut" }, 0)
            .fromTo(stage, { "--y2": "100%" }, { "--y2": "0%", duration: 1.75, ease: "quad.inOut" }, 0.25)
            .fromTo(stage, { "--y3": "100%" }, { "--y3": "0%", duration: 1.75, ease: "quart.inOut" }, 0.25)
            .fromTo(stage, { "--y4": "100%" }, { "--y4": "0%", duration: 1.75, ease: "quad.inOut" }, 0)
            .fromTo(".signature__content", { "--p": 0 }, { "--p": 1, duration: 1.4, ease: "quart.inOut" }, 0.6)
            .fromTo(title.lines, { yPercent: MASK_OFFSET }, { yPercent: 0, duration: 0.85, ease: "quart.out" }, 0.85)
            .fromTo(tag.lines, { yPercent: MASK_OFFSET }, { yPercent: 0, duration: 0.75, ease: "quart.out" }, 1.1)
            .fromTo(".signature__text", { y: "3.5rem", opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "quart.out" }, 1.15)
            .fromTo(".signature__play", { y: "3.5rem", opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "quart.out" }, 1.25);

          // Clears the dimming so the wipe out shows what sits behind this scene.
          const clearDim = () => gsap.set(section, { backgroundColor: "transparent" });
          const exit = gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: () => `top+=${height() * NEXT_SCENE_START} top`,
                end: () => `+=${height() * EXIT_DISTANCE}`,
                scrub: true,
                invalidateOnRefresh: true,
                onEnter: clearDim,
                onEnterBack: clearDim,
              },
            })
            .fromTo(stage, { yPercent: 0 }, { yPercent: -30, duration: 1.65, ease: "quad.in" }, 0.35);

          // Only the last scene closes: its bottom edge lifts off the list behind it.
          if (last) {
            exit
              .fromTo(stage, { "--y5": "100%" }, { "--y5": "0%", duration: 1.75, ease: "quad.inOut" }, 0)
              .fromTo(stage, { "--y6": "100%" }, { "--y6": "0%", duration: 1.75, ease: "quad.inOut" }, 0.25)
              .fromTo(stage, { "--y7": "100%" }, { "--y7": "0%", duration: 1.75, ease: "quart.inOut" }, 0.25)
              .fromTo(stage, { "--y8": "100%" }, { "--y8": "0%", duration: 1.75, ease: "quad.inOut" }, 0);
          }
        });

        media.add("(max-width: 1024px)", () => {
          revealScene(section, SHAPES.ridge).fromTo(
            ".signature__bg img",
            { scale: 1.2 },
            { scale: 1, duration: 1 },
            0
          );
        });

        refreshSoon();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className={`signature scene scene--overlap ${even ? "signature--even" : ""}`}>
      <div className="stage signature__stage box">
        <figure className="signature__bg">
          <Image src={item.image} alt={item.title} fill sizes="(max-width: 1024px) 85vw, 100vw" className="cover" style={{ objectPosition: item.focus }} />
        </figure>
        <div className="signature__content">
          <div className="signature__left">
            <h2 className="signature__title display">{item.title}</h2>
            <p className="signature__tag display">{item.tag}</p>
          </div>
          <div className="signature__side">
            <p className="signature__text">{item.text}</p>
            <button type="button" className="signature__play" onClick={() => openForm("book")}>
              <span className="signature__circle">
                <Arrow />
              </span>
              <span className="display">{t.menu.seat}</span>
            </button>
          </div>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}

export function Signatures() {
  const { signatures } = useI18n().content;
  return signatures.map((item, index) => (
    <Signature key={item.title} item={item} even={index % 2 === 1} last={index === signatures.length - 1} />
  ));
}
