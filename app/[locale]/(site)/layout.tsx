import { ContactForms } from "@/components/shell/ContactForms";
import { CookieConsent } from "@/components/shell/CookieConsent";
import { Cursor } from "@/components/shell/Cursor";
import { Footer } from "@/components/shell/Footer";
import { Navbar } from "@/components/shell/Navbar";
import { OfferTicker } from "@/components/shell/OfferTicker";
import { PageTransition } from "@/components/shell/PageTransition";
import { Preloader } from "@/components/shell/Preloader";
import { PromoPopup } from "@/components/shell/PromoPopup";
import { SmoothScroll } from "@/components/shell/SmoothScroll";

export default function SiteLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <>
      <noscript>
        <style>{`.preloader{display:none}html.is-loading{overflow:auto}.home-hero{--start:0;--orange-start:1}.home-pours{--x1:0%;--x2:0%}.contact{--y1:0%}.contact.is-locked .contact__stage{pointer-events:auto}.home-room__stage,.home-crew__stage,.home-news__stage{clip-path:none}.home-crew{--start:0}.alley__bg-wrapper,.pillars__box,.partners__wrapper,.about-team__bg-wrapper,.featured__wrapper,.articles__wrapper,.signature__stage,.crew-close__stage,.leads__inner figure{clip-path:none}.home-crew__band,.home-crew__images{display:none}.home-hero__title,.home-hero__copy,.home-hero__arrow{visibility:visible}`}</style>
      </noscript>
      <SmoothScroll />
      <Preloader />
      <PageTransition>
        <ContactForms>
          <Navbar />
          <Cursor />
          <CookieConsent />
          <PromoPopup />
          <OfferTicker />
          <main>{children}</main>
          <Footer />
        </ContactForms>
      </PageTransition>
    </>
  );
}
