"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Lines } from "@/components/ui/Lines";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { getLenis, MASK_OFFSET, onSiteReady, prefersReducedMotion } from "@/lib/site";
import { staggerFrom } from "@/lib/scene";
import { Arrow } from "@/components/ui/Icons";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./Hero.css";

// Scroll distance, in viewport heights, that opens the panels fully.
const OPEN_DISTANCE = 1.25;
// Must match where Pours starts: .home-hero --scene minus the 200vh overlap.
const COVER_START = 2;
const POINTER_LERP = 0.05;

const Title = ({ decorative }: { decorative?: boolean }) => {
  const { title } = useI18n().t.home.hero;
  const Tag = decorative ? "div" : "h1";
  return (
    <Tag className="home-hero__title display" aria-hidden={decorative}>
      <Lines lines={title} />
    </Tag>
  );
};

export function Hero() {
  const { t, content } = useI18n();
  const { heroReel } = content;
  const copy = t.home.hero;
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // Only the showing frame and the next are mounted, so the reel loads one photo at a time.
  const [mounted, setMounted] = useState(2);
  const [paused, setPaused] = useState(false);
  const [opened, setOpened] = useState(false);
  const openedRef = useRef(false);

  // Quick-cut reel standing in for footage until the bar has its own video.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % heroReel.length);
      setMounted((count) => Math.min(count + 1, heroReel.length));
    }, 1400);
    return () => window.clearInterval(id);
  }, [paused, heroReel.length]);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      if (!section) return;
      const reduced = prefersReducedMotion();
      const openDistance = () => window.innerHeight * OPEN_DISTANCE;

      const intro = contextSafe!(() => {
        const titles = SplitText.create(".home-hero__title", { type: "words", mask: "words" });
        const lines = SplitText.create(".home-hero__copy h2, .home-hero__copy p", {
          type: "lines",
          mask: "lines",
        });
        gsap.set(".home-hero__title, .home-hero__copy, .home-hero__arrow", { autoAlpha: 1 });

        gsap
          .timeline({
            defaults: { ease: "quart.out" },
            onComplete: () => {
              titles.revert();
              // Rejoined only when it must re-wrap: a late swap counts as a new largest paint.
              window.addEventListener("resize", () => lines.revert(), { once: true });
            },
          })
          .to(section, { "--start": 0, "--orange-start": 1, duration: 1.5, ease: "quart.inOut" }, 0)
          .from(".home-hero__zone", { x: () => window.innerWidth * 0.2, autoAlpha: 0, duration: 0.75 }, 0.85)
          .from(titles.words, { yPercent: MASK_OFFSET, duration: 0.85 }, 1.05)
          .fromTo(".home-hero__arrow .arrow", { xPercent: -100 }, { xPercent: 0, duration: 0.75 }, 1.15)
          .add(staggerFrom(lines.lines, { yPercent: 100, opacity: 0, duration: 0.65, ease: "quart.out" }, 0.035), 1.2)
          .fromTo(".home-hero__play", { scale: 0 }, { scale: 1, duration: 0.5 }, 0.9);
      });

      let cancelIntro = () => {};
      if (reduced) {
        gsap.set(section, { "--start": 0, "--orange-start": 1 });
        gsap.set(".home-hero__title, .home-hero__copy, .home-hero__arrow", { autoAlpha: 1 });
      } else {
        cancelIntro = onSiteReady(intro);
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${openDistance()}`,
            scrub: true,
            invalidateOnRefresh: true,
            snap: reduced
              ? undefined
              : {
                  // Past 20% the panels finish opening on their own, going forward only.
                  snapTo: (value, self) => (self?.direction === 1 && value > 0.2 ? 1 : value),
                  duration: 1.2,
                  ease: "power1.inOut",
                },
            onUpdate: (self) => {
              const next = self.progress > 0.5;
              if (next !== openedRef.current) {
                openedRef.current = next;
                setOpened(next);
                if (!next) setPaused(false);
              }
            },
          },
        })
        .to(section, { "--red": 0, "--orange": 1, "--p": 0, duration: 2, ease: "quad.out" }, 0)
        .to(
          ".home-hero__title",
          {
            y: (_index, target: HTMLElement) =>
              -(target.offsetTop + ((target.offsetParent as HTMLElement | null)?.offsetTop ?? 0) + target.offsetHeight) * 1.1,
            rotation: -2,
            duration: 1.75,
            ease: "quad.inOut",
          },
          0
        )
        .to(
          ".home-hero__arrow",
          {
            x: (_index, target: HTMLElement) => window.innerWidth - target.getBoundingClientRect().left,
            duration: 1.75,
            ease: "quad.inOut",
          },
          0
        )
        .to(".home-hero__copy-inner", { xPercent: -50, duration: 2, ease: "quad.inOut" }, 0);

      // The photo slides away as the next scene wipes over it.
      gsap.to(".home-hero__reel", {
        xPercent: -10,
        ease: "quad.in",
        scrollTrigger: {
          trigger: section,
          start: () => `top+=${window.innerHeight * COVER_START} top`,
          end: () => `+=${window.innerHeight}`,
          scrub: true,
        },
      });

      // The panels lean with the pointer, on a long lag so they feel heavy.
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1025px)");
      if (reduced || !finePointer.matches) return cancelIntro;

      const target = { x: 0, y: 0 };
      const current = { x: 0, y: 0 };
      const onPointer = (event: PointerEvent) => {
        target.x = gsap.utils.clamp(-1, 1, (event.clientX / window.innerWidth) * 2 - 1);
        target.y = gsap.utils.clamp(-1, 1, (event.clientY / window.innerHeight) * 2 - 1);
      };
      const follow = () => {
        if (window.scrollY > openDistance()) return;
        const step = POINTER_LERP * gsap.ticker.deltaRatio();
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        if (Math.abs(dx) + Math.abs(dy) < 0.0005) return;
        current.x += dx * step;
        current.y += dy * step;
        section.style.setProperty("--px", current.x.toFixed(4));
        section.style.setProperty("--py", current.y.toFixed(4));
      };

      window.addEventListener("pointermove", onPointer, { passive: true });
      gsap.ticker.add(follow);

      return () => {
        cancelIntro();
        window.removeEventListener("pointermove", onPointer);
        gsap.ticker.remove(follow);
      };
    },
    { scope: root }
  );

  const onReelClick = () => {
    if (opened) {
      setPaused((value) => !value);
      return;
    }
    const top = (root.current?.offsetTop ?? 0) + window.innerHeight * OPEN_DISTANCE;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(top, { duration: 1.6, lock: true });
    else window.scrollTo({ top });
    ScrollTrigger.update();
  };

  const playing = opened && !paused;
  const label = !opened ? copy.open : paused ? copy.play : copy.pause;

  return (
    <section ref={root} className="home-hero scene">
      <div className="stage home-hero__stage">
        <div className="home-hero__reel">
          {heroReel.slice(0, mounted).map((frame, index) => (
            <Image
              key={frame.src}
              src={frame.src}
              alt={index === 0 ? frame.alt : ""}
              fill
              sizes="100vw"
              preload={index === 0}
              className={`cover ${index === active ? "is-active" : ""}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="home-hero__hit"
          aria-label={label}
          data-cursor={playing ? "pause" : "play"}
          onClick={onReelClick}
        >
          <span className="home-hero__play" aria-hidden="true">
            {playing ? <span className="home-hero__pause-ic" /> : <Arrow />}
          </span>
        </button>

        <div className="home-hero__layer home-hero__layer--cream box">
          <Title />
          <TimezoneBar className="home-hero__zone" />
        </div>

        <div className="home-hero__layer home-hero__layer--red box">
          <Title decorative />
          <article className="home-hero__copy">
            <div className="home-hero__copy-inner">
              <h2 className="serif">{copy.copyTitle}</h2>
              <p>{copy.copyText}</p>
            </div>
          </article>
        </div>

        <div className="home-hero__layer home-hero__layer--orange box">
          <VectorGrid />
          <div className="home-hero__head">
            <Title decorative />
            <div className="home-hero__arrow" aria-hidden="true">
              <Arrow />
            </div>
          </div>
          <TimezoneBar className="home-hero__zone home-hero__zone--ink" />
        </div>
      </div>
    </section>
  );
}
