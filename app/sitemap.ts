import type { MetadataRoute } from "next";
import { locales, withLocale } from "@/i18n/config";
import { site } from "@/lib/content";

const PATHS = ["/", "/menu", "/nights", "/about", "/crew", "/press", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}${withLocale(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(locales.map((item) => [item, `${site.url}${withLocale(item, path)}`])),
      },
    }))
  );
}
