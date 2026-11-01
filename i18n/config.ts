export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";

// Remembers an explicit language choice between visits.
export const LOCALE_COOKIE = "scafe-locale";

// Formats clocks and other values for each language.
export const intlLocales: Record<Locale, string> = { vi: "vi-VN", en: "en-US" };

export const hasLocale = (value: string): value is Locale => locales.includes(value as Locale);

export const withLocale = (locale: Locale, path: string) =>
  path === "/" ? `/${locale}` : `/${locale}${path}`;

export const withoutLocale = (path: string) => {
  const [, first, ...rest] = path.split("/");
  return hasLocale(first) ? `/${rest.join("/")}` : path;
};
