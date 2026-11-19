"use client";

/**
 * Full-page hero. The 3D scene is a full-screen canvas that opens clipped to
 * the right-hand column (the mockup's layout) and grows to fill the screen
 * over the first scroll, as in the "Video Scroll Hero" pattern (21st.dev, id
 * 7512). The headline and buttons step aside as it grows; the scene then
 * dives into the corner of the ward and builds the floor up layer by layer,
 * with a caption for each layer.
 */
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/content/site";
import { buttonClass, ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { SceneFrame } from "./FloorBuildScene";
import { useScrollProgress } from "./useScrollProgress";

const FloorBuildScene = dynamic(() => import("./FloorBuildScene"), { ssr: false });

type Mode = "pending" | "3d" | "poster";

interface Step {
  title: string;
  body: string;
}

/** Pixels of scroll it takes the frame to grow to full screen. */
const GROW_PX = 160;
/** Scene stage once the floor is finished and the camera pulls back. */
const FINISHED = 5;

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const steps = t.raw("steps") as Step[];
  const section = useRef<HTMLElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const column = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const ctas = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const shown = useRef(-1);
  const frame = useRef<SceneFrame>({ grow: 0, x: 0, y: 0, w: 0, h: 0 });
  const box = useRef({ W: 0, H: 0, growEnd: 0.08 });

  const [mode, setMode] = useState<Mode>("pending");
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(-1);

  const progress = useScrollProgress(section, mode !== "poster");

  // Decide what to render once we know about the device.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      if (reduce.matches || !supportsWebGL()) {
        setMode("poster");
        return undefined;
      }
      const nav = navigator as Navigator & { deviceMemory?: number };
      // ?hero=0.5 (QA and screenshots) always gets the full-quality scene straight away.
      const qa = new URLSearchParams(window.location.search).has("hero");
      const low =
        !qa &&
        (window.matchMedia("(max-width: 767px), (pointer: coarse)").matches ||
          (navigator.hardwareConcurrency ?? 8) <= 4 ||
          (nav.deviceMemory ?? 8) <= 4);
      setQuality(low ? "low" : "high");
      const start = () => {
        cleanup();
        setMode("3d");
      };
      const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
      const cleanup = () => events.forEach((e) => window.removeEventListener(e, start));
      if (low) {
        // Phones: a still of the opening frame until the visitor starts
        // scrolling, so the 3D bundle never competes with the first paint.
        events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
      } else {
        // Desktop: build the scene once the main thread is free.
        const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
        if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1500 });
        else setTimeout(start, 400);
      }
      return cleanup;
    };
    let cleanup = decide();
    const onChange = () => {
      cleanup?.();
      cleanup = reduce.matches ? (setMode("poster"), undefined) : decide();
    };
    reduce.addEventListener("change", onChange);
    return () => {
      cleanup?.();
      reduce.removeEventListener("change", onChange);
    };
  }, []);

  // Pause rendering while the hero is off screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer anywhere on the page nudges the camera and the key light.
  useEffect(() => {
    if (mode !== "3d") return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode]);

  // Measure the column inside the full-screen container.
  useEffect(() => {
    if (mode === "poster") return;
    const measure = () => {
      const c = container.current;
      const col = column.current;
      const sec = section.current;
      if (!c || !col || !sec) return;
      const cr = c.getBoundingClientRect();
      const r = col.getBoundingClientRect();
      frame.current.x = r.left - cr.left;
      frame.current.y = r.top - cr.top;
      frame.current.w = r.width;
      frame.current.h = r.height;
      box.current.W = cr.width;
      box.current.H = cr.height;
      const distance = Math.max(1, sec.offsetHeight - c.offsetHeight);
      box.current.growEnd = Math.min(0.2, Math.max(0.03, GROW_PX / distance));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (container.current) ro.observe(container.current);
    if (column.current) ro.observe(column.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [mode]);

  // One loop smooths the scroll and drives the frame, the headline, the
  // captions and the 3D camera from the same value, so they never drift apart.
  useEffect(() => {
    if (mode === "poster" || !active) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const goal = progress.current;
      shown.current = shown.current < 0 ? goal : shown.current + (goal - shown.current) * (1 - Math.exp(-7 * dt));
      if (Math.abs(shown.current - goal) < 0.0004) shown.current = goal;
      const p = shown.current;

      const { W, H, growEnd } = box.current;
      const { x, y, w, h } = frame.current;
      const g = smooth(0, growEnd, p);
      const aside = smooth(growEnd * 0.15, growEnd * 0.85, p);
      frame.current.grow = g;

      if (stage.current && W > 0) {
        const k = 1 - g;
        stage.current.style.clipPath = `inset(${y * k}px ${(W - x - w) * k}px ${(H - y - h) * k}px ${x * k}px round ${4 * k}px)`;
      }
      for (const el of [copy.current, ctas.current]) {
        if (!el) continue;
        el.style.opacity = String(1 - aside);
        el.style.transform = `translateY(${-28 * aside}px)`;
        // Out of the tab order once it has stepped aside; the heading stays for screen readers.
        el.inert = aside > 0.98;
      }
      if (rail.current) {
        rail.current.style.opacity = String(g);
        rail.current.style.visibility = g < 0.02 ? "hidden" : "visible";
        rail.current.inert = g < 0.98;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, active, progress]);

  const finished = step >= FINISHED;

  return (
    <section ref={section} className={cn("hero-pin relative", mode === "poster" && "!h-auto")} aria-labelledby="hero-title">
      <div
        ref={container}
        className={cn(
          "hero-sticky sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] min-h-[560px] flex-col overflow-hidden",
          mode === "poster" && "!relative !top-0 !h-auto",
        )}
      >
        {/* Full-screen 3D layer, clipped to the column until the first scroll. */}
        {mode !== "poster" && (
          <div ref={stage} aria-hidden="true" className="absolute inset-0 z-0" style={{ clipPath: "inset(0 0 0 100%)" }}>
            {mode === "3d" && (
              <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
                <FloorBuildScene
                  progress={shown}
                  frame={frame}
                  pointer={pointer}
                  quality={quality}
                  active={active}
                  onStage={setStep}
                  onReady={() => setReady(true)}
                  onDecline={() => {
                    if (!new URLSearchParams(window.location.search).has("hero")) setQuality("low");
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            "wrap pointer-events-none relative z-10 grid flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] gap-y-2 pb-5 pt-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-1 md:items-center md:gap-x-10 md:py-10",
            mode === "poster" && "!grid-rows-none gap-y-5",
          )}
        >
          <div ref={copy} className="pointer-events-auto will-change-transform">
            <h1 id="hero-title" className="display text-[40px] leading-[1] sm:text-[52px] lg:text-[64px] xl:text-[72px] xl:leading-[0.98]">
              {t("title")}
            </h1>
            <p className="measure mt-4 text-[16px] leading-[1.5] text-ink-soft sm:text-[19px] md:mt-7 md:max-w-[30em]">{t("sub")}</p>
            <div className="mt-9 hidden flex-wrap gap-3 md:flex">
              <ButtonLink href={whatsappLink()} target="_blank" rel="noopener noreferrer" size="lg" icon={<WhatsAppIcon />}>
                {tc("whatsappQuote")}
              </ButtonLink>
              <Link href="/projects" className={buttonClass("outline", "lg")}>
                {tc("seeProjects")}
              </Link>
            </div>
          </div>

          <div ref={column} className={cn("relative md:h-full md:max-h-[640px]", mode === "poster" ? "aspect-[4/3] md:h-auto" : "min-h-[240px]")}>
            {mode === "poster" ? (
              <div className="relative size-full overflow-hidden rounded-md">
                <Image src="/images/hero-section.png" alt={t("posterAlt")} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
              </div>
            ) : (
              // Still of the opening frame: first paint, and phones until they scroll.
              <div className={cn("absolute inset-0 overflow-hidden rounded-md transition-opacity duration-700", ready ? "opacity-0" : "opacity-100")}>
                <Image src="/images/hero-ward.png" alt="" aria-hidden="true" fill sizes="(min-width: 768px) 58vw, 100vw" priority quality={60} className="object-cover" />
              </div>
            )}
          </div>

          <div ref={ctas} className="pointer-events-auto flex flex-col gap-2.5 md:hidden">
            <ButtonLink href={whatsappLink()} target="_blank" rel="noopener noreferrer" size="lg" icon={<WhatsAppIcon />}>
              {tc("whatsappQuote")}
            </ButtonLink>
            <Link href="/projects" className={buttonClass("outline", "lg")}>
              {tc("seeProjects")}
            </Link>
          </div>
        </div>

        {/* Reduced motion: the finished section above, every layer listed here. */}
        {mode === "poster" && (
          <div className="wrap pb-10">
            <StepList steps={steps} current={-1} label={t("stepsLabel")} all />
          </div>
        )}

        {/* Captions over the full-screen scene: which layer is going down now. */}
        {mode !== "poster" && (
          <div ref={rail} className="pointer-events-none absolute inset-x-0 bottom-4 z-10 sm:bottom-8" style={{ opacity: 0, visibility: "hidden" }}>
            {/* Phones: stop short of the floating WhatsApp button. */}
            <div className="wrap max-sm:pr-[88px]">
              {finished ? (
                <div className="pointer-events-auto max-w-[400px] rounded-md bg-white/95 p-4 shadow-[0_2px_14px_rgba(35,49,45,0.1)] sm:p-5" aria-live="polite">
                  <p className="wide text-[19px] font-bold leading-tight tracking-[-0.01em] sm:text-[22px]">{t("doneTitle")}</p>
                  <p className="mt-1.5 text-[15px] leading-snug text-stone">{t("doneBody")}</p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <ButtonLink href={whatsappLink()} target="_blank" rel="noopener noreferrer" icon={<WhatsAppIcon />}>
                      {tc("getQuote")}
                    </ButtonLink>
                    <Link href="/services/homogeneous-vinyl" className={buttonClass("outline")}>
                      {t("doneLink")}
                    </Link>
                  </div>
                </div>
              ) : step < 0 ? (
                <p className="inline-block rounded-sm bg-white/90 px-3 py-2 text-[14px] text-stone shadow-[0_2px_10px_rgba(35,49,45,0.08)]">{t("keepScrolling")}</p>
              ) : (
                <StepList steps={steps} current={step} label={t("stepsLabel")} of={tc("ofTotal", { n: step + 1, total: steps.length })} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * The five layers. Full screen on desktop: the whole list, the current layer
 * expanded. Phones: just the current layer and a progress bar. With `all`,
 * every layer is expanded (reduced motion).
 */
function StepList({ steps, current, label, of, all = false }: { steps: Step[]; current: number; label: string; of?: string; all?: boolean }) {
  return (
    <div className={cn(!all && "max-w-[360px] rounded-md bg-white/95 p-3 shadow-[0_2px_14px_rgba(35,49,45,0.1)] sm:p-4")}>
      {!all && (
        <div className="mb-2 flex items-center gap-3 md:hidden" aria-hidden="true">
          <span className="text-[13px] text-stone">{of}</span>
          <span className="flex flex-1 gap-1">
            {steps.map((_, i) => (
              <span key={i} className={cn("h-[3px] flex-1 rounded-full", i < current ? "bg-weld" : i === current ? "bg-spruce" : "bg-hairline")} />
            ))}
          </span>
        </div>
      )}
      <ol aria-label={label} className={cn(all && "grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-5")}>
        {steps.map((s, i) => {
          const isCurrent = i === current;
          const done = all || i < current;
          return (
            <li
              key={s.title}
              aria-current={isCurrent ? "step" : undefined}
              className={cn("relative py-1.5 pl-4", !all && !isCurrent && "hidden md:block")}
            >
              <span
                aria-hidden="true"
                className={cn("absolute bottom-2 left-0 top-2 w-[3px] rounded-full transition-colors duration-300", isCurrent ? "bg-spruce" : done ? "bg-weld" : "bg-hairline")}
              />
              <p className={cn("text-[15px] leading-snug transition-colors duration-300", isCurrent ? "font-semibold text-spruce" : done ? "text-ink-soft" : "text-stone")}>
                <span className="mr-2 tabular-nums text-stone">{i + 1}</span>
                {s.title}
              </p>
              {(isCurrent || all) && <p className="mt-0.5 text-[14px] leading-snug text-stone" aria-live={all ? undefined : "polite"}>{s.body}</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
