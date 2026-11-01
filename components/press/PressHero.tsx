import { getI18n } from "@/i18n/server";
import { Lines } from "@/components/ui/Lines";
import { Arrow } from "@/components/ui/Icons";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./PressHero.css";

export async function PressHero() {
  const { t } = await getI18n();

  return (
    <section className="press-hero scene">
      <div className="stage press-hero__stage box">
        <VectorGrid color="rgba(225, 212, 195, 0.14)" />
        <SplitLines as="h1" className="press-hero__title display">
          <Lines lines={t.press.heroTitle} />
        </SplitLines>
        <div className="press-hero__footer">
          <Arrow className="press-hero__arrow" />
          <p>{t.press.heroText}</p>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
