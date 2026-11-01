"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { useContactForm } from "@/components/shell/ContactForms";
import { Arrow } from "@/components/ui/Icons";
import { RectButton } from "@/components/ui/RectButton";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./NightsHero.css";

export function NightsHero() {
  const openForm = useContactForm();
  const { nights } = useI18n().t;

  return (
    <section className="nights-hero scene">
      <div className="stage nights-hero__stage box">
        <VectorGrid color="rgba(225, 212, 195, 0.14)" />
        <div className="nights-hero__header">
          <SplitLines as="h1" className="nights-hero__title display">
            <span>{nights.heroTitle[0]}</span>
            <br />
            <span className="nights-hero__indent">{nights.heroTitle[1]}</span>
          </SplitLines>
          <div className="nights-hero__sub">
            <Arrow className="nights-hero__arrow" />
            <h2 className="serif">{nights.heroSubtitle}</h2>
          </div>
        </div>
        <div className="nights-hero__footer">
          <p>{nights.heroText}</p>
          <RectButton label={nights.heroCta} onClick={() => openForm("contact")} />
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
