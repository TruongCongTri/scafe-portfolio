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
import { useI18n } from "@/i18n/I18nProvider";
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

export type FormName = "contact" | "book" | "private";

const tones: Record<FormName, FormConfig["tone"]> = { contact: "red", book: "blue", private: "orange" };

const FormsContext = createContext<(form: FormName | FormConfig) => void>(() => {});

export const useContactForm = () => useContext(FormsContext);

export function ContactForms({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [config, setConfig] = useState<FormConfig | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);

  const open = useCallback(
    (next: FormName | FormConfig) => {
      setConfig(typeof next === "string" ? { tone: tones[next], ...t.forms[next] } : next);
      getLenis()?.stop();
    },
    [t]
  );

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
              <button type="button" className="contact-forms__close" aria-label={t.forms.close} onClick={close}>
                &times;
              </button>
              <h3 className="contact-forms__title display">{config.title}</h3>
              {config.text && <p className="contact-forms__text">{config.text}</p>}
              <form ref={form} className="contact-forms__inputs">
                <label>
                  <span>{t.forms.name}</span>
                  <input type="text" name="name" placeholder={t.forms.name} required autoFocus />
                </label>
                <label>
                  <span>{t.forms.email}</span>
                  <input type="email" name="email" placeholder={t.forms.emailPlaceholder} required />
                </label>
                <label>
                  <span>{config.messageLabel ?? t.forms.message}</span>
                  <textarea name="message" placeholder={t.forms.messagePlaceholder} required />
                </label>
              </form>
              <RectButton label={t.forms.send} className="contact-forms__send" onClick={send} />
            </div>
          </div>
        )}
      </div>
    </FormsContext.Provider>
  );
}
