"use client";

/**
 * 3D tilt with a pointer-following light sheen and touch-hold on mobile.
 * Adapted from "Optimized Tilt Card" by sh20raj (21st.dev, id 27139),
 * restyled for Jaya Nexus: a soft white sheen like light across vinyl,
 * gentler tilt, and no tilt at all with reduced motion.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const MAX_TILT = 9;
const HOVER_SCALE = 1.03;
const TOUCH_HOLD_MS = 400;

export function TiltCard({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const card = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [touchActive, setTouchActive] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const on = () => (reduced.current = mq.matches);
    mq.addEventListener("change", on);
    return () => {
      mq.removeEventListener("change", on);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      if (holdTimer.current !== null) clearTimeout(holdTimer.current);
    };
  }, []);

  const apply = useCallback((px: number, py: number, rx: number, ry: number, scale: number) => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--pointer-x", `${px}%`);
    el.style.setProperty("--pointer-y", `${py}%`);
    el.style.setProperty("--rotate-x", `${rx}deg`);
    el.style.setProperty("--rotate-y", `${ry}deg`);
    el.style.setProperty("--card-scale", `${scale}`);
  }, []);

  const fromPoint = useCallback(
    (x: number, y: number) => {
      const el = card.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100));
      const py = Math.max(0, Math.min(100, ((y - r.top) / r.height) * 100));
      const tilt = reduced.current ? 0 : MAX_TILT;
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => apply(px, py, ((py - 50) / 50) * -tilt, ((px - 50) / 50) * tilt, reduced.current ? 1 : HOVER_SCALE));
    },
    [apply],
  );

  const reset = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => apply(50, 50, 0, 0, 1));
  }, [apply]);

  return (
    <div
      ref={card}
      onMouseMove={(e) => fromPoint(e.clientX, e.clientY)}
      onMouseLeave={reset}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (!t) return;
        if (holdTimer.current) clearTimeout(holdTimer.current);
        fromPoint(t.clientX, t.clientY);
        setTouchActive(true);
      }}
      onTouchMove={(e) => e.touches[0] && fromPoint(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={() => {
        reset();
        holdTimer.current = setTimeout(() => setTouchActive(false), TOUCH_HOLD_MS);
      }}
      onTouchCancel={reset}
      className={cn("group/tilt relative touch-manipulation overflow-hidden", className)}
      style={
        {
          ...style,
          transform: "perspective(900px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(var(--card-scale, 1))",
          transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
          WebkitTapHighlightColor: "transparent",
        } as CSSProperties
      }
    >
      {children}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover/tilt:opacity-100", touchActive && "opacity-100")}
        style={{ background: "radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 65%)" }}
      />
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 z-[21] opacity-0 transition-opacity duration-200 group-hover/tilt:opacity-100", touchActive && "opacity-100")}
        style={{ background: "radial-gradient(circle 70px at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255,255,255,0.22), transparent 70%)" }}
      />
    </div>
  );
}
