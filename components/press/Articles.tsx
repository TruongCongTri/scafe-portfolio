"use client";

import Image from "next/image";
import { useState } from "react";
import { articles } from "@/lib/content";
import { ScrollTrigger } from "@/lib/gsap";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Arrow } from "@/components/ui/Icons";
import "./Articles.css";

const PAGE_SIZE = 4;
const categories = ["All", "Behind The Bar", "Press", "Drinks"];

const countFor = (category: string) =>
  category === "All" ? articles.length : articles.filter((article) => article.category === category).length;

export function Articles() {
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(0);

  const filtered = articles.filter((article) => category === "All" || article.category === category);
  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Section height can change, so pinned scenes further down must re-measure.
  const refreshLater = () => requestAnimationFrame(() => ScrollTrigger.refresh());

  return (
    <section className="articles flow">
      <div className="articles__box box">
        <h2 className="articles__title display">
          What&rsquo;s new at Scafe
          <br />
          you&rsquo;re asking?
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
                  {item}
                  <sup>{countFor(item)}</sup>
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
              <nav className="articles__paging" aria-label="Pages">
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
    </section>
  );
}
