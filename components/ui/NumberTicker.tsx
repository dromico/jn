"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/** Counts up from zero once, when it scrolls into view. */
export function NumberTicker({ value, locale, suffix = "", duration = 1.4 }: { value: number; locale: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);
  const fmt = new Intl.NumberFormat(locale === "ms" ? "ms-MY" : "en-MY");

  // Server HTML has the final number (no-JS and crawlers see it). Once hydrated,
  // reset to zero off screen and count up when it comes into view.
  useEffect(() => {
    if (!reduce && !inView) setN(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">
        {fmt.format(n)}
        {suffix}
      </span>
      <span className="sr-only">
        {fmt.format(value)}
        {suffix}
      </span>
    </span>
  );
}
