"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isLite, isTouch, prefersReducedMotion, setLenis } from "@/lib/site";

const LITE_KEY = "scafe-lite";
const SAMPLE_FRAMES = 45;
// A typical frame slower than this is under 30 frames a second.
const SLOW_FRAME = 34;

const setLite = () => {
  document.documentElement.classList.add("lite");
  try {
    window.sessionStorage.setItem(LITE_KEY, "1");
  } catch {
    // Storage blocked: the check simply runs again on the next load.
  }
};

const startsLite = () => {
  const { deviceMemory, connection } = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  try {
    if (window.sessionStorage.getItem(LITE_KEY) === "1") return true;
  } catch {
    // Storage blocked: falls through to the hardware check.
  }
  return (deviceMemory ?? 8) <= 2 || navigator.hardwareConcurrency <= 2 || Boolean(connection?.saveData);
};

// Hardware hints miss most phones, so the first stretch of scrolling is timed as well.
function watchFrames() {
  const frames: number[] = [];
  let previous = 0;
  let moved = false;
  let frame = 0;

  const stop = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
  };
  // Only the gap between two frames that both scrolled counts.
  const tick = (time: number) => {
    frame = 0;
    if (!moved) {
      previous = 0;
      return;
    }
    moved = false;
    if (previous) frames.push(time - previous);
    previous = time;
    if (frames.length >= SAMPLE_FRAMES) {
      stop();
      if (frames.sort((a, b) => a - b)[SAMPLE_FRAMES >> 1] > SLOW_FRAME) setLite();
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  const onScroll = () => {
    moved = true;
    if (!frame) frame = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return stop;
}

// Pinned scenes stack on top of each other, so on phones the ones out of view are
// dropped from painting and give back their full-screen layers.
function cullScenes() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.target.classList.toggle("is-offscreen", !entry.isIntersecting)),
    { rootMargin: "25% 0px" }
  );
  const watch = () => document.querySelectorAll(".scene").forEach((scene) => observer.observe(scene));
  watch();
  ScrollTrigger.addEventListener("refresh", watch);
  return () => {
    ScrollTrigger.removeEventListener("refresh", watch);
    observer.disconnect();
    document.querySelectorAll(".is-offscreen").forEach((scene) => scene.classList.remove("is-offscreen"));
  };
}

export function SmoothScroll() {
  useEffect(() => {
    if (!isTouch()) return;
    if (startsLite()) setLite();
    const stopWatching = isLite() ? () => {} : watchFrames();
    const stopCulling = cullScenes();
    return () => {
      stopWatching();
      stopCulling();
    };
  }, []);

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
