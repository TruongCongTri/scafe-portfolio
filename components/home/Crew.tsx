"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Lines } from "@/components/ui/Lines";
import { gsap, refreshSoon, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { getLenis, MASK_OFFSET, onSiteReady, prefersReducedMotion } from "@/lib/site";
import { RectButton } from "@/components/ui/RectButton";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Crew.css";

// Scroll positions in viewport heights from the top of the section.
const REVEAL_END = 1.625;
const LIST_BAND_START = 2;
const LIST_BAND_END = 4;
const BAND_MARGIN = 0.04;
const BAND_LEAD = 0.01;
// Must match where News starts: .home-crew --scene minus News's 287vh overlap.
const LIST_END = 4.4;
const MOBILE_BAND_END = 3;
const MOBILE_LIST_END = 3.2;
const COVER_DISTANCE = 1.87;
const SNAP_THRESHOLD = 0.3;
// The jagged edge crosses the image over two thirds of a second.
const IMAGE_SPEED = 3;

// Each edge point: [variable suffix order], start delay and duration, peak first.
const EDGE: [number, number][] = [
  [0.25, 1.75],
  [0, 2],
  [0.4, 1.6],
  [0.65, 1.35],
  [0.9, 1.1],
];
const TOP = ["--t1", "--t2", "--t3", "--t4", "--t5"];
const BOTTOM = ["--b1", "--b2", "--b3", "--b4", "--b5"];

const bandEnd = () => (window.innerWidth > 1024 ? LIST_BAND_END : MOBILE_BAND_END);
const listEnd = () => (window.innerWidth > 1024 ? LIST_END : MOBILE_LIST_END);

function wipe(figure: HTMLElement, points: string[], onComplete?: () => void) {
  const timeline = gsap.timeline({ onComplete });
  points.forEach((point, index) => {
    const [delay, duration] = EDGE[index];
    timeline.fromTo(
      figure,
      { [point]: "100%" },
      { [point]: "0%", duration, ease: index === 1 || index === 0 ? "quad.inOut" : "quart.inOut" },
      delay
    );
  });
  return timeline.timeScale(IMAGE_SPEED);
}

function resetFigure(figure: HTMLElement) {
  [...TOP, ...BOTTOM].forEach((point) => figure.style.setProperty(point, "100%"));
}

const Row = ({ index, hidden }: { index: number; hidden?: boolean }) => {
  const lead = useI18n().content.leads[index];
  return (
    <>
      <span className="home-crew__num">{index + 1}</span>
      <span className="home-crew__name serif">{lead.name}</span>
      <span className="home-crew__role" aria-hidden={hidden}>
        {lead.role}
      </span>
    </>
  );
};

export function Crew() {
  const { t, content } = useI18n();
  const { leads } = content;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      const list = section?.querySelector<HTMLElement>(".home-crew__list");
      const bandList = section?.querySelector<HTMLElement>(".home-crew__band-list");
      if (!section || !list || !bandList) return;

      const reduced = prefersReducedMotion();
      const height = () => window.innerHeight;
      const figures = gsap.utils.toArray<HTMLElement>(".home-crew__images figure", section);
      const rows = () => Array.from(list.children) as HTMLElement[];
      const rowOffset = (index: number) => rows()[index].offsetTop + rows()[index].offsetHeight / 2;
      const rowY = (index: number) => height() / 2 - rowOffset(index);

      let active = -1;
      let layer = 1;

      const hideActive = () => {
        if (active < 0) return;
        const figure = figures[active];
        active = -1;
        gsap.delayedCall(0.1, () => {
          // The visitor may have scrolled straight back to this row.
          if (figures[active] === figure) return;
          wipe(figure, BOTTOM, () => {
            if (figures[active] !== figure) resetFigure(figure);
          });
        });
      };

      const showRow = (index: number) => {
        if (index === active) return;
        hideActive();
        active = index;
        const figure = figures[index];
        gsap.killTweensOf(figure);
        resetFigure(figure);
        figure.style.zIndex = String(++layer);
        wipe(figure, TOP);
      };

      const build = contextSafe!(() => {
        const media = gsap.matchMedia();

        media.add({ desktop: "(min-width: 1025px)", mobile: "(max-width: 1024px)" }, (context) => {
          const snaps = !reduced && Boolean(context.conditions?.desktop);
          const title = section.querySelector<HTMLElement>(".home-crew__title")!;
          const split = SplitText.create(title, { type: "words", mask: "words" });
          const middle = (split.words.length - 1) / 2;

          const reveal = gsap
            .timeline({
              defaults: { ease: "quart.inOut" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${height() * REVEAL_END}`,
                scrub: true,
                invalidateOnRefresh: true,
                snap: snaps
                  ? {
                      // A crack closes back to the Room scene; anything more opens fully.
                      snapTo: (value, self) => {
                        const forward = self?.direction === 1;
                        return value > (forward ? SNAP_THRESHOLD : 1 - SNAP_THRESHOLD) ? 1 : 0;
                      },
                      duration: 1.5,
                      delay: 0.12,
                      ease: "power1.inOut",
                    }
                  : undefined,
              },
            })
            .fromTo(section, { "--y1": 1 }, { "--y1": 0, duration: 1.5 }, 0.5)
            .fromTo(section, { "--x2": "45.6%", "--y2": 1 }, { "--x2": "35%", "--y2": 0, duration: 2 }, 0)
            .fromTo(section, { "--y3": 1 }, { "--y3": 0, duration: 1.8 }, 0.2)
            .fromTo(section, { "--y4": 0 }, { "--y4": 1, duration: 1.3 }, 0.7)
            .fromTo(section, { "--x5": "43%", "--y5": 0 }, { "--x5": "30%", "--y5": 1, duration: 2 }, 0)
            .fromTo(section, { "--y6": 0 }, { "--y6": 1, duration: 1.7 }, 0.3)
            .fromTo(section, { "--start": 1 }, { "--start": 0, duration: 1.5, ease: "quad.inOut" }, 0.5)
            .fromTo(title, { scale: 0.85 }, { scale: 1, duration: 2, ease: "quad.inOut" }, 0);

          // The middle word sits in the crack; the rest open outward, ring by ring.
          split.words.forEach((word, index) => {
            const distance = Math.abs(index - middle);
            if (!distance) return;
            reveal.fromTo(
              word,
              { yPercent: index < middle ? MASK_OFFSET : -MASK_OFFSET },
              { yPercent: 0, duration: 0.75, ease: "quart.out" },
              distance / 2 + 0.25
            );
          });

          const lists = [list, bandList];
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: () => `top+=${height() * REVEAL_END} top`,
                end: () => `top+=${height() * listEnd()} top`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(lists, { y: height }, { y: () => rowY(0), duration: LIST_BAND_START - REVEAL_END })
            .to(lists, { y: () => rowY(leads.length - 1), duration: bandEnd() - LIST_BAND_START })
            .to(lists, { y: () => -list.offsetHeight, duration: listEnd() - bandEnd() });

          const last = leads.length - 1;
          if (snaps) {
            ScrollTrigger.create({
              trigger: section,
              start: () => `top+=${height() * LIST_BAND_START} top`,
              end: () => `top+=${height() * bandEnd()} top`,
              snap: { snapTo: 1 / last, directional: false, duration: { min: 0.25, max: 0.5 }, delay: 0.08, ease: "power1.inOut" },
            });
          }

          // Slightly wider than the band, so rows snapped to its very ends still count. The
          // first image waits for its row to arrive, and each row gets an equal share.
          const bandTop = () => section.offsetTop + height() * LIST_BAND_START;
          const bandLength = () => height() * (bandEnd() - LIST_BAND_START);
          ScrollTrigger.create({
            trigger: section,
            start: () => `top+=${height() * (LIST_BAND_START - BAND_LEAD)} top`,
            end: () => `top+=${height() * (bandEnd() + BAND_MARGIN)} top`,
            onUpdate: (self) => {
              const progress = gsap.utils.clamp(0, 1, (self.scroll() - bandTop()) / bandLength());
              showRow(Math.min(Math.floor(progress * leads.length), last));
            },
            onLeave: hideActive,
            onLeaveBack: hideActive,
          });

          // On phones the rows cross the title, so it steps back while they pass.
          if (!context.conditions?.desktop) {
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: section,
                  start: () => `top+=${height() * REVEAL_END} top`,
                  end: () => `top+=${height() * listEnd()} top`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              })
              .fromTo(title, { opacity: 1 }, { opacity: 0.2, duration: 0.15 }, 0)
              .to(title, { opacity: 1, duration: 0.15 }, 0.85);
          }

          // Falls back as the next scene covers it.
          gsap.fromTo(
            title,
            { yPercent: 0, scale: 1 },
            {
              yPercent: -40,
              scale: 0.85,
              ease: "quad.in",
              immediateRender: false,
              scrollTrigger: {
                trigger: section,
                start: () => `top+=${height() * listEnd()} top`,
                end: () => `+=${height() * COVER_DISTANCE}`,
                scrub: true,
              },
            }
          );
        });

        refreshSoon();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  const goToRow = (index: number) => {
    const section = root.current;
    if (!section) return;
    const span = bandEnd() - LIST_BAND_START;
    const top = section.offsetTop + window.innerHeight * (LIST_BAND_START + (span * index) / (leads.length - 1));
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(top, { duration: 0.8 });
    else window.scrollTo({ top });
  };

  return (
    <section ref={root} className="home-crew scene scene--overlap">
      <div className="stage home-crew__stage">
        <h2 className="home-crew__title display">
          <Lines lines={t.home.crew.title} />
        </h2>

        <div className="home-crew__images" aria-hidden="true">
          {leads.map((lead) => (
            <figure key={lead.image}>
              <Image src={lead.image} alt="" fill sizes="(max-width: 1024px) 40vw, 24vw" className="cover" />
            </figure>
          ))}
        </div>

        <ul className="home-crew__list">
          {leads.map((lead, index) => (
            <li key={lead.image}>
              <button type="button" onClick={() => goToRow(index)}>
                <Row index={index} />
              </button>
            </li>
          ))}
        </ul>

        {/* The same list again, shown only through the band at mid-screen. */}
        <div className="home-crew__band" aria-hidden="true">
          <ul className="home-crew__band-list">
            {leads.map((lead, index) => (
              <li key={lead.image}>
                <span className="home-crew__row">
                  <Row index={index} hidden />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <RectButton label={t.home.crew.cta} href="/crew" className="home-crew__bt" />
        <TimezoneBar />
      </div>
    </section>
  );
}
