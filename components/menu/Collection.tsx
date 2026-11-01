"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { ScrollTrigger } from "@/lib/gsap";
import type { Content } from "@/lib/content";
import { SplitLines } from "@/components/ui/SplitLines";
import "./Collection.css";

type MenuName = keyof Content["menus"];

const MENUS: MenuName[] = ["evening", "morning"];

export function Collection() {
  const { t, content } = useI18n();
  const [active, setActive] = useState<MenuName>("evening");
  const copy = t.menu[active];

  const choose = (name: MenuName) => {
    setActive(name);
    // The list changes height, so pinned scenes further down must re-measure.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <section className="collection">
      <div className="collection__inner box">
        <SplitLines as="h2" className="collection__title display">
          {t.menu.collectionTitle}
        </SplitLines>
        <div className="collection__tabs">
          {MENUS.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={name === active}
              className={`display ${name === active ? "is-active" : ""}`}
              onClick={() => choose(name)}
            >
              {t.menu[name].tab}
            </button>
          ))}
        </div>
        <header className="collection__header">
          <h3 className="serif">{copy.subtitle}</h3>
          <p>{copy.text}</p>
        </header>

        {content.menus[active].map((group) => {
          const pictured = group.items.some((item) => item.image);
          return (
            <section key={group.title} className="collection__group">
              <h3 className="collection__group-title display">{group.title}</h3>
              <ul className={pictured ? "collection__cards" : "collection__rows"}>
                {group.items.map((item) => (
                  <li key={item.name} className="collection__item">
                    {item.image && (
                      <figure>
                        <Image src={item.image} alt="" fill sizes="(max-width: 1024px) 50vw, 22vw" className="cover" />
                      </figure>
                    )}
                    <div className="collection__meta">
                      <span className="display">{item.name}</span>
                      <span className="display">{item.price}</span>
                    </div>
                    {item.note && <p className="collection__note">{item.note}</p>}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {copy.footnote && <p className="collection__footnote">{copy.footnote}</p>}
        <a href="/images/CREDITS.md" className="collection__credits">
          {t.menu.credits}
        </a>
      </div>
    </section>
  );
}
