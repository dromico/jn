"use client";

import { useEffect, useRef } from "react";
import { floorBase, paintFloor, type FloorKind } from "@/components/hero/textures";
import { cn } from "@/lib/cn";

/**
 * Paints a procedural floor texture into a canvas that fills its parent.
 * `density` scales the pattern: 1 is the sample-board size.
 */
export function SwatchCanvas({ kind, className, density = 1, seed = 5 }: { kind: FloorKind; className?: string; density?: number; seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let done = false;
    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (done && canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      paintFloor(kind, { c: ctx }, { x: 0, y: 0, w, h }, dpr * density, seed);
      done = true;
    };
    // Paint when near the viewport, and again if the size changes a lot.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) paint();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);
    let t: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => done && paint(), 150);
    });
    ro.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      clearTimeout(t);
    };
  }, [kind, density, seed]);

  return <canvas ref={ref} aria-hidden="true" className={cn("block size-full", className)} style={{ background: floorBase[kind] }} />;
}
