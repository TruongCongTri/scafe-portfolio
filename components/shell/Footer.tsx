"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { site, socials } from "@/lib/content";
import { useGSAP } from "@/lib/gsap";
import { revealScene, SHAPES } from "@/lib/scene";
import { Logo } from "@/components/ui/Icons";
import { VectorGrid } from "@/components/ui/VectorGrid";
import { TransitionLink } from "./TransitionLink";
import "./Footer.css";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { t, content } = useI18n();

  useGSAP(
    () => {
      if (!root.current) return;
      const scenes = document.querySelectorAll("main > .scene");
      revealScene(root.current, SHAPES.shelf, scenes[scenes.length - 1]);
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <footer ref={root} className="footer scene scene--overlap">
      <div className="stage footer__stage box">
        <VectorGrid color="rgba(225, 212, 195, 0.3)" />
        <div className="footer__top">
          <Logo className="footer__logo" />
          <div className="footer__columns">
            <div className="footer__group footer__address">
              <h3>{t.footer.address}</h3>
              <p>{t.site.address}</p>
            </div>
            <div className="footer__navs">
              <div className="footer__group">
                <h3>{t.footer.explore}</h3>
                <nav aria-label={t.shell.footerNav}>
                  {content.nav.map((item) => (
                    <TransitionLink key={item.href} href={item.href}>
                      {item.label}
                    </TransitionLink>
                  ))}
                </nav>
              </div>
              <div className="footer__group">
                <h3>{t.footer.follow}</h3>
                <nav aria-label={t.shell.socialNav}>
                  {socials.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener">
                      {social.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__legal">
            <span>
              {t.footer.copyright} &copy; {site.name} 2026
            </span>
            <TransitionLink href="/privacy">{t.footer.privacy}</TransitionLink>
          </div>
          <div className="footer__group footer__mail">
            <h3>{t.footer.hello}</h3>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
