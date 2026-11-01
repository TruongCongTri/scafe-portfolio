import { INITIAL, LOGO } from "./logoPaths";
import "./Icons.css";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={`logo ${className}`} viewBox={`0 0 ${LOGO.width} ${LOGO.height}`} role="img" aria-label="Scafe">
      <path d={LOGO.path} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 120 100" aria-hidden="true">
      <path d="M3 41 70 37 43 9 60 1 118 51 60 99 45 85 71 63 5 61Z" fill="currentColor" />
    </svg>
  );
}

// Points down the page from inside a mask, so it can drop into view.
export function DropArrow({ className = "" }: { className?: string }) {
  return (
    <span className={`drop-arrow ${className}`}>
      <Arrow />
    </span>
  );
}

// The house stamp: a coaster ring around the initial.
export function Stamp({ className = "" }: { className?: string }) {
  return (
    <svg className={`stamp ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="9" />
      <svg x="31" y="23" width="38" height="54" viewBox={`0 0 ${INITIAL.width} ${INITIAL.height}`}>
        <path d={INITIAL.path} fill="currentColor" fillRule="evenodd" />
      </svg>
    </svg>
  );
}
