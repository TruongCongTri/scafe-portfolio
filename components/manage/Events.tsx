"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { addEvent, removeEvent, setEventActive } from "@/app/[locale]/(manage)/manage/actions";
import { useI18n } from "@/i18n/I18nProvider";
import type { ManageData } from "@/lib/content";
import { shrinkImage, Switch, type Publish } from "./Manager";
import { Sheet } from "./Sheet";

type EventsProps = { events: ManageData["events"]; publish: Publish };

export function Events({ events, publish }: EventsProps) {
  const { t } = useI18n();
  const m = t.manage;
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<{ id: string; title: string } | null>(null);

  const toggle = (id: string, title: string, active: boolean) =>
    publish(
      () => setEventActive(id, active),
      { busy: m.publishing, done: `${title}: ${active ? m.eventOn : m.eventOff}`, failed: m.publishFailed },
      (catalog) => ({
        ...catalog,
        inactiveEvents: active ? catalog.inactiveEvents.filter((item) => item !== id) : [...catalog.inactiveEvents, id],
      })
    );

  const remove = async () => {
    if (!removing) return;
    const { id, title } = removing;
    setRemoving(null);
    await publish(
      () => removeEvent(id),
      { busy: m.publishing, done: `${m.removed}: ${title}`, failed: m.removeFailed },
      (catalog) => ({
        ...catalog,
        addedEvents: catalog.addedEvents.filter((event) => event.id !== id),
        removedEvents: [...catalog.removedEvents, id],
      })
    );
  };

  return (
    <>
      {!events.length && <p className="manage-empty">{m.noEvents}</p>}

      {events.map((event) => (
        <div key={event.id} className={`manage-row ${event.active ? "" : "manage-row--off"}`}>
          <div className="manage-row__thumb">
            <Image src={event.image} alt="" fill sizes="64px" className="cover" />
          </div>
          <div className="manage-row__body">
            <p className="manage-row__name">{event.title}</p>
            <p className="manage-row__meta">{[event.date?.split("-").reverse().join("/") ?? m.weekly, event.time].filter(Boolean).join(" · ")}</p>
            <span className={`manage-row__status manage-row__status--${event.active ? "on" : "off"}`}>
              {event.active ? m.eventStatusOn : m.eventStatusOff}
            </span>
          </div>
          <button
            type="button"
            className="manage-row__remove"
            aria-label={`${m.remove}: ${event.title}`}
            onClick={() => setRemoving({ id: event.id, title: event.title })}
          >
            &times;
          </button>
          <Switch checked={event.active} label={event.title} onChange={(active) => toggle(event.id, event.title, active)} />
        </div>
      ))}

      <button type="button" className="manage-fab" onClick={() => setAdding(true)}>
        + {m.addEvent}
      </button>

      {adding && <EventForm publish={publish} onClose={() => setAdding(false)} />}

      {removing && (
        <Sheet title={m.confirmRemove} compact onClose={() => setRemoving(null)}>
          <div className="manage-confirm">
            <p>
              {removing.title}. {m.removeHint}
            </p>
            <div className="manage-confirm__actions">
              <button type="button" className="manage-bt" onClick={() => setRemoving(null)}>
                {m.cancel}
              </button>
              <button type="button" className="manage-bt manage-bt--danger" onClick={remove}>
                {m.remove}
              </button>
            </div>
          </div>
        </Sheet>
      )}
    </>
  );
}

function EventForm({ publish, onClose }: { publish: Publish; onClose: () => void }) {
  const { t } = useI18n();
  const m = t.manage;
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [photoError, setPhotoError] = useState(false);

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const small = await shrinkImage(file);
    setPhoto(small);
    setPhotoError(false);
    setPreview(URL.createObjectURL(small));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!photo) {
      setPhotoError(true);
      return;
    }
    const form = new FormData(event.currentTarget);
    form.delete("photo");
    form.set("image", photo);
    const title = String(form.get("title"));
    setBusy(true);
    const ok = await publish(() => addEvent(form), { busy: m.publishing, done: `${m.addedEvent}: ${title}`, failed: m.publishFailed });
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <Sheet title={m.addEvent} busy={busy} onClose={onClose}>
      <form className="manage-form" onSubmit={submit}>
        <div className="manage-form__fields">
          <span className="field">
            <span>{m.poster}</span>
            <label className="manage-photo">
              {/* eslint-disable-next-line @next/next/no-img-element -- a local preview of the picked file */}
              {preview ? <img src={preview} alt="" /> : m.pickPhoto}
              <input type="file" name="photo" accept="image/*" aria-label={m.poster} onChange={pick} />
            </label>
            {photoError && <em className="field__error">{m.photoRequired}</em>}
          </span>
          <label className="field">
            <span>{m.eventTitle}</span>
            <input name="title" required maxLength={100} />
          </label>
          <div className="manage-form__two">
            <label className="field">
              <span>{m.date}</span>
              <input name="date" type="date" required />
            </label>
            <label className="field">
              <span>{m.time}</span>
              <input name="time" type="time" />
            </label>
          </div>
          <label className="field">
            <span>{m.heading}</span>
            <input name="heading" required maxLength={140} />
          </label>
          <label className="field">
            <span>{m.description}</span>
            <textarea name="text" required maxLength={800} />
          </label>
          <label className="field">
            <span>{m.notes}</span>
            <textarea name="notes" maxLength={400} />
            <small>{m.notesHint}</small>
          </label>
          <details>
            <summary>{m.english}</summary>
            <label className="field">
              <span>{m.eventTitle}</span>
              <input name="titleEn" maxLength={100} />
            </label>
            <label className="field">
              <span>{m.heading}</span>
              <input name="headingEn" maxLength={140} />
            </label>
            <label className="field">
              <span>{m.description}</span>
              <textarea name="textEn" maxLength={800} />
            </label>
            <label className="field">
              <span>{m.notes}</span>
              <textarea name="notesEn" maxLength={400} />
            </label>
          </details>
        </div>
        <div className="manage-form__actions">
          <button type="button" className="manage-bt" disabled={busy} onClick={onClose}>
            {m.cancel}
          </button>
          <button type="submit" className="manage-bt manage-bt--primary" disabled={busy}>
            {busy ? m.publishing : m.publish}
          </button>
        </div>
      </form>
    </Sheet>
  );
}
