"use client";

/**
 * Full-page hero. The 3D scene is a full-screen canvas that opens clipped to
 * the right-hand column (the mockup's layout) and grows to fill the screen
 * over the first scroll, as in the "Video Scroll Hero" pattern (21st.dev, id
 * 7512). The headline and buttons step aside as it grows, so the floor gets
 * the full width for the unroll and the top-down finish.
 */
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/content/site";
import { buttonClass, ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SwatchCanvas } from "@/components/ui/SwatchCanvas";
import { cn } from "@/lib/cn";
import type { FloorKind } from "./textures";
import type { SceneFrame } from "./VinylRollScene";
import { useScrollProgress } from "./useScrollProgress";

const VinylRollScene = dynamic(() => import("./VinylRollScene"), { ssr: false });

export interface HeroFloor {
  name: string;
  spec: string;
  texture: FloorKind;
}

type Mode = "pending" | "3d" | "poster";

/** Pixels of scroll it takes the frame to grow to full screen. */
const GROW_PX = 160;

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

export function Hero({ floors }: { floors: HeroFloor[] }) {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const section = useRef<HTMLElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const column = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const ctas = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const shown = useRef(-1);
  const frame = useRef<SceneFrame>({ grow: 0, x: 0, y: 0, w: 0, h: 0 });
  const box = useRef({ W: 0, H: 0, growEnd: 0.08 });

  const [mode, setMode] = useState<Mode>("pending");
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const [zone, setZone] = useState(0);

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

  // Pointer anywhere on the page steers the camera and the key light.
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

  // One loop smooths the scroll and drives the frame, the headline, the card
  // and the 3D camera from the same value, so they never drift apart.
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
      // The card rises to the top of the screen but stays lined up with the
      // page's right margin (and the navbar's quote button).
      if (card.current && W > 0) card.current.style.transform = `translateY(${(12 - y) * g}px)`;
      if (rail.current) {
        rail.current.style.opacity = String(g);
        rail.current.style.visibility = g < 0.02 ? "hidden" : "visible";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, active, progress]);

  const laid = mode === "poster" || zone >= floors.length;
  const current = laid ? { name: t("laidTitle"), spec: t("laidBody") } : floors[zone];

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
                <VinylRollScene
                  progress={shown}
                  frame={frame}
                  pointer={pointer}
                  quality={quality}
                  active={active}
                  onZone={setZone}
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

          <div ref={column} className={cn("relative md:h-full md:max-h-[640px]", mode === "poster" ? "aspect-[3/2] md:aspect-[4/3] md:h-auto" : "min-h-[240px]")}>
            {mode === "poster" ? (
              <div className="relative size-full overflow-hidden rounded-md">
                <Image src="/images/hero-poster.png" alt={t("posterAlt")} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
              </div>
            ) : (
              // Still of the opening frame: first paint, and phones until they scroll.
              <div className={cn("absolute inset-0 overflow-hidden rounded-md transition-opacity duration-700", ready ? "opacity-0" : "opacity-100")}>
                <Image src="/images/hero-start.png" alt="" aria-hidden="true" fill sizes="(min-width: 768px) 58vw, 100vw" priority quality={60} className="object-cover" />
              </div>
            )}

            <div
              ref={card}
              className="absolute right-3 top-3 rounded-md border border-hairline bg-white px-3 py-2 text-[12px] leading-[1.5] will-change-transform sm:right-4 sm:top-4 sm:px-4 sm:py-3 sm:text-[14px]"
              aria-live="polite"
            >
              <p className="font-semibold">{current.name}</p>
              <p className="text-stone">{current.spec}</p>
              {!laid && <p className="mt-1 text-stone">{tc("ofTotal", { n: zone + 1, total: floors.length })}</p>}
            </div>
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

        {/* Six floors as a strip of samples: which one is on the roll now. */}
        {mode !== "poster" && (
          <div ref={rail} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-5 z-10 sm:bottom-8" style={{ opacity: 0, visibility: "hidden" }}>
            {/* Bottom left, where the headline was, clear of the WhatsApp button. */}
            <div className="wrap flex items-center gap-4">
              <ol className="flex gap-1.5 rounded-md bg-white/90 p-1.5 shadow-[0_2px_10px_rgba(35,49,45,0.08)]">
                {floors.map((f, i) => (
                  <li
                    key={f.texture}
                    className={cn(
                      "size-6 overflow-hidden rounded-xs transition-[opacity,outline-color] duration-300 sm:size-7",
                      laid || i <= zone ? "opacity-100" : "opacity-35",
                      !laid && i === zone ? "outline-2 outline-offset-2 outline-spruce" : "outline-0 outline-transparent",
                    )}
                  >
                    <SwatchCanvas kind={f.texture} density={0.35} />
                  </li>
                ))}
              </ol>
              {!laid && <p className="hidden rounded-sm bg-slab/85 px-2 py-1 text-[13px] text-stone sm:block">{t("keepScrolling")}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
