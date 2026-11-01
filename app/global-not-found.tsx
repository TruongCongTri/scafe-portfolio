import { Anton, Hanken_Grotesk } from "next/font/google";
import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import en from "@/i18n/en.json";
import vi from "@/i18n/vi.json";
import "./[locale]/global.css";
import "./[locale]/(site)/not-found.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin", "vietnamese"] });
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin", "vietnamese"] });

export const metadata = { title: `${vi.notFound.title} | ${en.notFound.title}` };

// Runs outside the [locale] layout, so it can't know the language: it shows both.
export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} className={`${anton.variable} ${hanken.variable}`}>
      <body>
        <main>
          <section className="not-found box">
            <h1 className="not-found__title display">{vi.notFound.title}</h1>
            <p>{vi.notFound.text}</p>
            <p lang="en">{en.notFound.text}</p>
            <Link href="/">
              {vi.notFound.cta} / {en.notFound.cta}
            </Link>
          </section>
        </main>
      </body>
    </html>
  );
}
