"use client";

import Image from "next/image";
import { useRef } from "react";
import { pressHighlights } from "@/lib/content";
import { useGSAP } from "@/lib/gsap";
import { revealScene, SHAPES } from "@/lib/scene";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Featured.css";

export function Featured() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (root.current) revealScene(root.current, SHAPES.shelf);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="featured scene scene--overlap">
      <div className="stage featured__stage box">
        <h2 className="featured__title display">
          Scafe
          <br />
          in the press
        </h2>
        <div className="featured__cards">
          {pressHighlights.map((item) => (
            <TransitionLink key={item.href} href={item.href} className="featured__card">
              <figure>
                <Image src={item.image} alt="" fill sizes="(max-width: 1024px) 100vw, 30vw" className="cover" />
              </figure>
              <p className="featured__meta">
                <time>{item.date}</time>
                <span>{item.author}</span>
              </p>
              <h3 className="serif">{item.title}</h3>
            </TransitionLink>
          ))}
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
