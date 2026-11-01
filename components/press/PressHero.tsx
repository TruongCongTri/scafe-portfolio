import { Arrow } from "@/components/ui/Icons";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./PressHero.css";

export function PressHero() {
  return (
    <section className="press-hero scene">
      <div className="stage press-hero__stage box">
        <VectorGrid color="rgba(225, 212, 195, 0.14)" />
        <SplitLines as="h1" className="press-hero__title display">
          Stay up to date
          <br />
          with everything
        </SplitLines>
        <div className="press-hero__footer">
          <Arrow className="press-hero__arrow" />
          <p>Curious what we&rsquo;ve been up to? A lot, actually. Catch up on all the good stuff happening at Scafe.</p>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}
