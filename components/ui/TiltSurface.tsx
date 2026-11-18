"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Gently tilts its child toward the cursor (±2°). Still with reduced motion or touch. */
export function TiltSurface({ children, className }: { children: ReactNode; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        if (el.current) el.current.style.transform = `perspective(1400px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) scale(1.08)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={el} className={className} style={{ transform: "scale(1.08)", transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
      {children}
    </div>
  );
}
