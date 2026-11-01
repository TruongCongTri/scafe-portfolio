"use client";

import { gsap, ScrollTrigger } from "./gsap";

// Every scene is a tall section with a sticky 100vh stage. Sections overlap by
// 200vh (see .scene in global.css), so the incoming stage is revealed by a
// clip-path while the previous one is still pinned underneath it.

export const FULL = "polygon(0% 0%, 25% 0%, 60% 0%, 100% 0%, 100% 100%, 0% 100%)";

export const SHAPES = {
  // Slanted wipe entering from the right edge.
  right: "polygon(100% 0%, 125% 0%, 160% 0%, 200% 0%, 130% 100%, 130% 100%)",
  // Mountain ridge rising from the bottom edge.
  ridge: "polygon(0% 100%, 25% 112%, 60% 100%, 100% 118%, 100% 120%, 0% 120%)",
  // Uneven shelf rising from the bottom edge.
  shelf: "polygon(0% 112%, 25% 100%, 60% 106%, 100% 124%, 100% 130%, 0% 130%)",
  // Mid-ridge step, used so the shape reads before it fills the screen.
  ridgeMid: "polygon(0% 92%, 25% 62%, 60% 30%, 100% 66%, 100% 120%, 0% 120%)",
};

// Timeline covering the first 100vh of a scene, dimming the scene below it.
export function enterTimeline(section: HTMLElement, previousScene?: Element | null) {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight}`,
      scrub: true,
    },
    defaults: { ease: "none" },
  });

  const previous = (previousScene ?? section.previousElementSibling)?.querySelector(
    ":scope > .stage"
  );
  if (previous) {
    timeline.fromTo(
      previous,
      { filter: "brightness(1)" },
      { filter: "brightness(0.3)", duration: 1, immediateRender: false },
      0
    );
  }
  return timeline;
}

export function revealScene(section: HTMLElement, from: string, previousScene?: Element | null) {
  const timeline = enterTimeline(section, previousScene);
  const stage = section.querySelector<HTMLElement>(":scope > .stage");
  if (stage) timeline.fromTo(stage, { clipPath: from }, { clipPath: FULL, duration: 1 }, 0);
  return timeline;
}

// Timeline scrubbed across the section's dwell, after its reveal has finished.
// A `stagger` on `.from()` leaves every target but the first at its end state until
// its turn, so text shows early. Separate tweens each take their start state at once.
// A negative `each` runs from the last target back, as `stagger` does.
export function staggerFrom(targets: gsap.DOMTarget, vars: gsap.TweenVars, each: number) {
  const items = gsap.utils.toArray<HTMLElement>(targets);
  const timeline = gsap.timeline();
  items.forEach((item, index) => {
    timeline.from(item, vars, each * (each < 0 ? index - items.length + 1 : index));
  });
  return timeline;
}

// A section that scrolls normally but rises on a wavy edge held to the viewport
// bottom: --end tracks that bottom in the section's own coordinates. Once risen, the
// clip comes off so nothing in the section can be cut.
export function trackViewportEnd(element: HTMLElement) {
  const setEnd = () => {
    element.style.setProperty("--end", `${window.innerHeight - element.getBoundingClientRect().top}px`);
  };
  setEnd();
  ScrollTrigger.create({ trigger: element, start: "top bottom", end: "bottom top", onUpdate: setEnd, onRefresh: setEnd });
}

export function riseSection(section: HTMLElement, wrapper: HTMLElement) {
  trackViewportEnd(section);

  const clip = (value: string) => () => {
    wrapper.style.clipPath = value;
  };
  return gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight}`,
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: clip(""),
        onEnterBack: clip(""),
        onLeave: clip("unset"),
        onLeaveBack: clip(""),
      },
    })
    .fromTo(
      section,
      { backgroundColor: "rgba(26, 8, 9, 0)" },
      { backgroundColor: "rgba(26, 8, 9, 0.75)", duration: 2, ease: "quart.inOut" },
      0
    )
    .fromTo(section, { "--y1": 0 }, { "--y1": 1, duration: 2, ease: "quad.inOut" }, 0)
    .fromTo(section, { "--y2": 0 }, { "--y2": 1, duration: 1.85, ease: "quad.inOut" }, 0.15)
    .fromTo(section, { "--y3": 0 }, { "--y3": 1, duration: 1.7, ease: "quad.inOut" }, 0.3)
    .fromTo(section, { "--y4": 0 }, { "--y4": 1, duration: 1.5, ease: "quad.inOut" }, 0.5)
    .fromTo(section, { "--y5": 0 }, { "--y5": 1, duration: 1.25, ease: "quad.inOut" }, 0.75);
}

export function sceneTimeline(section: HTMLElement, start = 1, end = 2) {
  return gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: () => `top+=${window.innerHeight * start} top`,
      end: () => `top+=${window.innerHeight * end} top`,
      scrub: true,
    },
    defaults: { ease: "none" },
  });
}
