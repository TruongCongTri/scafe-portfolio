"use client";

import { forms, useContactForm } from "@/components/shell/ContactForms";
import { Arrow } from "@/components/ui/Icons";
import { RectButton } from "@/components/ui/RectButton";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./NightsHero.css";

export function NightsHero() {
  const openForm = useContactForm();

  return (
    <section className="nights-hero scene">
      <div className="stage nights-hero__stage box">
        <VectorGrid color="rgba(225, 212, 195, 0.14)" />
        <div className="nights-hero__header">
          <SplitLines as="h1" className="nights-hero__title display">
            <span>Calling all</span>
            <br />
            <span className="nights-hero__indent">characters</span>
          </SplitLines>
          <div className="nights-hero__sub">
            <Arrow className="nights-hero__arrow" />
            <h2 className="serif">...the bold, the brilliant, the barely standing</h2>
          </div>
        </div>
        <div className="nights-hero__footer">
          <p>Those who bring passion, nerve and a good story to the nights that keep this room alive.</p>
          <RectButton label="Count me in" onClick={() => openForm(forms.contact)} />
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
