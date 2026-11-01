"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import "./Sheet.css";

type SheetProps = { title: string; onClose: () => void; busy?: boolean; compact?: boolean; children: ReactNode };

// A bottom sheet on phones and a side panel on larger screens.
export function Sheet({ title, onClose, busy, compact, children }: SheetProps) {
  const { t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  return (
    <div className={`sheet ${compact ? "sheet--compact" : ""}`}>
      <div className="sheet__backdrop" onClick={busy ? undefined : onClose} />
      <div ref={panel} className="sheet__panel" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
        <header className="sheet__header">
          <h2>{title}</h2>
          <button type="button" className="sheet__close" aria-label={t.manage.close} disabled={busy} onClick={onClose}>
            &times;
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
