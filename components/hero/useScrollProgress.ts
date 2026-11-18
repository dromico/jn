"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * 0..1 progress of a tall section scrolling past its sticky child.
 * Returned as a ref so the 3D scene can read it every frame without
 * re-rendering React.
 */
export function useScrollProgress(section: RefObject<HTMLElement | null>, enabled = true) {
  const progress = useRef(0);

  useEffect(() => {
    const el = section.current;
    if (!el || !enabled) return;

    // ?hero=0.5 pins the hero at a given progress (for screenshots and QA).
    const forced = new URLSearchParams(window.location.search).get("hero");
    if (forced !== null && !Number.isNaN(Number(forced))) {
      progress.current = Math.min(1, Math.max(0, Number(forced)));
      return;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
    progress.current = st.progress;
    return () => st.kill();
  }, [section, enabled]);

  return progress;
}
