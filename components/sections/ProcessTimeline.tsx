"use client";

/**
 * "From bare slab to the final weld": the nine steps as a horizontal scroll
 * timeline on the dark Spruce band. Steps fill amber as you scroll past.
 *
 * Pattern from "Product Timeline" by hyperiux (21st.dev, id 26930): a tall
 * section with a sticky viewport, the track translated sideways by a scrubbed
 * ScrollTrigger, Lenis smoothing, and a reduced-motion path with no pinning.
 * Rebuilt for our steps and tokens; phones get a vertical list instead.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface TimelineStep {
  n: number;
  title: string;
  body: string;
  figure?: string;
}

function Step({ step, done, className }: { step: TimelineStep; done: boolean; className?: string }) {
  return (
    <li data-step className={cn("relative pt-6", className)}>
      <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-[3px] transition-colors duration-300", done ? "bg-weld" : "bg-dark-line")} />
      <span className={cn("wide block text-[34px] font-bold leading-none tracking-[-0.03em] transition-colors duration-300", done ? "text-weld" : "text-[#7E8E88]")}>{step.n}</span>
      <h3 className="mb-2 mt-3 text-[18px] font-semibold text-on-dark">{step.title}</h3>
      <p className="text-[15px] leading-[1.55] text-on-dark-muted">{step.body}</p>
      {step.figure && <p className="mt-3 inline-block rounded-sm border border-dark-line px-2 py-1 text-[13px] text-on-dark">{step.figure}</p>}
    </li>
  );
}

export function ProcessTimeline({ title, sub, steps, compact = false }: { title: string; sub: string; steps: TimelineStep[]; compact?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(0);
  const [mode, setMode] = useState<"horizontal" | "vertical" | "static">("horizontal");

  useEffect(() => {
    const decide = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setMode("static");
      else if (window.matchMedia("(max-width: 767px)").matches || compact) setMode("vertical");
      else setMode("horizontal");
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, [compact]);

  // Horizontal: tall section, sticky viewport, track slides left as you scroll.
  useIsoLayoutEffect(() => {
    if (mode !== "horizontal") return;
    const sec = section.current;
    const vp = viewport.current;
    const tr = track.current;
    if (!sec || !vp || !tr) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
      const size = () => {
        sec.style.height = `${window.innerHeight + distance()}px`;
      };
      size();
      const items = Array.from(tr.querySelectorAll<HTMLElement>("[data-step]"));
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onRefreshInit: size,
        onUpdate: (self) => {
          const x = -distance() * self.progress;
          gsap.set(tr, { x });
          if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
          // A step is "welded" once its left edge passes 55% of the viewport.
          const edge = vp.getBoundingClientRect().left + vp.clientWidth * 0.55;
          let count = 0;
          for (const el of items) if (el.getBoundingClientRect().left < edge) count++;
          setDone(self.progress > 0.995 ? items.length : count);
        },
      });
    }, sec);
    return () => {
      ctx.revert();
      sec.style.height = "";
    };
  }, [mode, steps.length]);

  // Vertical: each step welds when it reaches the middle of the screen.
  useEffect(() => {
    if (mode !== "vertical") return;
    const tr = track.current;
    if (!tr) return;
    const items = Array.from(tr.querySelectorAll<HTMLElement>("[data-step]"));
    const triggers = items.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        onEnter: () => setDone((d) => Math.max(d, i + 1)),
        onLeaveBack: () => setDone(i),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [mode, steps.length]);

  const heading = (
    <div className="wrap">
      <h2 className="display text-[32px] text-on-dark sm:text-[44px]">{title}</h2>
      <p className="mt-3 max-w-[34em] text-[17px] text-on-dark-muted">{sub}</p>
    </div>
  );

  if (mode === "static") {
    return (
      <section className="on-dark bg-spruce py-20 text-on-dark sm:py-24">
        {heading}
        <ol className="wrap mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <Step key={s.n} step={s} done />
          ))}
        </ol>
      </section>
    );
  }

  if (mode === "vertical") {
    return (
      <section className="on-dark bg-spruce py-20 text-on-dark">
        {heading}
        <ol ref={track} className="wrap mt-12 grid gap-10">
          {steps.map((s, i) => (
            <Step key={s.n} step={s} done={i < done} />
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section ref={section} className="on-dark relative bg-spruce text-on-dark">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-[var(--nav-h)]">
        {heading}
        <div ref={viewport} className="wrap mt-14 overflow-visible">
          <div aria-hidden="true" className="relative mb-0 h-px bg-dark-line">
            <span ref={fill} className="absolute inset-0 origin-left bg-weld/60" style={{ transform: "scaleX(0)" }} />
          </div>
          <ol ref={track} className="flex w-max gap-10 will-change-transform">
            {steps.map((s, i) => (
              <Step key={s.n} step={s} done={i < done} className="w-[300px] shrink-0 xl:w-[320px]" />
            ))}
            <li aria-hidden="true" className="w-[20vw] shrink-0" />
          </ol>
        </div>
      </div>
    </section>
  );
}
