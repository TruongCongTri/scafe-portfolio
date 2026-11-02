"use client";

import type Lenis from "lenis";

// Module-level handles shared by the shell and the page sections.
let lenis: Lenis | null = null;
let ready = false;
const readyCallbacks = new Set<() => void>();

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

export const markSiteReady = () => {
  ready = true;
  readyCallbacks.forEach((callback) => callback());
  readyCallbacks.clear();
};

// Runs once the preloader has finished, or immediately if it already has.
export const onSiteReady = (callback: () => void) => {
  if (ready) {
    callback();
    return () => {};
  }
  readyCallbacks.add(callback);
  return () => {
    readyCallbacks.delete(callback);
  };
};

// How far, in percent of its own height, masked text starts from its place. Stacked
// Vietnamese marks rise above the line box, so one full height would leave them showing.
export const MASK_OFFSET = 125;

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

// Set for weak phones, up front or once scrolling proves slow. Decoration then holds still.
export const isLite = () => document.documentElement.classList.contains("lite");
