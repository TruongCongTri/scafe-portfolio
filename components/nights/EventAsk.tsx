"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { useContactForm } from "@/components/shell/ContactForms";
import { RectButton } from "@/components/ui/RectButton";

export function EventAsk({ title, heading }: { title: string; heading: string }) {
  const { t } = useI18n();
  const openForm = useContactForm();

  return (
    <RectButton
      label={t.nights.signUp}
      onClick={() =>
        openForm({
          tone: "orange",
          title,
          text: heading,
          subject: `${t.nights.signUpSubject} ${title}`,
          messageLabel: t.nights.signUpMessage,
        })
      }
    />
  );
}
