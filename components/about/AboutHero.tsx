import { getI18n } from "@/i18n/server";
import { Arrow } from "@/components/ui/Icons";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./AboutHero.css";

export async function AboutHero() {
  const { t } = await getI18n();
  const { title, subtitle, text } = t.about.hero;

  return (
    <section className="about-hero scene">
      <div className="stage about-hero__stage box">
        <VectorGrid color="rgba(225, 212, 195, 0.14)" />
        <header className="about-hero__header">
          <SplitLines as="h1" className="about-hero__title display">
            <span>{title[0]}</span>
            <br />
            <span className="about-hero__indent">{title[1]}</span>
            <br />
            <span>{title[2]}</span>
          </SplitLines>
          <Arrow className="about-hero__arrow" />
        </header>
        <footer className="about-hero__footer">
          <h2 className="serif">{subtitle}</h2>
          <p>{text}</p>
        </footer>
        <TimezoneBar />
      </div>
    </section>
  );
}
