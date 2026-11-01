import { Contact } from "@/components/ui/Contact";
import { RectButton } from "@/components/ui/RectButton";
import "./not-found.css";

export default function NotFound() {
  return (
    <>
      <section className="not-found box">
        <h1 className="not-found__title display">Last call</h1>
        <p className="serif">This page has left the bar.</p>
        <RectButton label="Back to the top" href="/" />
      </section>
      <Contact flow />
    </>
  );
}
