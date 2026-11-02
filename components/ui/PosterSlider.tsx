"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Arrow } from "./Icons";
import "./PosterSlider.css";

// Horizontal travel, in pixels, that counts as a swipe.
const SWIPE = 40;

type PosterSliderProps = {
  images: readonly string[];
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
};

// One poster at a time, stepped with arrows or a swipe. A single image shows as is.
export function PosterSlider({ images, alt, sizes, className = "", preload }: PosterSliderProps) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const many = images.length > 1;
  const step = (by: number) => setIndex((current) => (current + by + images.length) % images.length);

  return (
    <figure className={`poster-slider ${className}`}>
      <div
        className="poster-slider__frame"
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") startX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const dx = event.clientX - startX.current;
          startX.current = null;
          if (many && Math.abs(dx) > SWIPE) step(dx < 0 ? 1 : -1);
        }}
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={many ? `${alt} (${i + 1}/${images.length})` : alt}
            width={1200}
            height={1500}
            sizes={sizes}
            preload={preload && i === 0}
            hidden={i !== index}
            draggable={false}
          />
        ))}
        {many && (
          <div className="poster-slider__nav">
            <button type="button" aria-label={t.slider.previous} onClick={() => step(-1)}>
              <Arrow className="poster-slider__back" />
            </button>
            <span aria-live="polite">
              {index + 1}/{images.length}
            </span>
            <button type="button" aria-label={t.slider.next} onClick={() => step(1)}>
              <Arrow />
            </button>
          </div>
        )}
      </div>
    </figure>
  );
}
