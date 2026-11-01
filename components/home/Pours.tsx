"use client";

import { useRef } from "react";
import { brands } from "@/lib/content";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { onSiteReady, prefersReducedMotion } from "@/lib/site";
import { Stamp } from "@/components/ui/Icons";
import { RectButton } from "@/components/ui/RectButton";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Pours.css";

// Scroll distances in viewport heights: the section assembles and settles,
// then further scrolling walks the brands across the pinned strip.
const ASSEMBLE_DISTANCE = 1.75;
const MOBILE_REVEAL_DISTANCE = 1;
const STRIP_END = 4.75;
// Must match where Room starts: .home-pours --scene minus the 200vh overlap.
const COVER_START = 4.9;
const SNAP_THRESHOLD = 0.2;

export function Pours() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      const houses = section?.querySelector<HTMLElement>(".home-pours__houses");
      const track = section?.querySelector<HTMLElement>(".home-pours__track");
      if (!section || !houses || !track) return;

      const reduced = prefersReducedMotion();
      const height = () => window.innerHeight;
      const width = () => window.innerWidth;

      // Scrubbed both ways: down moves the brands left, up brings them back.
      const scrubStrip = (startAt: number) =>
        gsap.to(track, {
          x: () => houses.clientWidth - track.scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: () => `top+=${height() * startAt} top`,
            end: () => `top+=${height() * STRIP_END} top`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

      const build = contextSafe!(() => {
        const media = gsap.matchMedia();

        media.add("(min-width: 1025px)", () => {
          const title = SplitText.create(".home-pours__title", { type: "words" });
          const lines = SplitText.create(".home-pours__texts h3, .home-pours__texts p", { type: "lines" });

          gsap
            .timeline({
              defaults: { ease: "quad.inOut" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${height() * ASSEMBLE_DISTANCE}`,
                scrub: true,
                invalidateOnRefresh: true,
                snap: reduced
                  ? undefined
                  : {
                      // Settles whichever way the visitor was heading once past the threshold.
                      snapTo: (value, self) => {
                        const forward = self?.direction === 1;
                        return value > (forward ? SNAP_THRESHOLD : 1 - SNAP_THRESHOLD) ? 1 : 0;
                      },
                      duration: 2,
                      delay: 0.12,
                      ease: "power1.inOut",
                    },
              },
            })
            // The two edges ease differently, which is what slants the wipe.
            .fromTo(section, { "--x1": "100%" }, { "--x1": "0%", duration: 1 }, 0)
            .fromTo(section, { "--x2": "100%" }, { "--x2": "0%", duration: 1.2, ease: "quart.inOut" }, 0)
            .from(title.words, { x: width, duration: 1.15, stagger: 0.05 }, 0)
            .from(".home-pours__stamp", { x: width, duration: 1.15 }, 0)
            .from(".home-pours__houses", { x: width, duration: 2 }, 0.5)
            .from(lines.lines, { x: () => width() * 0.6, duration: 1, stagger: 0.01 }, 1.25)
            .from(".home-pours__bt", { x: () => width() * 0.75, duration: 1.25 }, 1.25);

          scrubStrip(ASSEMBLE_DISTANCE);

          // Falls back into the distance as the next scene arrives.
          gsap.to(".home-pours__content", {
            scale: 0.85,
            yPercent: -40,
            ease: "quad.in",
            scrollTrigger: {
              trigger: section,
              start: () => `top+=${height() * COVER_START} top`,
              end: () => `+=${height()}`,
              scrub: true,
            },
          });
        });

        media.add("(max-width: 1024px)", () => {
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${height() * MOBILE_REVEAL_DISTANCE}`,
                scrub: true,
              },
            })
            .fromTo(section, { "--x1": "100%" }, { "--x1": "0%", duration: 1 }, 0)
            .fromTo(section, { "--x2": "130%" }, { "--x2": "0%", duration: 1 }, 0);

          scrubStrip(MOBILE_REVEAL_DISTANCE);
        });

        ScrollTrigger.refresh();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="home-pours scene scene--overlap">
      <div className="stage home-pours__stage">
        <div className="home-pours__content">
          <div className="home-pours__header box">
            <div className="home-pours__title-wrapper">
              <h2 className="home-pours__title display">
                Serious
                <br />
                drinks
                <br />
                well-made.
              </h2>
              <Stamp className="home-pours__stamp" />
            </div>
            <article className="home-pours__texts">
              <h3 className="serif">We chase the flavours that matter and build them with precision, patience and care.</h3>
              <p>
                From first shake to final garnish, we believe a great drink isn&rsquo;t just a recipe. It&rsquo;s a
                small piece of theatre that changes the mood of a room and keeps you out later than you planned.
              </p>
              <RectButton label="See the menu" href="/menu" className="home-pours__bt" />
            </article>
          </div>

          <div className="home-pours__houses">
            <ul className="home-pours__track" aria-label="Brands behind the bar">
              {brands.map((brand) => (
                <li key={brand.name} className="home-pours__brand">
                  <span
                    className="home-pours__logo"
                    aria-hidden="true"
                    style={{ maskImage: `url("${brand.logo}")`, WebkitMaskImage: `url("${brand.logo}")` }}
                  />
                  <span className="home-pours__name">{brand.name}</span>
                  <span className="home-pours__note">
                    {brand.type}, {brand.origin}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
