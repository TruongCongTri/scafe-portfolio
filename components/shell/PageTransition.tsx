"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, prefersReducedMotion } from "@/lib/site";
import { Logo } from "@/components/ui/Icons";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./PageTransition.css";

const COVER_DURATION = 0.85;
const REVEAL_DURATION = 1.35;
// The dark layer leads in, and the cream layer leaves first.
const LAYER_OFFSET = 0.05;

// One layer's sweep in from the left: the top of the edge leads, the bottom trails.
const coverLayer = (layer: HTMLElement, logo: HTMLElement) =>
  gsap
    .timeline({ paused: true })
    .fromTo(layer, { "--x8": "0%" }, { "--x8": "100%", duration: 2, ease: "quart.inOut" }, 0)
    .fromTo(layer, { "--x7": "0%" }, { "--x7": "100%", duration: 1.8, ease: "quart.inOut" }, 0.2)
    .fromTo(layer, { "--x6": "0%" }, { "--x6": "100%", duration: 1.6, ease: "quad.inOut" }, 0.4)
    .fromTo(layer, { "--x5": "0%" }, { "--x5": "100%", duration: 1.4, ease: "quad.inOut" }, 0.6)
    .fromTo(logo, { "--logo-x": "-6rem" }, { "--logo-x": "0rem", duration: 1.75, ease: "quad.out" }, 0.25);

// One layer's exit to the right, on a steeper slant.
const revealLayer = (layer: HTMLElement, logo: HTMLElement) =>
  gsap
    .timeline({ paused: true })
    .fromTo(
      layer,
      { "--x1": "-20%", "--x4": "0%" },
      { "--x1": "100%", "--x4": "105%", duration: 2, ease: "quart.inOut" },
      0
    )
    .fromTo(logo, { "--logo-x": "0rem" }, { "--logo-x": "15rem", duration: 1.85, ease: "quad.in" }, 0.15);

// `reload` swaps the root layout, which a language change needs.
type NavigateOptions = { reload?: boolean };

type TransitionContextValue = { navigate: (href: string, options?: NavigateOptions) => void };

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => {} });

export const usePageTransition = () => useContext(TransitionContext);

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const shownPath = useRef(pathname);

  const parts = () => {
    const element = overlay.current!;
    return {
      element,
      bg: element.querySelector<HTMLElement>(".page-transition__bg")!,
      wrapper: element.querySelector<HTMLElement>(".page-transition__wrapper")!,
      logo: element.querySelector<HTMLElement>(".page-transition__logo")!,
    };
  };

  const reveal = useCallback(() => {
    const { element, bg, wrapper, logo } = parts();
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(element, { display: "none" });
          getLenis()?.start();
        },
      })
      .fromTo(revealLayer(wrapper, logo), { progress: 0 }, { progress: 1, duration: REVEAL_DURATION, ease: "none" }, 0)
      .fromTo(revealLayer(bg, logo), { progress: 0 }, { progress: 1, duration: REVEAL_DURATION, ease: "none" }, LAYER_OFFSET);
  }, []);

  const navigate = useCallback(
    (href: string, { reload = false }: NavigateOptions = {}) => {
      if (pending.current) return;
      const go = () => (reload ? window.location.assign(href) : router.push(href));
      if (href === pathname) {
        getLenis()?.scrollTo(0);
        return;
      }
      if (prefersReducedMotion()) {
        pending.current = true;
        go();
        return;
      }

      pending.current = true;
      getLenis()?.stop();
      if (!reload) router.prefetch(href);

      const { element, bg, wrapper, logo } = parts();
      gsap.set([bg, wrapper], { "--x1": "0%", "--x4": "0%" });
      gsap.set(element, { display: "block" });
      gsap
        .timeline({ onComplete: go })
        .fromTo(coverLayer(bg, logo), { progress: 0 }, { progress: 1, duration: COVER_DURATION, ease: "none" }, 0)
        .fromTo(coverLayer(wrapper, logo), { progress: 0 }, { progress: 1, duration: COVER_DURATION, ease: "none" }, LAYER_OFFSET);
    },
    [pathname, router]
  );

  // Runs before paint, so the back button can start fully covered with no flash.
  useLayoutEffect(() => {
    if (shownPath.current === pathname) return;
    shownPath.current = pathname;
    const wasPending = pending.current;
    pending.current = false;

    if (wasPending) {
      window.scrollTo(0, 0);
      getLenis()?.scrollTo(0, { immediate: true, force: true });
    }
    ScrollTrigger.refresh();
    if (prefersReducedMotion()) {
      getLenis()?.start();
      return;
    }

    if (!wasPending) {
      const { element, bg, wrapper, logo } = parts();
      getLenis()?.stop();
      gsap.set([bg, wrapper], { "--x1": "0%", "--x4": "0%", "--x5": "100%", "--x6": "100%", "--x7": "100%", "--x8": "100%" });
      gsap.set(logo, { "--logo-x": "0rem" });
      gsap.set(element, { display: "block" });
    }
    reveal();
  }, [pathname, reveal]);

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div ref={overlay} className="page-transition" aria-hidden="true">
        <div className="page-transition__bg" />
        <div className="page-transition__wrapper">
          <VectorGrid />
          <Logo className="page-transition__logo" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
