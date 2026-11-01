import { getI18n } from "@/i18n/server";
import { Contact } from "@/components/ui/Contact";
import { site } from "@/lib/content";
import "./page.css";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t.meta.privacy };
}

// Placeholder wording: have it reviewed before the site goes live.
export default async function PrivacyPage() {
  const { t } = await getI18n();

  return (
    <>
      <section className="privacy box">
        <h1 className="privacy__title display">{t.privacy.title}</h1>
        <div className="privacy__body">
          <p>{t.privacy.cookies}</p>
          <p>
            {t.privacy.forms} <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </section>
      <Contact flow />
    </>
  );
}
