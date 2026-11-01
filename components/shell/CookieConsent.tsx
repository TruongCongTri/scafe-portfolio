"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { TransitionLink } from "./TransitionLink";
import { Arrow } from "@/components/ui/Icons";
import "./CookieConsent.css";

const STORAGE_KEY = "scafe-cookies";

export function CookieConsent() {
  const { cookies } = useI18n().t;
  const categories = [
    { id: "Essential", ...cookies.essential, locked: true },
    { id: "Statistics", ...cookies.statistics, locked: false },
    { id: "External Media", ...cookies.media, locked: false },
  ];
  const [view, setView] = useState<"hidden" | "main" | "prefs">("hidden");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ Statistics: true, "External Media": true });

  useEffect(() => {
    let stored: string | null = "unavailable";
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage blocked: skip the panel rather than asking on every page.
    }
    if (stored) return;
    const id = window.setTimeout(() => setView("main"), 2600);
    return () => window.clearTimeout(id);
  }, []);

  const save = (choice: Record<string, boolean>) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    } catch {
      // The choice simply won't persist.
    }
    setView("hidden");
  };

  const acceptAll = () => save({ Statistics: true, "External Media": true });
  const decline = () => save({ Statistics: false, "External Media": false });

  if (view === "hidden") return null;

  return (
    <section className="cookies" aria-label={cookies.title} data-lenis-prevent>
      <header>
        <div className="cookies__title">
          <h3>{cookies.title}</h3>
          {view === "prefs" && (
            <button type="button" aria-label={cookies.back} onClick={() => setView("main")}>
              &times;
            </button>
          )}
        </div>
        <p>{cookies.intro}</p>
      </header>

      {view === "prefs" && (
        <ul className="cookies__list">
          {categories.map((category) => {
            const on = category.locked || enabled[category.id];
            return (
              <li key={category.id}>
                <div className="cookies__row">
                  <h4>{category.name}</h4>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={category.name}
                    disabled={category.locked}
                    className={`cookies__switch ${on ? "is-on" : ""}`}
                    onClick={() => setEnabled((value) => ({ ...value, [category.id]: !on }))}
                  />
                </div>
                <p>{category.text}</p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="cookies__actions">
        <button type="button" className="cookies__bt cookies__bt--primary" onClick={acceptAll}>
          {cookies.accept}
        </button>
        <button type="button" className="cookies__bt" onClick={decline}>
          {cookies.decline}
        </button>
        {view === "main" ? (
          <button type="button" className="cookies__bt cookies__bt--full" onClick={() => setView("prefs")}>
            {cookies.manage}
          </button>
        ) : (
          <button type="button" className="cookies__bt cookies__bt--full" onClick={() => save(enabled)}>
            {cookies.save}
          </button>
        )}
        {view === "main" && (
          <TransitionLink href="/privacy" className="cookies__more">
            {cookies.more} <Arrow />
          </TransitionLink>
        )}
      </div>
    </section>
  );
}
