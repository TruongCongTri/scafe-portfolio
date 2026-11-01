import { Arrow } from "@/components/ui/Icons";
import { SplitLines } from "@/components/ui/SplitLines";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./AboutHero.css";

export function AboutHero() {
  return (
    <section className="about-hero scene">
      <div className="stage about-hero__stage box">
        <VectorGrid color="rgba(225, 212, 195, 0.14)" />
        <header className="about-hero__header">
          <SplitLines as="h1" className="about-hero__title display">
            <span>Ready for</span>
            <br />
            <span className="about-hero__indent">a good night?</span>
            <br />
            <span>We are!</span>
          </SplitLines>
          <Arrow className="about-hero__arrow" />
        </header>
        <footer className="about-hero__footer">
          <h2 className="serif">We chase the flavours that matter and build them with precision, patience and care.</h2>
          <p>
            From first shake to final garnish, we believe a great drink isn&rsquo;t just a recipe. It&rsquo;s a small
            piece of theatre that changes the mood of a room and keeps you out later than you planned.
          </p>
        </footer>
        <TimezoneBar />
      </div>
    </section>
  );
}
