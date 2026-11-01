"use client";

import Image from "next/image";
import { useRef } from "react";
import { partners } from "@/lib/content";
import { useGSAP } from "@/lib/gsap";
import { revealScene, sceneTimeline, SHAPES } from "@/lib/scene";
import { forms, useContactForm } from "@/components/shell/ContactForms";
import { RectButton } from "@/components/ui/RectButton";
import { Stamp } from "@/components/ui/Icons";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Partners.css";

export function Partners() {
  const root = useRef<HTMLElement>(null);
  const openForm = useContactForm();

  useGSAP(
    () => {
      if (!root.current) return;
      revealScene(root.current, SHAPES.ridge);
      sceneTimeline(root.current, 1.5, 2.8).fromTo(
        ".partners__photo",
        { clipPath: "polygon(50% 0%, 50% 0%, 50% 50%, 50% 100%, 50% 100%)" },
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 100% 100%, 0% 100%)", duration: 0.7 }
      ).from(".partners__overlay > *", { autoAlpha: 0, y: 40, stagger: 0.08, duration: 0.2 }, 0.65);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="partners scene scene--overlap">
      <div className="stage partners__stage box">
        <div className="partners__left">
          <h2 className="partners__title display">
            Serious drinks.
            <br />
            Serious partners.
          </h2>
          <RectButton label="Partner with us" onClick={() => openForm(forms.contact)} />
        </div>
        <div className="partners__right">
          <h3 className="partners__subtitle serif">
            Together with growers, makers and musicians who share our obsession, we build evenings that delight.
          </h3>
          <ul>
            {partners.map((partner) => (
              <li key={partner.name}>
                <Stamp />
                <div>
                  <h4 className="display">{partner.name}</h4>
                  <p>{partner.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="partners__photo">
          <Image src="/images/taps-room.webp" alt="A busy back bar" fill sizes="100vw" className="cover" />
          <div className="partners__overlay">
            <h2 className="display">
              Great drinks require
              <br />
              great hands
            </h2>
            <RectButton label="Meet the crew" href="/crew" />
          </div>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
