"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { MASK_OFFSET, onSiteReady, prefersReducedMotion } from "@/lib/site";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./Leads.css";

// In viewport heights, measured down each right column (see .leads__right).
const ENTER_END = 1.8;
const EXIT_START = 2;
const SNAP_THRESHOLD = 0.5;

export function Leads() {
  const { leads } = useI18n().content;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const height = () => window.innerHeight;
      const reduced = prefersReducedMotion();

      const build = contextSafe!(() => {
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          const rows = gsap.utils.toArray<HTMLElement>(".leads__row");

          rows.forEach((row, index) => {
            const right = row.querySelector<HTMLElement>(".leads__right")!;
            const inner = row.querySelector<HTMLElement>(".leads__inner")!;
            const figure = row.querySelector<HTMLElement>("figure")!;
            const role = row.querySelector<HTMLElement>("h3");
            const last = index === rows.length - 1;
            const lines = role ? SplitText.create(role, { type: "lines", mask: "lines" }).lines : [];

            // Only the pinned column shows, so stacked ones don't read through.
            const show = (visible: boolean) => () => gsap.set(inner, { autoAlpha: visible ? 1 : 0 });
            show(false)();
            ScrollTrigger.create({
              trigger: right,
              start: "top top",
              end: "bottom bottom",
              invalidateOnRefresh: true,
              onEnter: show(true),
              onEnterBack: show(true),
              onLeave: () => {
                if (!last) show(false)();
              },
              onLeaveBack: show(false),
            });

            if (!reduced) {
              ScrollTrigger.create({
                trigger: row,
                start: "top bottom",
                end: () => `top+=${height()} bottom`,
                invalidateOnRefresh: true,
                snap: {
                  snapTo: (value) => (value > SNAP_THRESHOLD ? 1 : 0),
                  duration: 1.25,
                  delay: 0.12,
                  ease: "power1.inOut",
                },
              });
            }

            const enter = gsap
              .timeline({
                scrollTrigger: {
                  trigger: right,
                  start: "top top",
                  end: () => `top+=${height() * ENTER_END} bottom`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              })
              // The peak leads on the right while the two inner points slide left.
              .fromTo(figure, { "--y2": "100%" }, { "--y2": "0%", duration: 2, ease: "quad.inOut" }, 0)
              .fromTo(figure, { "--x2": "27.7%" }, { "--x2": "10%", duration: 2, ease: "quad.inOut" }, 0)
              .fromTo(figure, { "--x3": "92.7%" }, { "--x3": "75%", duration: 2, ease: "quart.inOut" }, 0)
              .fromTo(figure, { "--y1": "100%" }, { "--y1": "0%", duration: 1.75, ease: "quad.inOut" }, 0.25)
              .fromTo(figure, { "--y5": "100%" }, { "--y5": "0%", duration: 1.6, ease: "quart.inOut" }, 0.4)
              .fromTo(figure, { "--y3": "100%" }, { "--y3": "0%", duration: 1.35, ease: "quart.inOut" }, 0.65)
              .fromTo(figure, { "--y4": "100%" }, { "--y4": "0%", duration: 1.1, ease: "quart.inOut" }, 0.9);

            if (lines.length) {
              enter.fromTo(lines, { yPercent: MASK_OFFSET }, { yPercent: 0, duration: 1.7, ease: "quart.inOut" }, 0.3);
              if (!last) {
                gsap.to(lines, {
                  yPercent: -MASK_OFFSET,
                  ease: "quart.inOut",
                  immediateRender: false,
                  scrollTrigger: {
                    trigger: right,
                    start: () => `top+=${height() * EXIT_START} bottom`,
                    end: "bottom bottom",
                    scrub: true,
                    invalidateOnRefresh: true,
                  },
                });
              }
            }
          });
        });

        ScrollTrigger.refresh();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="leads">
      {leads.map((lead, index) => {
        const words = lead.name.split(" ");
        const half = Math.ceil(words.length / 2);
        return (
          <article key={lead.image} className={`leads__row ${index === leads.length - 1 ? "leads__row--last" : ""}`}>
            <div className="leads__wrapper">
              <div className="leads__left">
                <h2 className="leads__name display">
                  {words.slice(0, half).join(" ")}
                  <br />
                  {words.slice(half).join(" ")}
                </h2>
                <div className="leads__grid">
                  <VectorGrid color="rgba(225, 212, 195, 0.14)" />
                </div>
              </div>
              <div className="leads__right">
                <div className="leads__inner">
                  {lead.role && <h3 className="serif">{lead.role}</h3>}
                  <figure>
                    <Image src={lead.image} alt={lead.name} fill sizes="(max-width: 1024px) 100vw, 35vw" className="cover" />
                  </figure>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
