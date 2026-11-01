"use client";

import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Lines } from "@/components/ui/Lines";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { riseSection } from "@/lib/scene";
import { onSiteReady } from "@/lib/site";
import { TransitionLink } from "@/components/shell/TransitionLink";
import "./Featured.css";

export function Featured() {
  const root = useRef<HTMLElement>(null);
  const { t, content } = useI18n();

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      if (!section) return;
      const build = contextSafe!(() => {
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          riseSection(section, section.querySelector<HTMLElement>(".featured__wrapper")!);
        });
        ScrollTrigger.refresh();
      });
      return onSiteReady(build);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="featured">
      <div className="featured__wrapper">
        <div className="featured__box box">
        <h2 className="featured__title display">
          <Lines lines={t.press.featuredTitle} />
        </h2>
        <div className="featured__cards">
          {content.pressHighlights.map((item) => (
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
        </div>
      </div>
    </section>
  );
}
