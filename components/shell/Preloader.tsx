"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis, markSiteReady, prefersReducedMotion } from "@/lib/site";
import { Logo } from "@/components/ui/Icons";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./Preloader.css";

const WAVES = [
  "polygon(0% 100%, 22% 100%, 60% 100%, 80% 100%, 100% 100%, 100% 100%, 0% 100%)",
  "polygon(0% 62%, 22% 38%, 60% 56%, 80% 34%, 100% 60%, 100% 100%, 0% 100%)",
  "polygon(0% -10%, 22% -10%, 60% -10%, 80% -10%, 100% -10%, 100% 100%, 0% 100%)",
];

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;

      const finish = () => {
        element.style.display = "none";
        document.documentElement.classList.remove("is-loading");
        getLenis()?.start();
      };

      if (prefersReducedMotion()) {
        markSiteReady();
        finish();
        return;
      }

      const count = { value: 0 };
      const render = () => {
        if (progress.current) progress.current.textContent = `${Math.round(count.value)}%`;
      };

      const leave = () => {
        // The homepage hero opens from the same cream, so hand over with no wipe.
        if (document.querySelector(".home-hero")) {
          gsap.to(".preloader__content", {
            autoAlpha: 0,
            duration: 0.25,
            onComplete: () => {
              finish();
              markSiteReady();
            },
          });
          return;
        }

        markSiteReady();
        gsap
          .timeline({ onComplete: finish })
          .to(".preloader__content", { autoAlpha: 0, duration: 0.25 })
          .to(".preloader__bg", { xPercent: 110, skewX: -14, duration: 0.95, ease: "power3.inOut" }, 0.1)
          .to(element, { backgroundColor: "rgba(107, 35, 36, 0)", duration: 0.5 }, 0.1);
      };

      const fill = gsap
        .timeline()
        .fromTo(".preloader__bg", { clipPath: WAVES[0] }, { clipPath: WAVES[1], duration: 0.7, ease: "power2.out" })
        .to(".preloader__logo, .preloader__text", { autoAlpha: 1, duration: 0.3 }, 0.15)
        .to(count, { value: 100, duration: 1.2, ease: "power1.inOut", onUpdate: render }, 0.1)
        .to(".preloader__bg", { clipPath: WAVES[2], duration: 0.6, ease: "power2.inOut" }, 0.7);

      Promise.all([document.fonts.ready, fill.then()]).then(leave);
    },
    { scope: root }
  );

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="preloader__bg">
        <VectorGrid />
      </div>
      <div className="preloader__content">
        <div className="preloader__text">Pouring</div>
        <Logo className="preloader__logo" />
        <div ref={progress} className="preloader__text">
          0%
        </div>
      </div>
    </div>
  );
}
