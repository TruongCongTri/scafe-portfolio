import { Arrow } from "@/components/ui/Icons";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./CrewHero.css";

export function CrewHero() {
  return (
    <section className="crew-hero">
      <div className="crew-hero__left box">
        <div>
          <SplitLines as="h1" className="crew-hero__title display">
            Meet the
            <br />
            crew
          </SplitLines>
          <h2 className="crew-hero__subtitle serif">The people turning long shifts into unforgettable nights.</h2>
        </div>
        <Arrow className="crew-hero__arrow" />
      </div>
      <div className="crew-hero__right">
        <p>
          From ice carvers to record diggers, our crew is as lively as the room itself. This is the team that obsesses
          over every pour and every moment, making sure each guest is looked after properly.
        </p>
      </div>
      <TimezoneBar />
    </section>
  );
}
