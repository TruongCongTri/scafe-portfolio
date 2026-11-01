import { Anton, Hanken_Grotesk, Newsreader } from "next/font/google";
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
  const { locale, t, catalog } = await getI18n();

  return (
    <html lang={locale} className={`is-loading ${anton.variable} ${hanken.variable} ${newsreader.variable}`}>
      <body>
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
        <I18nProvider locale={locale} t={t} catalog={catalog}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
