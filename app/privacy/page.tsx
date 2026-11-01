import type { Metadata } from "next";
import { Contact } from "@/components/ui/Contact";
import { site } from "@/lib/content";
import "./page.css";

export const metadata: Metadata = { title: "Privacy" };

// Placeholder wording: have it reviewed before the site goes live.
export default function PrivacyPage() {
  return (
    <>
      <section className="privacy box">
        <h1 className="privacy__title display">Privacy</h1>
        <div className="privacy__body">
          <p>This site remembers your cookie choice in your own browser and does not run analytics.</p>
          <p>
            Forms open your email app with a prefilled message, so anything you send reaches us as ordinary email. To
            ask about your details, write to <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </section>
      <Contact flow />
    </>
  );
}
