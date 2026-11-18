"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/content/site";
import { buttonClass, ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { useScrollProgress } from "./useScrollProgress";

const VinylRollScene = dynamic(() => import("./VinylRollScene"), { ssr: false });

export interface HeroFloor {
  name: string;
  spec: string;
}

type Mode = "pending" | "3d" | "poster";

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero({ floors }: { floors: HeroFloor[] }) {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const [mode, setMode] = useState<Mode>("pending");
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const [zone, setZone] = useState(0);

  const progress = useScrollProgress(section, mode === "3d");

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

  const laid = mode === "poster" || zone >= floors.length;
  const card = laid ? { name: t("laidTitle"), spec: t("laidBody") } : floors[zone];

  return (
    <section ref={section} className={cn("hero-pin relative", mode === "poster" && "!h-auto")} aria-labelledby="hero-title">
      <div className={cn("hero-sticky sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] min-h-[560px] flex-col", mode === "poster" && "!relative !top-0 !h-auto")}>
        <div className={cn("wrap grid flex-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-y-2 pb-5 pt-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-1 md:items-center md:gap-x-10 md:py-10", mode === "poster" && "!grid-rows-none gap-y-5")}>
          <div className="md:row-span-1">
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

          <div className={cn("relative min-h-0 md:h-full md:max-h-[640px]", mode === "poster" && "aspect-[3/2] md:aspect-[4/3] md:h-auto")}>
            <div ref={stage} className="relative size-full min-h-[240px] overflow-hidden rounded-md bg-slab">
              {mode === "3d" && (
                <div className={cn("absolute inset-0 z-[1] transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
                  <VinylRollScene
                    progress={progress}
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
              {mode === "poster" && (
                <Image src="/images/hero-poster.png" alt={t("posterAlt")} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" priority={false} />
              )}
              {mode !== "poster" && (
                <Image
                  src="/images/hero-start.png"
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  priority
                  quality={60}
                  className={cn("object-cover transition-opacity duration-700", ready ? "opacity-0" : "opacity-100")}
                />
              )}
            </div>

            <div className="absolute right-3 top-3 z-[2] rounded-md border border-hairline bg-white px-3 py-2 text-[12px] leading-[1.5] sm:right-4 sm:top-4 sm:px-4 sm:py-3 sm:text-[14px]" aria-live="polite">
              <p className="font-semibold">{card.name}</p>
              <p className="text-stone">{card.spec}</p>
              {!laid && <p className="mt-1 text-stone">{tc("ofTotal", { n: zone + 1, total: floors.length })}</p>}
            </div>
            {mode === "3d" && !laid && <p className="mt-2.5 hidden text-[13px] text-stone md:block">{t("keepScrolling")}</p>}
          </div>

          <div className="flex flex-col gap-2.5 md:hidden">
            <ButtonLink href={whatsappLink()} target="_blank" rel="noopener noreferrer" size="lg" icon={<WhatsAppIcon />}>
              {tc("whatsappQuote")}
            </ButtonLink>
            <Link href="/projects" className={buttonClass("outline", "lg")}>
              {tc("seeProjects")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
