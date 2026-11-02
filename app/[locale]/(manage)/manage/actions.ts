"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import sharp from "sharp";
import { CATALOG_TAG, type Catalog, type MenuName } from "@/lib/catalog";
import { changeCatalog, readCatalog, removeUpload, saveUpload } from "@/lib/catalogStore";
import { endSession, hasSession, isManagerPhone, startSession } from "@/lib/session";

export type ErrorCode = "session" | "invalid" | "image" | "write";
export type ActionResult = { ok: true; catalog: Catalog } | { ok: false; code: ErrorCode };

const MAX_UPLOAD = 6 * 1024 * 1024;

const text = (form: FormData, name: string, limit: number) => String(form.get(name) ?? "").trim().slice(0, limit);

const publish = async (change: (catalog: Catalog) => Catalog): Promise<ActionResult> => {
  try {
    const catalog = await changeCatalog(change);
    updateTag(CATALOG_TAG);
    return { ok: true, catalog };
  } catch (error) {
    console.error("Publishing failed", error);
    return { ok: false, code: "write" };
  }
};

const guarded = async (action: () => Promise<ActionResult>): Promise<ActionResult> =>
  (await hasSession()) ? action() : { ok: false, code: "session" };

const toggled = (list: string[], id: string, active: boolean) =>
  active ? list.filter((item) => item !== id) : [...new Set([...list, id])];

// Re-encoding also proves the upload is a real image. The size lets pages hold its space.
async function storeImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || !file.size) return undefined;
  if (file.size > MAX_UPLOAD) throw new Error("too large");
  const { data, info } = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer({ resolveWithObject: true });
  return { src: await saveUpload(data), size: { width: info.width, height: info.height } };
}

export async function signIn(phone: string) {
  if (!isManagerPhone(phone)) return false;
  await startSession();
  return true;
}

export async function signOut() {
  await endSession();
}

export const setDrinkActive = async (id: string, active: boolean) =>
  guarded(() => publish((catalog) => ({ ...catalog, inactiveDrinks: toggled(catalog.inactiveDrinks, id, active) })));

export const setEventActive = async (id: string, active: boolean) =>
  guarded(() => publish((catalog) => ({ ...catalog, inactiveEvents: toggled(catalog.inactiveEvents, id, active) })));

export const addDrink = async (form: FormData) =>
  guarded(async () => {
    const menu = text(form, "menu", 10) as MenuName;
    const group = Number(form.get("group"));
    const price = text(form, "price", 6);
    const name = text(form, "name", 80);
    const note = text(form, "note", 200);
    if (!["evening", "morning"].includes(menu) || !Number.isInteger(group) || group < 0 || !name || !/^\d{1,6}$/.test(price)) {
      return { ok: false, code: "invalid" };
    }

    let image: string | undefined;
    try {
      image = (await storeImage(form.get("image")))?.src;
    } catch {
      return { ok: false, code: "image" };
    }

    const drink = {
      id: randomUUID(),
      menu,
      group,
      price,
      image,
      vi: { name, note: note || undefined },
      en: { name: text(form, "nameEn", 80) || name, note: text(form, "noteEn", 200) || note || undefined },
    };
    return publish((catalog) => ({ ...catalog, addedDrinks: [...catalog.addedDrinks, drink] }));
  });

export const removeDrink = async (id: string) =>
  guarded(async () => {
    const image = (await readCatalog()).addedDrinks.find((drink) => drink.id === id)?.image;
    const result = await publish((catalog) => ({
      ...catalog,
      addedDrinks: catalog.addedDrinks.filter((drink) => drink.id !== id),
      inactiveDrinks: catalog.inactiveDrinks.filter((item) => item !== id),
    }));
    if (result.ok) await removeUpload(image);
    return result;
  });

export const addEvent = async (form: FormData) =>
  guarded(async () => {
    const date = text(form, "date", 10);
    const time = text(form, "time", 5);
    const title = text(form, "title", 100);
    const heading = text(form, "heading", 140);
    const body = text(form, "text", 800);
    const lines = (name: string) => text(form, name, 400).split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 6);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || (time && !/^\d{2}:\d{2}$/.test(time)) || !title || !heading || !body) {
      return { ok: false, code: "invalid" };
    }

    let stored: Awaited<ReturnType<typeof storeImage>>;
    try {
      stored = await storeImage(form.get("image"));
    } catch {
      return { ok: false, code: "image" };
    }
    if (!stored) return { ok: false, code: "image" };

    const event = {
      id: randomUUID(),
      date,
      time: time || undefined,
      image: stored.src,
      imageSize: stored.size,
      vi: { title, heading, text: body, notes: lines("notes") },
      en: {
        title: text(form, "titleEn", 100) || title,
        heading: text(form, "headingEn", 140) || heading,
        text: text(form, "textEn", 800) || body,
        notes: lines("notesEn").length ? lines("notesEn") : lines("notes"),
      },
    };
    return publish((catalog) => ({ ...catalog, addedEvents: [...catalog.addedEvents, event] }));
  });

export const removeEvent = async (id: string) =>
  guarded(async () => {
    const image = (await readCatalog()).addedEvents.find((event) => event.id === id)?.image;
    const result = await publish((catalog) => {
      const added = catalog.addedEvents.some((event) => event.id === id);
      return {
        ...catalog,
        addedEvents: catalog.addedEvents.filter((event) => event.id !== id),
        inactiveEvents: catalog.inactiveEvents.filter((item) => item !== id),
        removedEvents: added ? catalog.removedEvents : [...new Set([...catalog.removedEvents, id])],
      };
    });
    if (result.ok) await removeUpload(image);
    return result;
  });
