import type { MetadataRoute } from "next";
import { locales, withLocale } from "@/i18n/config";
import { getCatalog } from "@/lib/catalogStore";
import { nightIds, realArticleSlugs, site } from "@/lib/content";

const PATHS = ["/", "/menu", "/nights", "/about", "/crew", "/press", "/privacy", ...realArticleSlugs.map((slug) => `/press/${slug}`)];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const events = [...nightIds, ...catalog.addedEvents.map((event) => event.id)]
    .filter((id) => !catalog.removedEvents.includes(id) && !catalog.inactiveEvents.includes(id))
    .map((id) => `/nights/${id}`);

  return [...PATHS, ...events].flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}${withLocale(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(locales.map((item) => [item, `${site.url}${withLocale(item, path)}`])),
      },
    }))
  );
}
