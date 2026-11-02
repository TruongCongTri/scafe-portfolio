"use client";

import Image from "next/image";
import { Suspense, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, refreshSoon, useGSAP } from "@/lib/gsap";
import { onSiteReady, prefersReducedMotion } from "@/lib/site";
import { staggerFrom } from "@/lib/scene";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Stamp } from "@/components/ui/Icons";
import { RectButton } from "@/components/ui/RectButton";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./News.css";

// Scroll distance, in viewport heights, that assembles the section.
const ASSEMBLE_DISTANCE = 1.87;
const MOBILE_REVEAL_DISTANCE = 1;
// Must match where Contact starts: .home-news --scene minus Contact's 225vh overlap.
const COVER_START = 2.2;
const SNAP_THRESHOLD = 0.3;

export function News() {
  const { t, content } = useI18n();
  const copy = t.home.news;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      if (!section) return;

      const reduced = prefersReducedMotion();
      const height = () => window.innerHeight;

      const build = contextSafe!(() => {
        const media = gsap.matchMedia();

        media.add("(min-width: 1025px)", () => {
          const title = section.querySelector<HTMLElement>(".home-news__title");
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
            // A wave across the top edge: the left leads and the right arrives last.
            .fromTo(section, { "--y1": "100%" }, { "--y1": "0%", duration: 2, ease: "quad.inOut" }, 0)
            .fromTo(section, { "--y2": "100%" }, { "--y2": "0%", duration: 2, ease: "quart.inOut" }, 0)
            .fromTo(section, { "--y3": "100%" }, { "--y3": "0%", duration: 1.6, ease: "quart.inOut" }, 0.4)
            .fromTo(section, { "--y4": "100%" }, { "--y4": "0%", duration: 1.4, ease: "quart.inOut" }, 0.6)
            .fromTo(section, { "--y5": "100%" }, { "--y5": "0%", duration: 1.1, ease: "quad.inOut" }, 0.9)
            // Lines draw out of the bottom-left corner of the page.
            .fromTo(section, { "--line-v": 0 }, { "--line-v": 1, duration: 1.75, ease: "quart.inOut" }, 0.2)
            .fromTo(section, { "--line-h": 0 }, { "--line-h": 1, duration: 1.7, ease: "quad.inOut" }, 0.65)
            .from(".home-news__article", { y: () => height() * 0.6, duration: 1.5 }, 0.65)
            .from(".home-news__bt", { y: () => height() * 0.6, duration: 1 }, 1.15)
            // Drops in with a tilt, back to front: the stamp, then each line.
            .add(
              staggerFrom(
                [...gsap.utils.toArray<HTMLElement>(".home-news__title span"), ...gsap.utils.toArray<HTMLElement>(".home-news__stamp")],
                { y: () => -0.65 * (title?.offsetHeight ?? 0), rotation: -5, duration: 1.25, ease: "quad.out" },
                -0.15
              ),
              0.6
            );

          gsap.utils.toArray<HTMLElement>(".home-news__card", section).forEach((card, index) => {
            timeline.from(card, { xPercent: 150, duration: 1.5 }, 0.65 + Math.min(index / 5, 0.4));
          });

          // Falls back as the next scene arrives.
          gsap.to(".home-news__content", {
            yPercent: -40,
            scale: 0.85,
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
            .fromTo(section, { "--y1": "100%" }, { "--y1": "0%", duration: 1 }, 0)
            .fromTo(section, { "--y2": "100%" }, { "--y2": "0%", duration: 1 }, 0)
            .fromTo(section, { "--y3": "100%" }, { "--y3": "0%", duration: 0.8 }, 0.2)
            .fromTo(section, { "--y4": "100%" }, { "--y4": "0%", duration: 0.7 }, 0.3)
            .fromTo(section, { "--y5": "100%" }, { "--y5": "0%", duration: 0.55 }, 0.45);
        });

        refreshSoon();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="home-news scene scene--overlap">
      <div className="stage home-news__stage">
        <div className="home-news__content">
          <div className="home-news__top">
            <div className="home-news__title-wrapper">
              <h2 className="home-news__title display">
                <span>{copy.title[0]}</span>
                <span>{copy.title[1]}</span>
              </h2>
              <Stamp className="home-news__stamp" />
            </div>
          </div>

          <div className="home-news__bottom">
            <div className="home-news__left">
              <article className="home-news__article">
                <h3 className="serif">{copy.subtitle}</h3>
                <p>{copy.text}</p>
              </article>
              <RectButton label={copy.cta} href="/nights" className="home-news__bt" />
            </div>

            <div className="home-news__right" data-cursor="drag">
              <Suspense fallback={null}>
                <Swiper slidesPerView="auto" spaceBetween={36} grabCursor>
                  {content.nights.map((night) => (
                    <SwiperSlide key={night.id} className="home-news__slide">
                      <TransitionLink href={`/nights/${night.id}`} className="home-news__card">
                        <figure>
                          <Image src={night.image} alt={night.title} fill sizes="(max-width: 1024px) 70vw, 30vw" className="cover" />
                        </figure>
                        <h4 className="display">
                          <span>{night.title}</span>
                        </h4>
                        {night.date && <time dateTime={night.date}>{night.date.split("-").reverse().join(".")}</time>}
                      </TransitionLink>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Suspense>
            </div>
          </div>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
