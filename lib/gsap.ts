"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// The phone address bar changes the height as it slides, which must not re-measure the page.
ScrollTrigger.config({ ignoreMobileResize: true });

let refreshFrame = 0;

// Every section builds at once when the site opens, and one measure covers them all.
export const refreshSoon = () => {
  if (refreshFrame) return;
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0;
    ScrollTrigger.refresh();
  });
};

export { gsap, ScrollTrigger, SplitText, useGSAP };
