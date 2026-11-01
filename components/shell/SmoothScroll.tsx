"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, setLenis } from "@/lib/site";

export function SmoothScroll() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    if (prefersReducedMotion()) {
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({
      lerp: 0.11,
      // Fractional deltas (display scaling, trackpads) can stop Lenis ever settling,
      // and the section snaps wait for it to settle.
      virtualScroll: (data) => {
        data.deltaY = Math.round(data.deltaY);
        return true;
      },
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    setLenis(lenis);
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
