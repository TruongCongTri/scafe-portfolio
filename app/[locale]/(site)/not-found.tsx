import { getI18n } from "@/i18n/server";
import { Contact } from "@/components/ui/Contact";
import { RectButton } from "@/components/ui/RectButton";
import "./not-found.css";

export default async function NotFound() {
  const { t } = await getI18n();

  return (
    <>
      <section className="not-found box">
        <h1 className="not-found__title display">{t.notFound.title}</h1>
        <p className="serif">{t.notFound.text}</p>
        <RectButton label={t.notFound.cta} href="/" />
      </section>
      <Contact flow />
    </>
  );
}
