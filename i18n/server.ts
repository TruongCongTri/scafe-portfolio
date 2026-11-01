import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { buildContent, site } from "@/lib/content";
import { defaultLocale, hasLocale, locales, withLocale, type Locale } from "./config";
import en from "./en.json";
import vi from "./vi.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, vi };

export const getI18n = async () => {
  const locale = await rootLocale();
  if (!hasLocale(locale)) notFound();
  const t = dictionaries[locale];
  return { locale, t, content: buildContent(t) };
};

export const ogImage = { url: "/images/og.jpg", width: 1200, height: 630 };

// Canonical, language alternates and share cards for one page.
export const pageMetadata = async (path: string, title: string, description: string, absolute = false): Promise<Metadata> => {
  const { locale } = await getI18n();
  const shareTitle = absolute ? title : `${title} | ${site.name}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: withLocale(locale, path),
      languages: {
        ...Object.fromEntries(locales.map((item) => [item, withLocale(item, path)])),
        "x-default": withLocale(defaultLocale, path),
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: shareTitle,
      description,
      url: withLocale(locale, path),
      locale: locale === "vi" ? "vi_VN" : "en_US",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [ogImage.url] },
  };
};
