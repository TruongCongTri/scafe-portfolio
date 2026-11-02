"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { gsap, refreshSoon, useGSAP } from "@/lib/gsap";
import { onSiteReady, prefersReducedMotion } from "@/lib/site";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { EventAsk } from "./EventAsk";
import "./Positions.css";

export function Positions() {
  const root = useRef<HTMLElement>(null);
  const { t, content } = useI18n();
  const marquee = `${t.nights.marquee} - `.repeat(6);

  useGSAP(
    (_context, contextSafe) => {
      if (!prefersReducedMotion()) {
        gsap.to(".positions__track", {
          xPercent: -50,
          duration: 30,
          ease: "none",
          repeat: -1,
          scrollTrigger: { trigger: ".positions__marquee", toggleActions: "play pause resume pause" },
        });
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
        refreshSoon();
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
            <article key={night.id} className="positions__item">
              <figure>
                <TransitionLink href={`/nights/${night.id}`} aria-label={`${t.nights.details}: ${night.title}`}>
                  <Image src={night.cover.src} alt={night.title} width={night.cover.width} height={night.cover.height} sizes="(max-width: 1024px) 100vw, 50vw" />
                </TransitionLink>
              </figure>
              <div className="positions__content">
                <header>
                  <h2 className="display">
                    <TransitionLink href={`/nights/${night.id}`}>{night.title}</TransitionLink>
                  </h2>
                  <h3 className="serif">{night.heading}</h3>
                </header>
                <p>{night.text}</p>
                <ul>
                  {night.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
                <div className="positions__actions">
                  <EventAsk title={night.title} heading={night.heading} />
                  <TransitionLink href={`/nights/${night.id}`} className="positions__details display">
                    {t.nights.details}
                  </TransitionLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
