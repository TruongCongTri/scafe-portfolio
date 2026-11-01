"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { locales, withLocale, withoutLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { usePageTransition } from "./PageTransition";
import "./LanguageSwitch.css";

export function LanguageSwitch() {
  const { locale, t } = useI18n();
  const { navigate } = usePageTransition();
  const pathname = usePathname();
  const next = locales.find((item) => item !== locale)!;
  const href = withLocale(next, withoutLocale(pathname));

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    navigate(href, { reload: true });
  };

  return (
    <a href={href} hrefLang={next} lang={next} className="language-switch" aria-label={t.shell.switchLanguage} onClick={handleClick}>
      {next}
    </a>
  );
}
