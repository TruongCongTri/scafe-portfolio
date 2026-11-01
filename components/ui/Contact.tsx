"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/site";
import { forms, useContactForm } from "@/components/shell/ContactForms";
import { Arrow } from "./Icons";
import { RectButton } from "./RectButton";
import { TimezoneBar } from "./TimezoneBar";
import "./Contact.css";

const rows = [
  { tone: "red", label: "contact", title: "Get in touch with us", cta: "Contact us", form: forms.contact },
  { tone: "blue", label: "Book a table", title: "Your seat is waiting", cta: "Book now", form: forms.book },
  { tone: "orange", label: "Private hire", title: "Want the whole room?", cta: "Rent the bar", form: forms.private },
];

// Scroll distance, in viewport heights, of the reveal. .contact.scene--overlap
// and the scene before it allow for this, plus the usual 100vh.
const REVEAL_DISTANCE = 1.25;
// Must match where the footer starts: .contact --scene minus its 200vh overlap.
const COVER_START = 1.4;
const SNAP_THRESHOLD = 0.35;

// `flow`: follows a normal-flow section, so there is no pinned scene to overlap.
export function Contact({ flow = false }: { flow?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const openForm = useContactForm();

  useGSAP(
    () => {
      const section = root.current;
      if (!section || flow) return;

      const height = () => window.innerHeight;
      const media = gsap.matchMedia();

      media.add({ desktop: "(min-width: 1025px)", mobile: "(max-width: 1024px)" }, (context) => {
        const snaps = !prefersReducedMotion() && Boolean(context.conditions?.desktop);

        gsap
          .timeline({
            defaults: { ease: "quad.inOut", duration: 2 },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${height() * REVEAL_DISTANCE}`,
              scrub: true,
              invalidateOnRefresh: true,
              snap: snaps
                ? {
                    snapTo: (value, self) => {
                      const forward = self?.direction === 1;
                      return value > (forward ? SNAP_THRESHOLD : 1 - SNAP_THRESHOLD) ? 1 : 0;
                    },
                    duration: 1.25,
                    delay: 0.12,
                    ease: "power1.inOut",
                  }
                : undefined,
              // Rows only take clicks once they are committed to arriving.
              onUpdate: (self) => section.classList.toggle("is-locked", self.progress <= SNAP_THRESHOLD),
            },
          })
          .fromTo(
            section,
            { backgroundColor: "rgba(26, 8, 9, 0)" },
            { backgroundColor: "rgba(26, 8, 9, 0.75)", ease: "quart.inOut" },
            0
          )
          .fromTo(section, { "--y1": "100%" }, { "--y1": "0%" }, 0)
          // Every row starts at the bottom edge, so each travels its own distance
          // and the stack fans open as it rises.
          .fromTo(
            ".contact__row",
            { y: (_index, row: HTMLElement) => height() - row.offsetTop },
            { y: 0 },
            0
          );

        gsap.to(".contact__rows", {
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
    },
    { scope: root }
  );

  return (
    <section ref={root} className={`contact scene ${flow ? "contact--flow" : "scene--overlap is-locked"}`}>
      <div className="stage contact__stage">
        <div className="contact__rows">
          {rows.map((row) => (
            <button
              key={row.tone}
              type="button"
              className={`contact__row contact__row--${row.tone}`}
              onClick={() => openForm(row.form)}
            >
              <span className="contact__inner">
                <Arrow className="contact__ic contact__ic--lead" />
                <span className="contact__copy">
                  <span className="contact__title display">{row.label}</span>
                  <span className="contact__more">
                    <span className="contact__title display">{row.title}</span>
                    <RectButton label={row.cta} decorative className="contact__bt" />
                  </span>
                </span>
                <Arrow className="contact__ic contact__ic--tail" />
              </span>
            </button>
          ))}
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
