"use client";

import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { Arrow } from "@/components/ui/Icons";
import "./Cursor.css";

// Contextual follower: elements opt in with data-cursor="play", "pause", "drag" or "close".
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const { cursor } = useI18n().t.shell;

  useGSAP(
    () => {
      const element = root.current;
      if (!element || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const moveX = gsap.quickTo(element, "x", { duration: 0.35, ease: "power3" });
      const moveY = gsap.quickTo(element, "y", { duration: 0.35, ease: "power3" });
      let lastTarget: EventTarget | null = null;
      let lastX = 0;
      let lastY = 0;

      const sync = () => {
        const target = lastTarget instanceof Element ? lastTarget.closest("[data-cursor]") : null;
        element.dataset.mode = target?.getAttribute("data-cursor") ?? "";
      };
      const onMove = (event: PointerEvent) => {
        moveX(event.clientX);
        moveY(event.clientY);
        lastX = event.clientX;
        lastY = event.clientY;
        lastTarget = event.target;
        sync();
      };
      // Scrolling can carry a different element under a still pointer.
      const onScroll = () => {
        lastTarget = document.elementFromPoint(lastX, lastY);
        sync();
      };
      const onDown = () => element.classList.add("is-pressing");
      const onUp = () => element.classList.remove("is-pressing");

      // A target can swap its mode while the pointer stays still.
      const observer = new MutationObserver(sync);
      observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-cursor"] });

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      return () => {
        observer.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <div className="cursor__circle">
        <Arrow className="cursor__ic cursor__ic--play" />
        <span className="cursor__ic cursor__ic--pause" />
        <span className="cursor__ic cursor__ic--drag" />
        <span className="cursor__ic cursor__ic--close" />
      </div>
      <span className="cursor__label cursor__label--play display">{cursor.play}</span>
      <span className="cursor__label cursor__label--pause display">{cursor.pause}</span>
      <span className="cursor__label cursor__label--close display">{cursor.close}</span>
    </div>
  );
}
