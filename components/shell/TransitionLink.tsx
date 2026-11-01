"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { withLocale } from "@/i18n/config";
import { usePageTransition } from "./PageTransition";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function TransitionLink({ href, onClick, ...props }: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  const { locale } = useI18n();
  const target = withLocale(locale, href);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    navigate(target);
  };

  return <Link href={target} onClick={handleClick} {...props} />;
}
