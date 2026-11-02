"use client";

import { useEffect, useRef } from "react";
import { isLite, isTouch, prefersReducedMotion } from "@/lib/site";
import "./VectorGrid.css";

const SPACING = 44;
const SEGMENT = 34;
// The drift is slow enough that phones lose nothing at a fraction of the frames.
const TOUCH_FRAME = 66;

// Zig-zag rule lines that drift slowly and lean away from the pointer.
export function VectorGrid({ color = "rgba(107, 35, 36, 0.3)" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduced = prefersReducedMotion();
    const touch = isTouch();
    const pointer = { x: -9999, y: -9999, strength: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const fold = (value: number) => Math.abs(((value % 2) + 2) % 2 - 1);

    const draw = (time: number) => {
      const t = time * 0.00006;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = color;
      context.lineWidth = 1;
      pointer.strength *= 0.96;

      for (let x = -SPACING * 2; x < width + SPACING * 2; x += SPACING) {
        const seed = x * 0.0021;
        context.beginPath();
        for (let y = -SEGMENT; y <= height + SEGMENT; y += SEGMENT) {
          const wave = fold(y * 0.0026 + seed * 1.7 + t) - 0.5;
          const ripple = fold(y * 0.0071 - seed + t * 2) - 0.5;
          let px = x + wave * 74 + ripple * 26;
          const dx = px - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 240) px += (dx / (distance + 1)) * (240 - distance) * 0.22 * pointer.strength;
          if (y === -SEGMENT) context.moveTo(px, y);
          else context.lineTo(px, y);
        }
        context.stroke();
      }
    };

    let drawn = 0;
    const loop = (time: number) => {
      if (!touch || time - drawn >= TOUCH_FRAME) {
        draw(time);
        drawn = time;
      }
      if (visible && !reduced && !isLite()) frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.strength = 1;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(loop);
    });
    const resizer = new ResizeObserver(resize);

    resize();
    observer.observe(canvas);
    resizer.observe(canvas);
    if (!touch) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, [color]);

  return <canvas ref={canvasRef} className="vector-grid" aria-hidden="true" />;
}
