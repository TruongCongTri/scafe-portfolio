"use client";

import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, refreshSoon, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { trackViewportEnd } from "@/lib/scene";
import { MASK_OFFSET, onSiteReady, prefersReducedMotion } from "@/lib/site";
import { useContactForm } from "@/components/shell/ContactForms";
import { Stamp } from "@/components/ui/Icons";
import { Lines } from "@/components/ui/Lines";
import { RectButton } from "@/components/ui/RectButton";
import "./Partners.css";

// In viewport heights. The columns start parting as the team section gets close.
const REVEAL_DISTANCE = 1.25;
const SNAP_THRESHOLD = 0.3;
const PART_DISTANCE = 2.25;

export function Partners() {
  const root = useRef<HTMLElement>(null);
  const openForm = useContactForm();
  const { t, content } = useI18n();
  const copy = t.about.partners;

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      const wrapper = section?.querySelector<HTMLElement>(".partners__wrapper");
      const right = section?.querySelector<HTMLElement>(".partners__right");
      if (!section || !wrapper || !right) return;
      const height = () => window.innerHeight;
      const reduced = prefersReducedMotion();

      const build = contextSafe!(() => {
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          trackViewportEnd(section);

          // The long column pins once its last line reaches the bottom of the screen.
          const measure = () => section.style.setProperty("--content-height", `${right.offsetHeight}px`);
          measure();
          ScrollTrigger.addEventListener("refreshInit", measure);

          const title = SplitText.create(".partners__title", { type: "lines", mask: "lines" });

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
                      duration: 1.5,
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
            .fromTo(wrapper, { "--y1": 1 }, { "--y1": 0, duration: 2, ease: "quart.inOut" }, 0)
            .fromTo(wrapper, { "--y2": 1 }, { "--y2": 0, duration: 2, ease: "quad.inOut" }, 0)
            .fromTo(wrapper, { "--y3": 1 }, { "--y3": 0, duration: 1.4, ease: "quad.inOut" }, 0.6)
            .fromTo(wrapper, { "--y4": 1 }, { "--y4": 0, duration: 1, ease: "quart.inOut" }, 1)
            .fromTo(title.lines, { yPercent: MASK_OFFSET }, { yPercent: 0, duration: 0.85, ease: "quart.out" }, 0.75);

          gsap
            .timeline({
              defaults: { ease: "quad.in" },
              scrollTrigger: {
                trigger: section,
                start: () => `bottom-=${height() * PART_DISTANCE} top`,
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(".partners__left", { x: 0 }, { x: "-20rem" }, 0)
            .fromTo(".partners__right", { x: 0 }, { x: "20rem" }, 0);

          return () => ScrollTrigger.removeEventListener("refreshInit", measure);
        });

        refreshSoon();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="partners">
      <div className="partners__wrapper">
        <div className="partners__box box">
          <div className="partners__left">
            <div className="partners__left-wrapper">
              <h2 className="partners__title display">
                <Lines lines={copy.title} />
              </h2>
              <RectButton label={copy.cta} onClick={() => openForm("contact")} />
            </div>
          </div>
          <div className="partners__right">
            <h3 className="partners__subtitle serif">{copy.subtitle}</h3>
            <ul>
              {content.partners.map((partner) => (
                <li key={partner.name}>
                  <Stamp />
                  <div>
                    <h4 className="display">{partner.name}</h4>
                    <p>{partner.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
