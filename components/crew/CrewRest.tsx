"use client";

import Image from "next/image";
import { useRef } from "react";
import { crew, crewImages } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./CrewRest.css";

export function CrewRest() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".crew-rest__row");
      const figures = gsap.utils.toArray<HTMLElement>(".crew-rest__images figure");
      const list = root.current?.querySelector<HTMLElement>(".crew-rest__list");
      if (!list || !rows.length) return;

      gsap.fromTo(
        list,
        { y: () => window.innerHeight },
        {
          y: () => -list.offsetHeight,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.min(rows.length - 1, Math.floor(self.progress * rows.length));
              rows.forEach((row, index) => row.classList.toggle("is-active", index === active));
              const picture = active % figures.length;
              figures.forEach((figure, index) => figure.classList.toggle("is-active", index === picture));
            },
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="crew-rest scene">
      <div className="stage crew-rest__stage">
        <h2 className="crew-rest__title display">
          Meet the
          <br />
          rest of
          <br />
          the crew
        </h2>
        <div className="crew-rest__images" aria-hidden="true">
          {crewImages.map((image, index) => (
            <figure key={image} className={index === 0 ? "is-active" : ""}>
              <Image src={image} alt="" fill sizes="16vw" className="cover" />
            </figure>
          ))}
        </div>
        <ul className="crew-rest__list">
          {crew.map((member, index) => (
            <li key={member.name} className="crew-rest__row">
              <span>{index + 1}</span>
              <span className="display">{member.name}</span>
              <span>{member.role}</span>
            </li>
          ))}
        </ul>
        <TimezoneBar />
      </div>
    </section>
  );
}
