"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { site } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/site";
import { RectButton } from "@/components/ui/RectButton";
import "./ContactForms.css";

export type FormConfig = {
  tone: "red" | "blue" | "orange";
  title: string;
  text?: string;
  subject: string;
  messageLabel?: string;
};

export const forms: Record<"contact" | "book" | "private", FormConfig> = {
  contact: { tone: "red", title: "Thank you for reaching out", subject: "Hello from the website" },
  book: { tone: "blue", title: "Tell us when. We'll keep a seat warm", subject: "Table request", messageLabel: "Date, time and party size" },
  private: { tone: "orange", title: "We're looking forward to hosting you", subject: "Private hire", messageLabel: "Tell us about your night" },
};

const FormsContext = createContext<(config: FormConfig) => void>(() => {});

export const useContactForm = () => useContext(FormsContext);

export function ContactForms({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<FormConfig | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);

  const open = useCallback((next: FormConfig) => {
    setConfig(next);
    getLenis()?.stop();
  }, []);

  const close = useCallback(() => {
    gsap.to(".contact-forms__bg", { autoAlpha: 0, duration: 0.3 });
    gsap.to(".contact-forms__panel", {
      xPercent: 100,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        setConfig(null);
        getLenis()?.start();
      },
    });
  }, []);

  useGSAP(
    () => {
      if (!config) return;
      gsap.fromTo(".contact-forms__bg", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
      gsap.fromTo(".contact-forms__panel", { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: "power3.out" });
    },
    { scope: root, dependencies: [config] }
  );

  useEffect(() => {
    if (!config) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [config, close]);

  // There is no backend yet: a valid form opens a prefilled email to the bar.
  const send = () => {
    const element = form.current;
    if (!element || !config || !element.reportValidity()) return;
    const data = new FormData(element);
    const body = `${data.get("message")}\n\n${data.get("name")}\n${data.get("email")}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(config.subject)}&body=${encodeURIComponent(body)}`;
    close();
  };

  const value = useMemo(() => open, [open]);

  return (
    <FormsContext.Provider value={value}>
      {children}
      <div ref={root}>
        {config && (
          <div className="contact-forms" role="dialog" aria-modal="true" aria-label={config.title}>
            <div className="contact-forms__bg" data-cursor="close" onClick={close} />
            <div className={`contact-forms__panel contact-forms__panel--${config.tone}`} data-lenis-prevent>
              <button type="button" className="contact-forms__close" aria-label="Close" onClick={close}>
                &times;
              </button>
              <h3 className="contact-forms__title display">{config.title}</h3>
              {config.text && <p className="contact-forms__text">{config.text}</p>}
              <form ref={form} className="contact-forms__inputs">
                <label>
                  <span>Your name</span>
                  <input type="text" name="name" placeholder="Your name" required autoFocus />
                </label>
                <label>
                  <span>Your email</span>
                  <input type="email" name="email" placeholder="Email" required />
                </label>
                <label>
                  <span>{config.messageLabel ?? "Message"}</span>
                  <textarea name="message" placeholder="Type here" required />
                </label>
              </form>
              <RectButton label="send" className="contact-forms__send" onClick={send} />
            </div>
          </div>
        )}
      </div>
    </FormsContext.Provider>
  );
}
