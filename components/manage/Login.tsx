"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { signIn } from "@/app/[locale]/(manage)/manage/actions";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo } from "@/components/ui/Icons";
import { useToasts } from "./Toasts";
import "./Login.css";

export function Login() {
  const { t } = useI18n();
  const m = t.manage;
  const router = useRouter();
  const toasts = useToasts();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const failure = useRef(0);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    toasts.dismiss(failure.current);
    try {
      if (await signIn(phone)) {
        toasts.show({ tone: "success", message: m.signedIn });
        router.refresh();
        return;
      }
      setError(m.loginWrong);
      failure.current = toasts.show({ tone: "error", message: m.loginFailed, detail: m.loginWrong });
    } catch {
      failure.current = toasts.show({ tone: "error", message: m.loginFailed, detail: m.errors.network });
    }
    setBusy(false);
  };

  return (
    <main className="login">
      <form className="login__card" onSubmit={submit}>
        <Logo className="login__logo" />
        <h1>{m.loginTitle}</h1>
        <p>{m.loginText}</p>
        <label className="field">
          <span>{m.phone}</span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            required
            autoFocus
            value={phone}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
            onChange={(event) => setPhone(event.target.value)}
          />
          {error && (
            <em id="login-error" className="field__error">
              {error}
            </em>
          )}
        </label>
        <button type="submit" className="manage-bt manage-bt--primary manage-bt--full" disabled={busy || !phone.trim()}>
          {busy ? m.loginBusy : m.login}
        </button>
      </form>
    </main>
  );
}
