"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { withoutLocale } from "@/i18n/config";
import { socials } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/site";
import { Arrow, Logo } from "@/components/ui/Icons";
import { VectorGrid } from "@/components/ui/VectorGrid";
import { LanguageSwitch } from "./LanguageSwitch";
import { TransitionLink } from "./TransitionLink";
import "./Navbar.css";

const MENU_SPEED = 1.25;

export function Navbar() {
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<gsap.core.Timeline>(null);
  const icon = useRef<gsap.core.Timeline>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const path = withoutLocale(pathname);
  const { t, content } = useI18n();

  const showPanel = (visible: boolean) => {
    const panel = root.current?.querySelector<HTMLElement>(".navbar__panel");
    if (panel) panel.style.display = visible ? "block" : "none";
  };

  useGSAP(
    () => {
      const inners = ".navbar__box-inner";

      // Both panels wipe rightward on a bent edge, the top leading.
      const wipe = gsap
        .timeline({ paused: true })
        .fromTo(inners, { "--x1": "0%" }, { "--x1": "100%", duration: 2, ease: "quart.inOut" }, 0)
        .fromTo(inners, { "--x2": "0%" }, { "--x2": "100%", duration: 1.8, ease: "quart.inOut" }, 0.2)
        .fromTo(inners, { "--x3": "0%" }, { "--x3": "100%", duration: 1.6, ease: "quad.inOut" }, 0.4)
        .fromTo(inners, { "--x4": "0%" }, { "--x4": "100%", duration: 1.4, ease: "quad.inOut" }, 0.6);

      menu.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            showPanel(false);
            getLenis()?.start();
          },
        })
        .fromTo(".navbar__bg", { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "quad.inOut" }, 0)
        .fromTo(wipe, { progress: 0 }, { progress: 1, duration: 1, ease: "none" }, 0)
        .fromTo(".navbar__box--right img", { scale: 1.1 }, { scale: 1, duration: 1, ease: "quad.inOut" }, 0)
        .fromTo(
          ".navbar__main .navbar__label",
          { yPercent: -100 },
          { yPercent: 0, duration: 0.6, ease: "quart.out", stagger: 0.075 },
          0.65
        )
        .fromTo(
          ".navbar__social .navbar__label",
          { yPercent: 100 },
          { yPercent: 0, duration: 0.6, ease: "quart.out", stagger: -0.075 },
          0.8
        )
        .timeScale(MENU_SPEED);

      // The bars wipe off in opposite directions, then each X stroke draws in.
      icon.current = gsap
        .timeline({ paused: true, defaults: { duration: 0.3, ease: "quad.inOut" } })
        .fromTo(".navbar__burger span:first-child", { "--clip-right": "0%" }, { "--clip-right": "100%" }, 0)
        .fromTo(".navbar__burger span:last-child", { "--clip-left": "0%" }, { "--clip-left": "100%" }, 0)
        .fromTo(".navbar__x span:last-child", { "--clip-left": "100%" }, { "--clip-left": "0%" }, 0.1)
        .fromTo(".navbar__x span:first-child", { "--clip-right": "100%" }, { "--clip-right": "0%" }, 0.25);

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          root.current?.style.setProperty("--progress", self.progress.toFixed(4));
        },
      });
    },
    { scope: root }
  );

  // Page transitions own the scroller, so a route change must not release it here.
  const closingForRoute = useRef(false);

  useEffect(() => {
    if (open) {
      showPanel(true);
      getLenis()?.stop();
      menu.current?.play();
      icon.current?.play();
    } else if (closingForRoute.current) {
      closingForRoute.current = false;
    } else if (menu.current?.progress()) {
      menu.current.reverse();
      icon.current?.reverse();
    }
  }, [open]);

  // The menu stays up under the cover, then resets out of sight on the new page.
  const [routePath, setRoutePath] = useState(pathname);
  if (pathname !== routePath) {
    setRoutePath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    menu.current?.pause(0);
    icon.current?.pause(0);
    showPanel(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeIfCurrent = (href: string) => {
    if (href === path) setOpen(false);
    else closingForRoute.current = open;
  };

  return (
    <div ref={root} className={`navbar ${open ? "is-open" : ""}`}>
      <div className="navbar__panel" inert={!open}>
        <div className="navbar__bg" />
        <div className="navbar__boxes">
          <div className="navbar__box navbar__box--left">
            <div className="navbar__box-inner">
              <VectorGrid />
              <div className="navbar__navs">
                <nav className="navbar__main" aria-label={t.shell.mainNav}>
                  {content.nav.map((item) => (
                    <TransitionLink
                      key={item.href}
                      href={item.href}
                      className={`navbar__link ${path.startsWith(item.href) ? "is-current" : ""}`}
                      onClick={() => closeIfCurrent(item.href)}
                    >
                      <span className="navbar__label">
                        <Arrow className="navbar__link-ic" />
                        <span>{item.label}</span>
                      </span>
                    </TransitionLink>
                  ))}
                </nav>
                <nav className="navbar__social" aria-label={t.shell.socialNav}>
                  {socials.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener">
                      <span className="navbar__label">{social.label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <figure className="navbar__box navbar__box--right">
            <div className="navbar__box-inner">
              <Image src="/images/back-bar.webp" alt="" fill sizes="50vw" className="cover" />
            </div>
          </figure>
        </div>
      </div>

      <div className="navbar__rail">
        <span className="navbar__progress" aria-hidden="true" />
        <TransitionLink href="/" aria-label={t.shell.homeLabel} className="navbar__home" onClick={() => closeIfCurrent("/")}>
          <Logo className="navbar__logo" />
        </TransitionLink>
        <button
          type="button"
          className="navbar__toggle"
          aria-label={open ? t.shell.closeMenu : t.shell.openMenu}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="navbar__burger" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="navbar__x" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
        <LanguageSwitch />
        <div className="navbar__tip" aria-hidden="true">
          <span>{t.shell.scrollTip}</span>
        </div>
      </div>
    </div>
  );
}
