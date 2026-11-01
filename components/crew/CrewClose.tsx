"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { MASK_OFFSET, onSiteReady, prefersReducedMotion } from "@/lib/site";
import { Lines } from "@/components/ui/Lines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./CrewClose.css";

// In viewport heights: must match the list padding here and Contact's overlap in crew/page.css.
const OPEN_DISTANCE = 2;
const FALL_DISTANCE = 1.75;
const SNAP_THRESHOLD = 0.35;
// The title sits back while the list crosses it, so the rows stay readable.
const TITLE_DIM = 0.16;

// Hover image edges, peak first: start and duration before the 3x speed-up.
const IMAGE_IN: [string, number, number, string][] = [
  ["--y2", 0, 2, "quad.inOut"],
  ["--y1", 0.25, 1.75, "quad.inOut"],
  ["--y25", 0.4, 1.6, "quart.inOut"],
  ["--y3", 0.65, 1.35, "quart.inOut"],
  ["--y4", 0.9, 1.1, "quart.inOut"],
];
const IMAGE_OUT: [string, number, number, string][] = [
  ["--y7", 0, 2, "quad.inOut"],
  ["--y8", 0.25, 1.75, "quad.inOut"],
  ["--y65", 0.4, 1.6, "quart.inOut"],
  ["--y6", 0.65, 1.35, "quart.inOut"],
  ["--y5", 0.9, 1.1, "quart.inOut"],
];
const IMAGE_SPEED = 3;

function wipe(image: Element, edges: typeof IMAGE_IN, onComplete?: () => void) {
  const timeline = gsap.timeline({ onComplete });
  edges.forEach(([edge, position, duration, ease]) => {
    timeline.fromTo(image, { [edge]: "100%" }, { [edge]: "0%", duration, ease }, position);
  });
  return timeline.timeScale(IMAGE_SPEED);
}

// Each edge point: from values, to values, start and duration.
const EDGES: [gsap.TweenVars, gsap.TweenVars, number, number][] = [
  [{ "--x3": 0, "--y3": "55%" }, { "--x3": 1, "--y3": "70%" }, 0, 2],
  [{ "--x2": 0, "--y2": "35%" }, { "--x2": 1, "--y2": "30%" }, 0.1, 1.9],
  [{ "--x1": 0 }, { "--x1": 1 }, 0.35, 1.65],
  [{ "--x4": 0 }, { "--x4": 1 }, 0.15, 1.85],
  [{ "--x6": 0, "--y6": "70%" }, { "--x6": 1, "--y6": "66%" }, 0.05, 1.95],
  [{ "--x7": 0, "--y7": "25%" }, { "--x7": 1, "--y7": "33%" }, 0.1, 1.9],
  [{ "--x5": 0 }, { "--x5": 1 }, 0.25, 1.75],
  [{ "--x8": 0 }, { "--x8": 1 }, 0.2, 1.8],
];

export function CrewClose() {
  const { t, content } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      if (!section) return;
      const height = () => window.innerHeight;
      const reduced = prefersReducedMotion();

      const build = contextSafe!(() => {
        const title = section.querySelector<HTMLElement>(".crew-close__title")!;
        const list = section.querySelector<HTMLElement>(".crew-close__list")!;

        gsap
          .timeline({
            scrollTrigger: { trigger: list, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          })
          .fromTo(title, { opacity: 1 }, { opacity: TITLE_DIM, duration: 0.2, ease: "none" }, 0)
          .to(title, { opacity: 1, duration: 0.2, ease: "none" }, 0.8);

        const rows = gsap.utils.toArray<HTMLElement>(".crew-close__row");
        const media = gsap.matchMedia();

        // With no hover on phones, the row at mid-screen lights up instead.
        media.add("(max-width: 1024px)", () => {
          rows.forEach((row) => {
            ScrollTrigger.create({ trigger: row, start: "top 55%", end: "bottom 45%", toggleClass: "is-active" });
          });
        });

        // Each hover adds its own copy, so the old image can wipe out under the new one.
        media.add("(min-width: 1025px)", () => {
          const images = section.querySelector<HTMLElement>(".crew-close__images")!;
          const moveY = gsap.quickTo(images, "y", { duration: 0.5, ease: "power3" });

          const removers = rows.map((row) => {
            let shown: Element | null = null;

            const over = () => {
              const y = row.offsetTop + row.offsetHeight / 2;
              if (images.children.length) moveY(y);
              else moveY(y, y);
              shown = row.querySelector(".crew-close__image")!.cloneNode(true) as Element;
              shown.querySelector("img")?.setAttribute("loading", "eager");
              images.appendChild(shown);
              wipe(shown, IMAGE_IN);
            };

            const out = () => {
              const image = shown;
              if (!image) return;
              shown = null;
              gsap.delayedCall(0.1, () => {
                wipe(image, IMAGE_OUT, () => image.remove());
              });
            };

            row.addEventListener("pointerenter", over);
            row.addEventListener("pointerleave", out);
            return () => {
              row.removeEventListener("pointerenter", over);
              row.removeEventListener("pointerleave", out);
            };
          });

          return () => {
            removers.forEach((remove) => remove());
            images.replaceChildren();
          };
        });

        media.add("(min-width: 1025px)", () => {
          const split = SplitText.create(title, { type: "lines", mask: "lines" });
          const lastLeft = document.querySelector(".leads__row--last .leads__left");
          const lastRight = document.querySelector(".leads__row--last .leads__right");

          const open = gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${height() * OPEN_DISTANCE}`,
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
            .fromTo(title, { scale: 0.85 }, { scale: 1, duration: 2, ease: "quad.inOut" }, 0)
            // The columns behind are pushed apart by the opening crack.
            .fromTo(lastLeft, { x: 0 }, { x: "-20rem", duration: 1.5, ease: "quad.inOut" }, 0.5)
            .fromTo(lastRight, { x: 0 }, { x: "20rem", duration: 1.6, ease: "quad.inOut" }, 0.4);

          EDGES.forEach(([from, to, position, duration]) => {
            open.fromTo(section, from, { ...to, duration, ease: "quart.inOut" }, position);
          });

          // The middle line sits in the crack; the others open outward from it.
          const middle = (split.lines.length - 1) / 2;
          split.lines.forEach((line, index) => {
            const distance = Math.abs(index - middle);
            if (!distance) return;
            open.fromTo(
              line,
              { yPercent: index < middle ? MASK_OFFSET : -MASK_OFFSET },
              { yPercent: 0, duration: 0.75, ease: "quart.out" },
              distance / 2 + 0.25
            );
          });

          // Falls back as the contact rows rise over it.
          gsap.fromTo(
            title,
            { yPercent: 0 },
            {
              yPercent: -40,
              ease: "quad.in",
              immediateRender: false,
              scrollTrigger: {
                trigger: section,
                start: () => `bottom-=${height() * FALL_DISTANCE} bottom`,
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        ScrollTrigger.refresh();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="crew-close scene">
      <div className="crew-close__track">
        <div className="stage crew-close__stage box">
          <h2 className="crew-close__title display">
            <Lines lines={t.crewPage.closeTitle} />
          </h2>
          <TimezoneBar />
        </div>
      </div>
      <div className="crew-close__list-wrapper">
        <div className="crew-close__list-box">
          <ul className="crew-close__list">
            {content.support.map((member, index) => (
              <li key={index} className="crew-close__row">
                <div className="crew-close__content">
                  <span className="crew-close__num display">{index + 1}</span>
                  <span className="crew-close__name display">{member.name}</span>
                  <span className="crew-close__role">{member.role}</span>
                </div>
                <figure className="crew-close__image">
                  <Image src={member.image} alt="" fill sizes="(max-width: 1024px) 30vw, 16vw" className="cover" />
                </figure>
              </li>
            ))}
          </ul>
          <div className="crew-close__images" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
