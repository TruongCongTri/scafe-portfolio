"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { signOut, type ActionResult } from "@/app/[locale]/(manage)/manage/actions";
import { withLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import type { Catalog } from "@/lib/catalog";
import { buildManageData } from "@/lib/content";
import { Logo } from "@/components/ui/Icons";
import { Drinks } from "./Drinks";
import { Events } from "./Events";
import { useToasts } from "./Toasts";
import "./Manager.css";

export type Messages = { busy: string; done: string; failed: string };

export type Publish = (task: () => Promise<ActionResult>, messages: Messages, optimistic?: (catalog: Catalog) => Catalog) => Promise<boolean>;

type Tab = "drinks" | "events";

export function Manager({ initial }: { initial: Catalog }) {
  const { locale, t } = useI18n();
  const m = t.manage;
  const router = useRouter();
  const toasts = useToasts();
  const [catalog, setCatalog] = useState(initial);
  const [tab, setTab] = useState<Tab>("drinks");
  const data = useMemo(() => buildManageData(t, locale, catalog), [t, locale, catalog]);
  const saved = useRef(initial);

  // Every change reports its own progress, and a failed one is put back as it was.
  const publish: Publish = async (task, messages, optimistic) => {
    if (optimistic) setCatalog((current) => optimistic(current));
    const id = toasts.show({ tone: "loading", message: messages.busy });
    const fail = (detail: string) => {
      setCatalog(saved.current);
      toasts.update(id, {
        tone: "error",
        message: messages.failed,
        detail,
        action: { label: m.retry, run: () => void publish(task, messages, optimistic) },
      });
      return false;
    };

    let result: ActionResult;
    try {
      result = await task();
    } catch {
      return fail(navigator.onLine ? m.errors.write : m.errors.network);
    }

    if (result.ok) {
      saved.current = result.catalog;
      setCatalog(result.catalog);
      toasts.update(id, { tone: "success", message: messages.done, detail: m.published });
      return true;
    }
    if (result.code === "session") {
      setCatalog(saved.current);
      toasts.update(id, { tone: "error", message: messages.failed, detail: m.errors.session });
      window.setTimeout(() => router.refresh(), 1800);
      return false;
    }
    return fail(m.errors[result.code]);
  };

  const logOut = async () => {
    try {
      await signOut();
      toasts.show({ tone: "info", message: m.signedOut });
      router.refresh();
    } catch {
      toasts.show({ tone: "error", message: m.logoutFailed, detail: m.errors.network });
    }
  };

  const tabs: [Tab, string][] = [
    ["drinks", m.tabDrinks],
    ["events", m.tabEvents],
  ];

  return (
    <div className="manager">
      <header className="manager__header">
        <Logo className="manager__logo" />
        <h1>{m.title}</h1>
        <a className="manager__link" href={withLocale(locale, "/")} target="_blank" rel="noopener">
          {m.viewSite}
        </a>
        <button type="button" className="manager__link" onClick={logOut}>
          {m.logout}
        </button>
      </header>

      <nav className="manager__tabs" aria-label={m.title}>
        {tabs.map(([name, label]) => (
          <button key={name} type="button" aria-current={tab === name ? "page" : undefined} onClick={() => setTab(name)}>
            {label}
          </button>
        ))}
      </nav>

      <main className="manager__main">
        {tab === "drinks" ? <Drinks menus={data.menus} publish={publish} /> : <Events events={data.events} publish={publish} />}
      </main>
    </div>
  );
}

export function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <label className="switch">
      <input type="checkbox" role="switch" checked={checked} aria-label={label} onChange={(event) => onChange(event.target.checked)} />
      <span className="switch__track" aria-hidden="true" />
    </label>
  );
}

// Phone photos are often over the upload limit, so they shrink before leaving the device.
export async function shrinkImage(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob ? new File([blob], "photo.jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}
