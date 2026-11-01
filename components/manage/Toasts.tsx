"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import "./Toasts.css";

type Tone = "loading" | "success" | "error" | "info";
type ToastData = { id: number; tone: Tone; message: string; detail?: string; action?: { label: string; run: () => void } };
type ToastInput = Omit<ToastData, "id">;

// Errors stay longer, because they usually need reading and a decision.
const DURATION: Record<Tone, number> = { loading: 0, success: 3500, info: 4000, error: 9000 };

type Toasts = {
  show: (toast: ToastInput) => number;
  update: (id: number, toast: ToastInput) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<Toasts | null>(null);

export const useToasts = () => {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToasts must be used inside ToastProvider");
  return value;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const schedule = useCallback(
    (id: number, tone: Tone) => {
      window.clearTimeout(timers.current.get(id));
      if (DURATION[tone]) timers.current.set(id, window.setTimeout(() => dismiss(id), DURATION[tone]));
    },
    [dismiss]
  );

  const show = useCallback(
    (toast: ToastInput) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { ...toast, id }]);
      schedule(id, toast.tone);
      return id;
    },
    [schedule]
  );

  const update = useCallback(
    (id: number, toast: ToastInput) => {
      setToasts((list) => list.map((item) => (item.id === id ? { ...toast, id } : item)));
      schedule(id, toast.tone);
    },
    [schedule]
  );

  const value = useMemo(() => ({ show, update, dismiss }), [show, update, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="region" aria-label={t.manage.toastRegion}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}>
            <span className="toast__icon" aria-hidden="true" />
            <div className="toast__body">
              <p className="toast__message">{toast.message}</p>
              {toast.detail && <p className="toast__detail">{toast.detail}</p>}
            </div>
            {toast.action && (
              <button
                type="button"
                className="toast__action"
                onClick={() => {
                  dismiss(toast.id);
                  toast.action?.run();
                }}
              >
                {toast.action.label}
              </button>
            )}
            {toast.tone !== "loading" && (
              <button type="button" className="toast__close" aria-label={t.manage.close} onClick={() => dismiss(toast.id)}>
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
