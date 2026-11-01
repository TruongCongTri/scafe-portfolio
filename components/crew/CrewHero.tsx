import { getI18n } from "@/i18n/server";
import { Lines } from "@/components/ui/Lines";
import { Arrow } from "@/components/ui/Icons";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./CrewHero.css";

export async function CrewHero() {
  const { t } = await getI18n();
  const { title, subtitle, text } = t.crewPage;

  return (
    <section className="crew-hero">
      <div className="crew-hero__left box">
        <div>
          <SplitLines as="h1" className="crew-hero__title display">
            <Lines lines={title} />
          </SplitLines>
          <h2 className="crew-hero__subtitle serif">{subtitle}</h2>
        </div>
        <Arrow className="crew-hero__arrow" />
      </div>
      <div className="crew-hero__right">
        <p>{text}</p>
      </div>
      <TimezoneBar />
    </section>
  );
}
