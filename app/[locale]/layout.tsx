import { Anton, Hanken_Grotesk, Newsreader } from "next/font/google";
import { ContactForms } from "@/components/shell/ContactForms";
import { CookieConsent } from "@/components/shell/CookieConsent";
import { Cursor } from "@/components/shell/Cursor";
import { Footer } from "@/components/shell/Footer";
import { Navbar } from "@/components/shell/Navbar";
import { PageTransition } from "@/components/shell/PageTransition";
import { Preloader } from "@/components/shell/Preloader";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { I18nProvider } from "@/i18n/I18nProvider";
import { locales } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { site } from "@/lib/content";
import "swiper/css";
import "./global.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin", "vietnamese"] });
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin", "vietnamese"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin", "vietnamese"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  const { t } = await getI18n();
  return {
    title: { default: t.meta.homeTitle, template: `%s | ${site.name}` },
    description: t.meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const { locale, t } = await getI18n();

  return (
    <html lang={locale} className={`is-loading ${anton.variable} ${hanken.variable} ${newsreader.variable}`}>
      <body>
        <noscript>
          <style>{`.preloader{display:none}html.is-loading{overflow:auto}.home-hero{--start:0;--orange-start:1}.home-pours{--x1:0%;--x2:0%}.contact{--y1:0%}.contact.is-locked .contact__stage{pointer-events:auto}.home-room__stage,.home-crew__stage,.home-news__stage{clip-path:none}.home-crew{--start:0}.signature__stage,.crew-close__stage,.leads__inner figure{clip-path:none}.home-crew__band,.home-crew__images{display:none}.home-hero__title,.home-hero__copy,.home-hero__arrow{visibility:visible}`}</style>
        </noscript>
        <I18nProvider locale={locale} t={t}>
          <SmoothScroll />
          <Preloader />
          <PageTransition>
            <ContactForms>
              <Navbar />
              <Cursor />
              <CookieConsent />
              <main>{children}</main>
              <Footer />
            </ContactForms>
          </PageTransition>
        </I18nProvider>
      </body>
    </html>
  );
}
