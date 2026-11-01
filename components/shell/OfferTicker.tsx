"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { site } from "@/lib/content";
import { activeOffers, type OfferId } from "@/lib/offers";
import { onSiteReady } from "@/lib/site";
import { TransitionLink } from "./TransitionLink";
import "./OfferTicker.css";

const CHECK_EVERY = 30000;
const CLOSED_KEY = "scafe-ticker-closed";
// Copies per half of the track, so short text still fills wide screens.
const REPEAT = 4;

export function OfferTicker() {
  const { t, content } = useI18n();
  const [offers, setOffers] = useState<OfferId[]>([]);
  const [closed, setClosed] = useState("");
  // The deals pause with their event, so hiding it in the manager stops this too.
  const running = content.nights.some((night) => night.id === "slay");
  const key = offers.join();
  const visible = offers.length > 0 && closed !== key;

  useEffect(() => {
    if (!running) return;
    let timer = 0;
    const check = () => setOffers(activeOffers(site.timeZone));
    const cancel = onSiteReady(() => {
      try {
        setClosed(window.sessionStorage.getItem(CLOSED_KEY) ?? "");
      } catch {
        // Storage blocked: closing just won't last between pages.
      }
      check();
      timer = window.setInterval(check, CHECK_EVERY);
    });
    return () => {
      cancel();
      window.clearInterval(timer);
      setOffers([]);
    };
  }, [running]);

  // Lets fixed and full-height layouts make room for the bar.
  useEffect(() => {
    document.documentElement.classList.toggle("has-ticker", visible);
    return () => document.documentElement.classList.remove("has-ticker");
  }, [visible]);

  if (!visible) return null;

  const close = () => {
    setClosed(key);
    try {
      window.sessionStorage.setItem(CLOSED_KEY, key);
    } catch {
      // Stays closed until the next page load.
    }
  };

  const message = offers.map((offer) => t.offers.items[offer]).join("  •  ");

  return (
    <aside className="ticker" aria-label={t.offers.label}>
      <TransitionLink href="/nights" className="ticker__link" aria-label={`${t.offers.label}: ${message}`}>
        <span className="ticker__track display" aria-hidden="true">
          {Array.from({ length: REPEAT * 2 }, (_, index) => (
            <span key={index}>{message}</span>
          ))}
        </span>
      </TransitionLink>
      <button type="button" className="ticker__close" aria-label={t.offers.close} onClick={close}>
        &times;
      </button>
    </aside>
  );
}
