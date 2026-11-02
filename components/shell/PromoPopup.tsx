"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { intlLocales, withLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { pickEvents, todayIn } from "@/lib/events";
import { site } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis, onSiteReady } from "@/lib/site";
import { RectButton } from "@/components/ui/RectButton";
import { usePageTransition } from "./PageTransition";
import "./PromoPopup.css";

// Holds the bar's local date on which the visitor opted out.
const STORAGE_KEY = "scafe-promo-hidden";
const OPEN_DELAY = 1200;

const CLOSED = "polygon(0% 100%, 25% 100%, 60% 100%, 100% 100%, 100% 100%, 0% 100%)";
const OPEN = "polygon(0% 0%, 25% 0%, 60% 0%, 100% 0%, 100% 100%, 0% 100%)";

export function PromoPopup() {
  const { locale, t, content } = useI18n();
  const { navigate } = usePageTransition();
  const root = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ReturnType<typeof pickEvents<(typeof content.nights)[number]>> | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const today = todayIn(site.timeZone);
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === today) return;
    } catch {
      // Storage blocked: the popup just can't remember the choice.
    }

    let timer = 0;
    const cancel = onSiteReady(() => {
      timer = window.setTimeout(() => {
        const next = pickEvents(content.nights, today);
        if (!next.events.length) return;
        setView(next);
        getLenis()?.stop();
      }, OPEN_DELAY);
    });
    return () => {
      cancel();
      window.clearTimeout(timer);
    };
  }, [content.nights]);

  useGSAP(
    () => {
      if (!view) return;
      gsap.fromTo(".promo__bg", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
      gsap.fromTo(".promo__panel", { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.8, ease: "quart.inOut" });
    },
    { scope: root, dependencies: [view] }
  );

  const close = useCallback(() => {
    gsap.to(".promo__bg", { autoAlpha: 0, duration: 0.3 });
    gsap.to(".promo__panel", {
      clipPath: CLOSED,
      duration: 0.5,
      ease: "quart.in",
      onComplete: () => {
        setView(null);
        getLenis()?.start();
      },
    });
  }, []);

  useEffect(() => {
    if (!view) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, close]);

  const toggleHidden = (checked: boolean) => {
    setHidden(checked);
    try {
      if (checked) window.localStorage.setItem(STORAGE_KEY, todayIn(site.timeZone));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // The choice simply won't persist.
    }
  };

  const seeNights = () => {
    const single = view?.events.length === 1 ? `/${view.events[0].id}` : "";
    setView(null);
    getLenis()?.start();
    navigate(withLocale(locale, `/nights${single}`));
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(intlLocales[locale], { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(
      new Date(`${date}T00:00:00Z`)
    );

  return (
    <div ref={root}>
      {view && (
        <div className="promo" role="dialog" aria-modal="true" aria-label={view.upcoming ? t.promo.upcoming : t.promo.latest}>
          <div className="promo__bg" data-cursor="close" onClick={close} />
          <div className={`promo__panel ${view.events.length > 1 ? "promo__panel--many" : ""}`} data-lenis-prevent>
            <figure className="promo__figure">
              <Image src={view.events[0].image} alt={view.events[0].title} width={1200} height={1500} sizes="(max-width: 1024px) 40vw, 30vw" />
            </figure>
            <div className="promo__content">
              <button type="button" className="promo__close" aria-label={t.promo.close} onClick={close}>
                &times;
              </button>
              <p className="promo__label display">{view.upcoming ? t.promo.upcoming : t.promo.latest}</p>
              <ul className="promo__events">
                {view.events.map((event) => (
                  <li key={event.id}>
                    <time dateTime={event.date}>
                      {formatDate(event.date)}
                      {event.time && ` · ${event.time}`}
                    </time>
                    <h3 className="promo__title display">{event.title}</h3>
                    <p className="serif">{event.heading}</p>
                  </li>
                ))}
              </ul>
              <RectButton label={t.promo.cta} className="promo__bt" onClick={seeNights} />
              <label className="promo__hide">
                <input type="checkbox" checked={hidden} onChange={(event) => toggleHidden(event.target.checked)} />
                <span>{t.promo.hide}</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
