"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Lines } from "@/components/ui/Lines";
import { useGSAP } from "@/lib/gsap";
import { revealScene, sceneTimeline, SHAPES, staggerFrom } from "@/lib/scene";
import { useContactForm } from "@/components/shell/ContactForms";
import { RectButton } from "@/components/ui/RectButton";
import { Stamp } from "@/components/ui/Icons";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Partners.css";

export function Partners() {
  const root = useRef<HTMLElement>(null);
  const openForm = useContactForm();
  const { t, content } = useI18n();
  const copy = t.about.partners;

  useGSAP(
    () => {
      if (!root.current) return;
      revealScene(root.current, SHAPES.ridge);
      sceneTimeline(root.current, 1.5, 2.8).fromTo(
        ".partners__photo",
        { clipPath: "polygon(50% 0%, 50% 0%, 50% 50%, 50% 100%, 50% 100%)" },
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 100% 100%, 0% 100%)", duration: 0.7 }
      ).add(staggerFrom(".partners__overlay > *", { autoAlpha: 0, y: 40, duration: 0.2, ease: "none" }, 0.08), 0.65);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="partners scene scene--overlap">
      <div className="stage partners__stage box">
        <div className="partners__left">
          <h2 className="partners__title display">
            <Lines lines={copy.title} />
          </h2>
          <RectButton label={copy.cta} onClick={() => openForm("contact")} />
        </div>
        <div className="partners__right">
          <h3 className="partners__subtitle serif">{copy.subtitle}</h3>
          <ul>
            {content.partners.map((partner) => (
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
          <Image src="/images/taps-room.webp" alt={copy.photoAlt} fill sizes="100vw" className="cover" />
          <div className="partners__overlay">
            <h2 className="display">
              <Lines lines={copy.photoTitle} />
            </h2>
            <RectButton label={copy.photoCta} href="/crew" />
          </div>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
