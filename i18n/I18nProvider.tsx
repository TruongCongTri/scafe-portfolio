"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { buildContent, type Content } from "@/lib/content";
import type { Locale } from "./config";
import type en from "./en.json";

type I18n = { locale: Locale; t: typeof en; content: Content };

const I18nContext = createContext<I18n | null>(null);

export const useI18n = () => {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
};

export function I18nProvider({
  locale,
  t,
  children,
}: {
  locale: Locale;
  t: typeof en;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, t, content: buildContent(t) }), [locale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
