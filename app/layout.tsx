import type { Metadata } from "next";
import { Anton, Hanken_Grotesk, Newsreader } from "next/font/google";
import { ContactForms } from "@/components/shell/ContactForms";
import { CookieConsent } from "@/components/shell/CookieConsent";
import { Cursor } from "@/components/shell/Cursor";
import { Footer } from "@/components/shell/Footer";
import { Navbar } from "@/components/shell/Navbar";
import { PageTransition } from "@/components/shell/PageTransition";
import { Preloader } from "@/components/shell/Preloader";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { site } from "@/lib/content";
import "swiper/css";
import "./global.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${site.name} | Cocktail bar`, template: `%s | ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`is-loading ${anton.variable} ${hanken.variable} ${newsreader.variable}`}>
      <body>
        <noscript>
          <style>{`.preloader{display:none}html.is-loading{overflow:auto}.home-hero{--start:0;--orange-start:1}.home-pours{--x1:0%;--x2:0%}.contact{--y1:0%}.contact.is-locked .contact__stage{pointer-events:auto}.home-room__stage,.home-crew__stage,.home-news__stage{clip-path:none}.home-crew{--start:0}.home-crew__band,.home-crew__images{display:none}.home-hero__title,.home-hero__copy,.home-hero__arrow{visibility:visible}`}</style>
        </noscript>
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
      </body>
    </html>
  );
}
