"use client";

import Image from "next/image";
import { useRef } from "react";
import { nights } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/site";
import { useContactForm } from "@/components/shell/ContactForms";
import { RectButton } from "@/components/ui/RectButton";
import "./Positions.css";

const MARQUEE = "Nights open for sign-up - ".repeat(6);

export function Positions() {
  const root = useRef<HTMLElement>(null);
  const openForm = useContactForm();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to(".positions__track", { xPercent: -50, duration: 24, ease: "none", repeat: -1 });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="positions">
      <div className="positions__marquee display" aria-label="Nights open for sign-up">
        <div className="positions__track" aria-hidden="true">
          <span>{MARQUEE}</span>
          <span>{MARQUEE}</span>
        </div>
      </div>
      {nights.map((night) => (
        <article key={night.title} className="positions__item">
          <figure>
            <Image src={night.image} alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" className="cover" />
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
              label="Sign me up"
              onClick={() =>
                openForm({
                  tone: "orange",
                  title: night.title,
                  text: night.heading,
                  subject: `Sign-up: ${night.title}`,
                  messageLabel: "Tell us about yourself",
                })
              }
            />
          </div>
        </article>
      ))}
    </section>
  );
}
