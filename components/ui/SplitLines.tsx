"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { onSiteReady } from "@/lib/site";

type SplitLinesProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
};

// Masked line-by-line entrance, played when the element scrolls into view.
export function SplitLines({ as: Tag = "div", className, children, delay = 0 }: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      gsap.set(element, { autoAlpha: 0 });

      let split: SplitText | undefined;
      const cancel = onSiteReady(() => {
        document.fonts.ready.then(() => {
          if (!element.isConnected) return;
          split = SplitText.create(element, { type: "lines", mask: "lines", linesClass: "split-line" });
          gsap.set(element, { autoAlpha: 1 });
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 1,
            delay,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          });
        });
      });

      return () => {
        cancel();
        split?.revert();
      };
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
