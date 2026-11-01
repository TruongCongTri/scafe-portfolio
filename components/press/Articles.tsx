"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Lines } from "@/components/ui/Lines";
import { categories as articleCategories } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { riseSection } from "@/lib/scene";
import { onSiteReady } from "@/lib/site";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Arrow } from "@/components/ui/Icons";
import "./Articles.css";

const PAGE_SIZE = 4;
const ALL = "all" as const;
const categories = [ALL, ...articleCategories] as const;

type Filter = (typeof categories)[number];

export function Articles() {
  const { t, content } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      if (!section) return;
      const build = contextSafe!(() => {
        gsap.matchMedia().add("(min-width: 1025px)", () => {
          riseSection(section, section.querySelector<HTMLElement>(".articles__wrapper")!);
        });
        ScrollTrigger.refresh();
      });
      return onSiteReady(build);
    },
    { scope: root }
  );

  const { articles } = content;
  const [category, setCategory] = useState<Filter>(ALL);
  const [page, setPage] = useState(0);

  const inCategory = (item: Filter) => articles.filter((article) => item === ALL || article.category === item);
  const filtered = inCategory(category);
  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Section height can change, so pinned scenes further down must re-measure.
  const refreshLater = () => requestAnimationFrame(() => ScrollTrigger.refresh());

  return (
    <section ref={root} className="articles">
      <div className="articles__wrapper">
      <div className="articles__box box">
        <h2 className="articles__title display">
          <Lines lines={t.press.articlesTitle} />
        </h2>
        <div className="articles__content">
          <ul className="articles__categories">
            {categories.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  aria-pressed={item === category}
                  className={item === category ? "is-active" : ""}
                  onClick={() => {
                    setCategory(item);
                    setPage(0);
                    refreshLater();
                  }}
                >
                  <Arrow />
                  {item === ALL ? t.press.all : t.press.categories[item]}
                  <sup>{inCategory(item).length}</sup>
                </button>
              </li>
            ))}
          </ul>

          <div>
            <div className="articles__posts">
              {visible.map((article) => (
                <TransitionLink key={article.slug} href={`/press/${article.slug}`} className="articles__card">
                  <figure>
                    <Image src={article.image} alt="" fill sizes="(max-width: 1024px) 100vw, 30vw" className="cover" />
                  </figure>
                  <h3 className="display">{article.title}</h3>
                  <time>{article.date}</time>
                </TransitionLink>
              ))}
            </div>
            {pages > 1 && (
              <nav className="articles__paging" aria-label={t.press.pages}>
                {Array.from({ length: pages }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-current={index === page ? "page" : undefined}
                    className={index === page ? "is-active" : ""}
                    onClick={() => {
                      setPage(index);
                      refreshLater();
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
