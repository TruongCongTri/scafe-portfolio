import { Anton, Hanken_Grotesk, Newsreader } from "next/font/google";
import { ContactForms } from "@/components/shell/ContactForms";
import { CookieConsent } from "@/components/shell/CookieConsent";
import { Cursor } from "@/components/shell/Cursor";
import { Footer } from "@/components/shell/Footer";
import { Navbar } from "@/components/shell/Navbar";
import { PageTransition } from "@/components/shell/PageTransition";
import { Preloader } from "@/components/shell/Preloader";
import { PromoPopup } from "@/components/shell/PromoPopup";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { I18nProvider } from "@/i18n/I18nProvider";
import { locales } from "@/i18n/config";
import { getI18n, ogImage } from "@/i18n/server";
import { JsonLd } from "@/components/ui/JsonLd";
import { site, socials } from "@/lib/content";
import "./global.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin", "vietnamese"] });
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin", "vietnamese"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin", "vietnamese"] });

export const viewport = { themeColor: "#6b2324" };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  const { t } = await getI18n();
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.homeTitle, template: `%s | ${site.name}` },
    description: t.meta.description,
    applicationName: site.name,
    openGraph: { siteName: site.name, type: "website", images: [ogImage] },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const { locale, t } = await getI18n();

  return (
    <html lang={locale} className={`is-loading ${anton.variable} ${hanken.variable} ${newsreader.variable}`}>
      <body>
        <noscript>
          <style>{`.preloader{display:none}html.is-loading{overflow:auto}.home-hero{--start:0;--orange-start:1}.home-pours{--x1:0%;--x2:0%}.contact{--y1:0%}.contact.is-locked .contact__stage{pointer-events:auto}.home-room__stage,.home-crew__stage,.home-news__stage{clip-path:none}.home-crew{--start:0}.alley__bg-wrapper,.pillars__box,.partners__wrapper,.about-team__bg-wrapper,.featured__wrapper,.articles__wrapper,.signature__stage,.crew-close__stage,.leads__inner figure{clip-path:none}.home-crew__band,.home-crew__images{display:none}.home-hero__title,.home-hero__copy,.home-hero__arrow{visibility:visible}`}</style>
        </noscript>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BarOrPub",
            name: site.name,
            alternateName: "S... Cafe Bar",
            url: site.url,
            image: `${site.url}${ogImage.url}`,
            description: t.meta.description,
            email: site.email,
            servesCuisine: ["Cocktails", "Coffee"],
            hasMenu: `${site.url}/${locale}/menu`,
            address: {
              "@type": "PostalAddress",
              streetAddress: "60/69 Lý Chính Thắng",
              addressLocality: "Xuân Hòa",
              addressRegion: "Hồ Chí Minh",
              addressCountry: "VN",
            },
            sameAs: socials.map((social) => social.href),
          }}
        />
        <I18nProvider locale={locale} t={t}>
          <SmoothScroll />
          <Preloader />
          <PageTransition>
            <ContactForms>
              <Navbar />
              <Cursor />
              <CookieConsent />
              <PromoPopup />
              <main>{children}</main>
              <Footer />
            </ContactForms>
          </PageTransition>
        </I18nProvider>
      </body>
    </html>
  );
}
