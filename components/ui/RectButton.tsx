"use client";

import type { MouseEventHandler } from "react";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Arrow } from "./Icons";
import "./RectButton.css";

type RectButtonProps = {
  label: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  // Renders a non-interactive look-alike for use inside a clickable parent.
  decorative?: boolean;
};

export function RectButton({ label, href, onClick, className = "", decorative }: RectButtonProps) {
  const inner = (
    <span className="rect-bt__wrapper">
      <Arrow className="rect-bt__ic rect-bt__ic--in" />
      <span className="rect-bt__label">{label}</span>
      <Arrow className="rect-bt__ic rect-bt__ic--out" />
    </span>
  );

  if (decorative) return <span className={`rect-bt ${className}`}>{inner}</span>;

  if (href) {
    return (
      <TransitionLink href={href} className={`rect-bt ${className}`}>
        {inner}
      </TransitionLink>
    );
  }

  return (
    <button type="button" className={`rect-bt ${className}`} onClick={onClick}>
      {inner}
    </button>
  );
}
