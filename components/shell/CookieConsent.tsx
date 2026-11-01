"use client";

import { useEffect, useState } from "react";
import { TransitionLink } from "./TransitionLink";
import { Arrow } from "@/components/ui/Icons";
import "./CookieConsent.css";

const STORAGE_KEY = "scafe-cookies";

const categories = [
  { name: "Essential", text: "Essential cookies enable basic functions and are required for the site to work.", locked: true },
  { name: "Statistics", text: "Statistics cookies anonymously show us how visitors use the site.", locked: false },
  { name: "External Media", text: "External media cookies allow embedded content from music and social platforms.", locked: false },
];

export function CookieConsent() {
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
    <section className="cookies" aria-label="Cookie preferences" data-lenis-prevent>
      <header>
        <div className="cookies__title">
          <h3>Cookie preferences</h3>
          {view === "prefs" && (
            <button type="button" aria-label="Back" onClick={() => setView("main")}>
              &times;
            </button>
          )}
        </div>
        <p>We use cookies to improve your experience and understand how the site is used.</p>
      </header>

      {view === "prefs" && (
        <ul className="cookies__list">
          {categories.map((category) => {
            const on = category.locked || enabled[category.name];
            return (
              <li key={category.name}>
                <div className="cookies__row">
                  <h4>{category.name}</h4>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={category.name}
                    disabled={category.locked}
                    className={`cookies__switch ${on ? "is-on" : ""}`}
                    onClick={() => setEnabled((value) => ({ ...value, [category.name]: !on }))}
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
          Accept all
        </button>
        <button type="button" className="cookies__bt" onClick={decline}>
          Decline
        </button>
        {view === "main" ? (
          <button type="button" className="cookies__bt cookies__bt--full" onClick={() => setView("prefs")}>
            Manage preferences
          </button>
        ) : (
          <button type="button" className="cookies__bt cookies__bt--full" onClick={() => save(enabled)}>
            Save
          </button>
        )}
        {view === "main" && (
          <TransitionLink href="/privacy" className="cookies__more">
            Learn more <Arrow />
          </TransitionLink>
        )}
      </div>
    </section>
  );
}
