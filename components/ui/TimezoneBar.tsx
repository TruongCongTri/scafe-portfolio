"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { intlLocales } from "@/i18n/config";
import { site } from "@/lib/content";
import "./TimezoneBar.css";

export function TimezoneBar({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const clock = useRef<HTMLSpanElement>(null);
  const zone = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const time = new Intl.DateTimeFormat(intlLocales[locale], {
      timeZone: site.timeZone,
      hour: "numeric",
      minute: "2-digit",
    });
    const offset = new Intl.DateTimeFormat(intlLocales[locale], {
      timeZone: site.timeZone,
      timeZoneName: "short",
    });
    const tick = () => {
      const now = new Date();
      if (clock.current) clock.current.textContent = time.format(now);
      if (zone.current) {
        const part = offset.formatToParts(now).find((p) => p.type === "timeZoneName");
        zone.current.textContent = part?.value ?? "";
      }
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [locale]);

  return (
    <div className={`timezone-bar ${className}`} aria-hidden="true">
      <div className="timezone-bar__time">
        <span ref={clock} />
        <span ref={zone} />
      </div>
      <div className="timezone-bar__location">
        {t.site.tagline.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </div>
  );
}
