"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { nav, site, socials } from "@/lib/content";
import { useGSAP } from "@/lib/gsap";
import { revealScene, SHAPES } from "@/lib/scene";
import { Logo } from "@/components/ui/Icons";
import { VectorGrid } from "@/components/ui/VectorGrid";
import { TransitionLink } from "./TransitionLink";
import "./Footer.css";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

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
              <h3>Address</h3>
              <p>{site.address}</p>
            </div>
            <div className="footer__navs">
              <div className="footer__group">
                <h3>Explore</h3>
                <nav aria-label="Footer">
                  {nav.map((item) => (
                    <TransitionLink key={item.href} href={item.href}>
                      {item.label}
                    </TransitionLink>
                  ))}
                </nav>
              </div>
              <div className="footer__group">
                <h3>Follow us</h3>
                <nav aria-label="Social">
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
            <span>Copyright &copy; {site.name} 2026</span>
            <TransitionLink href="/privacy">Privacy</TransitionLink>
          </div>
          <div className="footer__group footer__mail">
            <h3>Say hello</h3>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
