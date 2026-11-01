"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onSiteReady, prefersReducedMotion } from "@/lib/site";
import { useContactForm } from "@/components/shell/ContactForms";
import { RectButton } from "@/components/ui/RectButton";
import "./Positions.css";

export function Positions() {
  const root = useRef<HTMLElement>(null);
  const openForm = useContactForm();
  const { t, content } = useI18n();
  const marquee = `${t.nights.marquee} - `.repeat(6);

  useGSAP(
    (_context, contextSafe) => {
      if (!prefersReducedMotion()) {
        gsap.to(".positions__track", { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
      }

      const build = contextSafe!(() => {
        // The list settles upward into place as it arrives.
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          gsap.fromTo(
            ".positions__list",
            { "--y": "-10%" },
            {
              "--y": "0%",
              ease: "quad.out",
              scrollTrigger: { trigger: ".positions__box", start: "top bottom", end: "top center", scrub: true, invalidateOnRefresh: true },
            }
          );
        });
        ScrollTrigger.refresh();
      });

      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="positions">
      <div className="positions__marquee display" aria-label={t.nights.marquee}>
        <div className="positions__track" aria-hidden="true">
          <span>{marquee}</span>
          <span>{marquee}</span>
        </div>
      </div>
      <div className="positions__box">
        <div className="positions__list">
          {content.nights.map((night) => (
            <article key={night.title} className="positions__item">
              <figure>
                <Image src={night.image} alt={night.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="cover" />
              </figure>
              <div className="positions__content">
                <header>
                  <h2 className="display">{night.title}</h2>
                  <h3 className="serif">{night.heading}</h3>
                </header>
                <p>{night.text}</p>
                <ul>
                  {night.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
                <RectButton
                  label={t.nights.signUp}
                  onClick={() =>
                    openForm({
                      tone: "orange",
                      title: night.title,
                      text: night.heading,
                      subject: `${t.nights.signUpSubject} ${night.title}`,
                      messageLabel: t.nights.signUpMessage,
                    })
                  }
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
