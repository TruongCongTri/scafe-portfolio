import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { buildContent } from "@/lib/content";
import { hasLocale, type Locale } from "./config";
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
