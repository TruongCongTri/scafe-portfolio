"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { intlLocales, withLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { pickEvents, todayIn } from "@/lib/events";
import { site, type NightEvent } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { todaysOffers, type Offer } from "@/lib/offers";
import { poster } from "@/lib/posters";
import { getLenis, onSiteReady } from "@/lib/site";
import { Arrow } from "@/components/ui/Icons";
import { RectButton } from "@/components/ui/RectButton";
import { usePageTransition } from "./PageTransition";
import "./PromoPopup.css";

// Holds the bar's local date on which the visitor opted out.
const STORAGE_KEY = "scafe-promo-hidden";
const OPEN_DELAY = 1200;
// The night whose page lists the weekly deals.
const DEALS_ID = "slay";

const CLOSED = "polygon(0% 100%, 25% 100%, 60% 100%, 100% 100%, 100% 100%, 0% 100%)";
const OPEN = "polygon(0% 0%, 25% 0%, 60% 0%, 100% 0%, 100% 100%, 0% 100%)";

type Slide = { kind: "events"; events: NightEvent[] } | { kind: "offer"; offer: Offer };

// Upcoming nights come first, then each of today's deals that hasn't ended.
const buildSlides = (nights: NightEvent[]): Slide[] => {
  const next = pickEvents(nights, todayIn(site.timeZone));
  return [
    ...(next.upcoming ? [{ kind: "events" as const, events: next.events }] : []),
    ...todaysOffers(site.timeZone).map((offer) => ({ kind: "offer" as const, offer })),
  ];
};

export function PromoPopup() {
  const { locale, t, content } = useI18n();
  const { navigate } = usePageTransition();
  const root = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [index, setIndex] = useState(0);
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
        const next = buildSlides(content.nights);
        if (!next.length) return;
        setSlides(next);
        setIndex(0);
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
      if (!slides) return;
      gsap.fromTo(".promo__bg", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
      gsap.fromTo(".promo__panel", { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.8, ease: "quart.inOut" });
    },
    { scope: root, dependencies: [slides] }
  );

  // Each step fades the new slide in where the last one was.
  useGSAP(
    () => {
      if (!slides || index === 0) return;
      gsap.fromTo(".promo__figure img, .promo__slide", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "quad.out" });
    },
    { scope: root, dependencies: [index] }
  );

  const step = useCallback(
    (by: number) => {
      if (!slides || slides.length < 2) return;
      setIndex((current) => (current + by + slides.length) % slides.length);
    },
    [slides]
  );

  const close = useCallback(() => {
    gsap.to(".promo__bg", { autoAlpha: 0, duration: 0.3 });
    gsap.to(".promo__panel", {
      clipPath: CLOSED,
      duration: 0.5,
      ease: "quart.in",
      onComplete: () => {
        setSlides(null);
        getLenis()?.start();
      },
    });
  }, []);

  useEffect(() => {
    if (!slides) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides, close, step]);

  const toggleHidden = (checked: boolean) => {
    setHidden(checked);
    try {
      if (checked) window.localStorage.setItem(STORAGE_KEY, todayIn(site.timeZone));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // The choice simply won't persist.
    }
  };

  const slide = slides?.[index];

  const seeNights = () => {
    let path = "";
    if (slide?.kind === "events" && slide.events.length === 1) path = `/${slide.events[0].id}`;
    if (slide?.kind === "offer" && content.nights.some((night) => night.id === DEALS_ID)) path = `/${DEALS_ID}`;
    setSlides(null);
    getLenis()?.start();
    navigate(withLocale(locale, `/nights${path}`));
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(intlLocales[locale], { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(
      new Date(`${date}T00:00:00Z`)
    );

  const label = slide?.kind === "offer" ? t.offers.label : t.promo.upcoming;
  const many = slide?.kind === "events" && slide.events.length > 1;
  const figure = slide?.kind === "offer" ? poster(slide.offer.image) : slide?.events[0].cover;

  return (
    <div ref={root}>
      {slides && slide && figure && (
        <div className="promo" role="dialog" aria-modal="true" aria-label={label}>
          <div className="promo__bg" data-cursor="close" onClick={close} />
          <div className={`promo__panel ${many ? "promo__panel--many" : ""}`} data-lenis-prevent>
            <figure className="promo__figure">
              <Image
                key={figure.src}
                src={figure.src}
                alt={slide.kind === "events" ? slide.events[0].title : slide.offer.name}
                width={figure.width}
                height={figure.height}
                sizes="(max-width: 1024px) 85vw, 30vw"
              />
            </figure>
            <div className="promo__content">
              <button type="button" className="promo__close" aria-label={t.promo.close} onClick={close}>
                &times;
              </button>
              <div className="promo__top">
                <p className="promo__label display">{label}</p>
                {slides.length > 1 && (
                  <div className="promo__nav">
                    <button type="button" aria-label={t.slider.previous} onClick={() => step(-1)}>
                      <Arrow className="promo__back" />
                    </button>
                    <span aria-live="polite">
                      {index + 1}/{slides.length}
                    </span>
                    <button type="button" aria-label={t.slider.next} onClick={() => step(1)}>
                      <Arrow />
                    </button>
                  </div>
                )}
              </div>
              <ul className="promo__events promo__slide">
                {slide.kind === "events" ? (
                  slide.events.map((event) => (
                    <li key={event.id}>
                      <time dateTime={event.date}>
                        {event.date && formatDate(event.date)}
                        {event.time && ` · ${event.time}`}
                      </time>
                      <h3 className="promo__title display">{event.title}</h3>
                      <p className="serif">{event.heading}</p>
                    </li>
                  ))
                ) : (
                  <li>
                    {/* The wording and the poster already give each deal's day and hours. */}
                    <h3 className="promo__title display">{slide.offer.name}</h3>
                    <p className="serif">{t.offers.items[slide.offer.id]}</p>
                  </li>
                )}
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
