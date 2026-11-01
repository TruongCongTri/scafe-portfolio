"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { onSiteReady, prefersReducedMotion } from "@/lib/site";
import { staggerFrom } from "@/lib/scene";
import { Stamp } from "@/components/ui/Icons";
import { RectButton } from "@/components/ui/RectButton";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Room.css";

// Back to front: the full photo, then cutouts of the nearer planes.
const LAYERS = ["base", "far", "mid", "near"];
// Scroll distance, in viewport heights, that assembles the section.
const ASSEMBLE_DISTANCE = 3.1;
const MOBILE_REVEAL_DISTANCE = 1;
// The split runs with the Crew reveal: .home-room --scene minus Crew's 265vh overlap.
const SPLIT_START = 3.2;
const SPLIT_DISTANCE = 1.625;
const SNAP_THRESHOLD = 0.3;

export function Room() {
  const copy = useI18n().t.home.room;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      const stage = section?.querySelector<HTMLElement>(".home-room__stage");
      const content = section?.querySelector<HTMLElement>(".home-room__content");
      if (!section || !stage || !content) return;

      const reduced = prefersReducedMotion();
      const height = () => window.innerHeight;
      const width = () => window.innerWidth;

      const build = contextSafe!(() => {
        const media = gsap.matchMedia();

        media.add("(min-width: 1025px)", () => {
          // An untouched copy shows the top half while the scene splits along the line.
          const clone = content.cloneNode(true) as HTMLElement;
          clone.classList.add("home-room__content--clone");
          clone.inert = true;
          clone.querySelectorAll("img").forEach((image) => image.setAttribute("loading", "eager"));
          stage.insertBefore(clone, content.nextSibling);

          const scoped = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, content);
          const copied = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, clone);
          const layers = scoped(".home-room__layer");
          const subtitle = SplitText.create(scoped(".home-room__subtitle"), { type: "lines" });
          const article = SplitText.create(scoped(".home-room__article p"), { type: "lines" });
          gsap.set(copied(".home-room__bg"), { yPercent: -6.5 });

          const timeline = gsap
            .timeline({
              defaults: { ease: "quad.out" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${height() * ASSEMBLE_DISTANCE}`,
                scrub: true,
                invalidateOnRefresh: true,
                snap: reduced
                  ? undefined
                  : {
                      snapTo: (value, self) => {
                        const forward = self?.direction === 1;
                        return value > (forward ? SNAP_THRESHOLD : 1 - SNAP_THRESHOLD) ? 1 : 0;
                      },
                      duration: 1.75,
                      delay: 0.12,
                      ease: "power1.inOut",
                    },
              },
            })
            // The scene below sinks into shadow as the ridge climbs over it.
            .fromTo(
              section,
              { backgroundColor: "rgba(26, 8, 9, 0)" },
              { backgroundColor: "rgba(26, 8, 9, 0.75)", duration: 2, ease: "quart.inOut" },
              0
            )
            // Four points rise on staggered delays, so the peak on the right leads
            // while the two inner points slide left.
            .fromTo(section, { "--y3": "100%" }, { "--y3": "0%", duration: 2, ease: "quad.inOut" }, 0)
            .fromTo(section, { "--x3": "92.7%" }, { "--x3": "75%", duration: 2, ease: "quart.inOut" }, 0)
            .fromTo(section, { "--x2": "27.7%" }, { "--x2": "10%", duration: 2, ease: "quad.inOut" }, 0)
            .fromTo(section, { "--y4": "100%" }, { "--y4": "0%", duration: 1.75, ease: "quad.inOut" }, 0.25)
            .fromTo(section, { "--y2": "100%" }, { "--y2": "0%", duration: 1.35, ease: "quart.inOut" }, 0.65)
            .fromTo(section, { "--y1": "100%" }, { "--y1": "0%", duration: 1.1, ease: "quart.inOut" }, 0.9)
            // The nearer the plane, the less far it travels.
            .fromTo(scoped(".home-room__bg"), { yPercent: 0 }, { yPercent: -6.5, duration: 2, ease: "quad.inOut" }, 1.65)
            // The lines draw first, then everything enters from its own side.
            .fromTo(content, { "--p": 0 }, { "--p": 1, duration: 1.75, ease: "quad.inOut" }, 1.75)
            .from(scoped(".home-room__stamp"), { y: height, duration: 1.15 }, 2.05)
            .add(staggerFrom(article.lines, { y: height, duration: 1.15, ease: "quad.out" }, 0.025), 2.15)
            .add(staggerFrom(subtitle.lines, { y: () => -height(), duration: 1.15, ease: "quad.out" }, -0.025), 2.25)
            .fromTo(scoped(".home-room__subtitle"), { "--r": "3deg" }, { "--r": "0deg", duration: 1.15 }, 2.35)
            .add(staggerFrom(scoped(".home-room__line"), { x: () => width() * 0.4, duration: 1.15, ease: "quad.out" }, -0.1), 2.35)
            .fromTo(scoped(".home-room__title"), { "--r": "-3deg" }, { "--r": "0deg", duration: 1.15 }, 2.35)
            .from(scoped(".home-room__bt"), { y: height, duration: 0.9 }, 2.75);

          layers.forEach((layer, index) => {
            timeline.fromTo(
              layer,
              { yPercent: 10 + 2.5 ** (LAYERS.length - index) },
              { yPercent: 0, duration: 2.7, ease: "quart.inOut" },
              0
            );
          });

          // The two halves part along the line, opening a seam for the next scene.
          const setEnding = (ending: boolean) => () => section.classList.toggle("is-ending", ending);
          const split = gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: () => `top+=${height() * SPLIT_START} top`,
                end: () => `+=${height() * SPLIT_DISTANCE}`,
                scrub: true,
                onEnter: setEnding(true),
                onEnterBack: setEnding(true),
                onLeaveBack: setEnding(false),
              },
            })
            .to(scoped(".home-room__box"), { yPercent: 30, duration: 2, ease: "quad.inOut" }, 0.5)
            .to(copied(".home-room__box"), { yPercent: -30, duration: 2, ease: "quad.inOut" }, 0.5);

          copied(".home-room__layer").forEach((layer, index) => {
            split
              .fromTo(
                layers[index],
                { yPercent: 0 },
                { yPercent: 7 + 2 ** (LAYERS.length - index), duration: 2.5, ease: "quart.inOut", immediateRender: false },
                0
              )
              .to(layer, { yPercent: -(7 + 2 ** (index + 1)), duration: 2.5, ease: "quart.inOut" }, 0);
          });

          return () => {
            section.classList.remove("is-ending");
            clone.remove();
          };
        });

        media.add("(max-width: 1024px)", () => {
          gsap
            .timeline({
              defaults: { ease: "none", duration: 1 },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${height() * MOBILE_REVEAL_DISTANCE}`,
                scrub: true,
              },
            })
            .fromTo(section, { "--y3": "100%" }, { "--y3": "0%" }, 0)
            .fromTo(section, { "--x3": "92.7%" }, { "--x3": "75%" }, 0)
            .fromTo(section, { "--x2": "27.7%" }, { "--x2": "10%" }, 0)
            .fromTo(section, { "--y4": "100%" }, { "--y4": "0%", duration: 0.85 }, 0.15)
            .fromTo(section, { "--y2": "100%" }, { "--y2": "0%", duration: 0.7 }, 0.3)
            .fromTo(section, { "--y1": "100%" }, { "--y1": "0%", duration: 0.55 }, 0.45);
        });

        ScrollTrigger.refresh();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="home-room scene scene--overlap">
      <div className="stage home-room__stage">
        <div className="home-room__content">
          <figure className="home-room__bg">
            {LAYERS.map((layer, index) => (
              <Image
                key={layer}
                src={`/images/room/${layer}.webp`}
                alt={index === 0 ? copy.alt : ""}
                width={1920}
                height={1233}
                sizes="100vw"
                className="home-room__layer"
              />
            ))}
          </figure>

          <span className="home-room__rule" aria-hidden="true" />

          <div className="home-room__box">
            <div className="home-room__left">
              <h2 className="home-room__title display">
                <span className="home-room__line">{copy.title[0]}</span> <span className="home-room__line">{copy.title[1]}</span>
              </h2>
            </div>
            <div className="home-room__right">
              <div className="home-room__top">
                <h3 className="home-room__subtitle serif">{copy.subtitle}</h3>
              </div>
              <div className="home-room__bottom">
                <RectButton label={copy.cta} href="/about" className="home-room__bt" />
                <article className="home-room__article">
                  <Stamp className="home-room__stamp" />
                  <p>{copy.text}</p>
                </article>
              </div>
            </div>
          </div>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
