import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EventAsk } from "@/components/nights/EventAsk";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Contact } from "@/components/ui/Contact";
import { JsonLd } from "@/components/ui/JsonLd";
import { PosterSlider } from "@/components/ui/PosterSlider";
import { SplitLines } from "@/components/ui/SplitLines";
import { intlLocales } from "@/i18n/config";
import { getI18n, pageMetadata } from "@/i18n/server";
import { nightIds } from "@/lib/content";
import { eventSchema } from "@/lib/eventSchema";
import "./page.css";

type PageProps = { params: Promise<{ id: string }> };

// Events added in the manager aren't listed here: they render on first request.
export function generateStaticParams() {
  return nightIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { content } = await getI18n();
  const night = content.nights.find((item) => item.id === id);
  if (!night) return {};
  const metadata = await pageMetadata(`/nights/${id}`, night.title, night.heading);
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [night.image] },
    twitter: { ...metadata.twitter, images: [night.image] },
  };
}

export default function EventPage({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <EventContent params={params} />
    </Suspense>
  );
}

async function EventContent({ params }: PageProps) {
  const { id } = await params;
  const { locale, t, content } = await getI18n();
  const night = content.nights.find((item) => item.id === id);
  if (!night) notFound();

  const when = night.date
    ? new Intl.DateTimeFormat(intlLocales[locale], { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
        new Date(`${night.date}T00:00:00Z`)
      )
    : t.nights.weekly;
  // The heading above already gives the date, so a note that repeats it can go.
  const shortDate = night.date?.split("-").reverse().join("/");
  const notes = night.notes.filter((note) => !shortDate || !note.includes(shortDate));

  return (
    <>
      {night.date && <JsonLd data={eventSchema(night, t.site.address, locale)} />}
      <article className="event">
        <div className="event__content box">
          <p className="event__meta">
            <time dateTime={night.date}>{when}</time>
            {night.time && <span>{night.time}</span>}
          </p>
          <SplitLines as="h1" className="event__title display">
            {night.title}
          </SplitLines>
          <h2 className="event__heading serif">{night.heading}</h2>
          <p className="event__text">{night.text}</p>
          {notes.length > 0 && (
            <ul className="event__notes">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
          <EventAsk title={night.title} heading={night.heading} />
          <TransitionLink href="/nights" className="event__back display">
            {t.nights.back}
          </TransitionLink>
        </div>
        <PosterSlider
          images={night.posters}
          alt={night.title}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="event__poster"
          preload
        />
      </article>
      <Contact flow />
    </>
  );
}
