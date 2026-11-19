"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import type { FloorKind } from "@/components/hero/textures";
import { SwatchCanvas } from "@/components/ui/SwatchCanvas";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export interface NavFloor {
  slug: string;
  texture: FloorKind;
  edge: string;
  name: string;
  use: string;
}

type Labels = Record<
  "main" | "floors" | "allFloors" | "allFloorsBody" | "projects" | "about" | "contact" | "language" | "openMenu" | "closeMenu" | "home" | "getQuote",
  string
>;

export function LanguageToggle({ label, className, dark = false }: { label: string; className?: string; dark?: boolean }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const names: Record<Locale, { short: string; long: string }> = {
    en: { short: "EN", long: "English" },
    ms: { short: "BM", long: "Bahasa Malaysia" },
  };
  return (
    <div role="group" aria-label={label} className={cn("flex overflow-hidden rounded-md border text-[13px]", dark ? "border-dark-line" : "border-[#C3C9C5]", className)}>
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={pathname}
            locale={l}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            aria-label={names[l].long}
            className={cn(
              "flex min-h-9 min-w-10 items-center justify-center px-2.5 font-medium no-underline",
              active ? (dark ? "bg-on-dark text-spruce" : "bg-spruce text-slab") : dark ? "text-on-dark hover:bg-white/10" : "text-spruce hover:bg-black/5",
            )}
          >
            {names[l].short}
          </Link>
        );
      })}
    </div>
  );
}

export function NavbarClient({ floors, labels }: { floors: NavFloor[]; labels: Labels }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaId = useId();
  const mobileId = useId();
  const megaRef = useRef<HTMLDivElement>(null);
  const megaButton = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const closeAll = useCallback(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, []);

  // Close menus on navigation.
  useEffect(closeAll, [pathname, closeAll]);

  // Escape closes; clicking outside closes the mega menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (megaOpen) {
        setMegaOpen(false);
        megaButton.current?.focus();
      }
      setMobileOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (megaOpen && megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen]);

  // Lock scrolling behind the full-screen mobile menu.
  useEffect(() => {
    if (!mobileOpen) return;
    window.__lenis?.stop();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    root.dataset.menu = "open"; // hides the floating WhatsApp button (globals.css)
    return () => {
      window.__lenis?.start();
      root.style.overflow = prev;
      delete root.dataset.menu;
    };
  }, [mobileOpen]);

  const hoverOpen = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMegaOpen(true), 80);
  };
  const hoverClose = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMegaOpen(false), 180);
  };

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link href={href} aria-current={active ? "page" : undefined} className={cn("py-2 no-underline hover:text-vinyl", active && "underline decoration-2 underline-offset-[10px]")}>
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-[3px] z-50 border-b border-hairline bg-slab">
      <div className="wrap flex h-[68px] items-center justify-between gap-6">
        <Link href="/" aria-label={labels.home} className="wide flex shrink-0 items-center gap-2.5 text-lg font-bold tracking-[-0.01em] no-underline">
          <Image src="/images/logo/jaya-nexus-mark.png" alt="" width={41} height={36} priority className="h-9 w-auto" />
          <span>Jaya Nexus</span>
        </Link>

        <nav aria-label={labels.main} className="hidden items-center gap-8 text-[15px] lg:flex">
          <div ref={megaRef} className="relative" onMouseEnter={hoverOpen} onMouseLeave={hoverClose}>
            <button
              ref={megaButton}
              type="button"
              aria-expanded={megaOpen}
              aria-controls={megaId}
              onClick={() => setMegaOpen((o) => !o)}
              className={cn("flex items-center gap-1.5 py-2 hover:text-vinyl", pathname.startsWith("/services") && "underline decoration-2 underline-offset-[10px]")}
            >
              {labels.floors}
              <ChevronDown aria-hidden="true" className={cn("size-4 transition-transform", megaOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  id={megaId}
                  initial={reduce ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-1/2 top-full z-50 mt-3 w-[min(880px,calc(100vw-80px))] -translate-x-1/2 rounded-md border border-hairline bg-white p-6 shadow-[0_18px_40px_rgba(35,49,45,0.12)]"
                >
                  <ul className="grid grid-cols-3 gap-x-6 gap-y-5">
                    {floors.map((f) => (
                      <li key={f.slug}>
                        <Link href={`/services/${f.slug}`} className="group flex gap-3.5 rounded-sm no-underline">
                          <span className="block h-14 w-11 shrink-0 overflow-hidden rounded-xs" style={{ borderBottom: `4px solid ${f.edge}` }}>
                            <SwatchCanvas kind={f.texture} density={0.6} />
                          </span>
                          <span>
                            <span className="block font-semibold group-hover:text-vinyl">{f.name}</span>
                            <span className="block text-[13px] leading-snug text-stone">{f.use}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between gap-6 border-t border-hairline pt-5">
                    <p className="text-[14px] text-stone">{labels.allFloorsBody}</p>
                    <Link href="/services" className="shrink-0 font-semibold text-vinyl">
                      {labels.allFloors}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {navLink("/projects", labels.projects)}
          {navLink("/about", labels.about)}
          {navLink("/contact", labels.contact)}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageToggle label={labels.language} />
          <Link href="/contact" className={cn(buttonClass("primary"), "hidden px-[18px] text-[14px] sm:inline-flex")}>
            {labels.getQuote}
          </Link>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-md border border-spruce lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            aria-label={mobileOpen ? labels.closeMenu : labels.openMenu}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id={mobileId}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 bottom-0 top-[71px] z-40 overflow-y-auto bg-slab lg:hidden"
            data-lenis-prevent
          >
            <nav aria-label={labels.main} className="wrap flex flex-col gap-8 pb-28 pt-6">
              <div>
                <Link href="/services" className="wide text-2xl font-bold tracking-[-0.02em] no-underline">
                  {labels.floors}
                </Link>
                <ul className="mt-4 grid grid-cols-2 gap-3">
                  {floors.map((f) => (
                    <li key={f.slug}>
                      <Link href={`/services/${f.slug}`} className="flex items-center gap-3 rounded-sm py-1.5 no-underline">
                        <span className="block h-11 w-9 shrink-0 overflow-hidden rounded-xs" style={{ borderBottom: `3px solid ${f.edge}` }}>
                          <SwatchCanvas kind={f.texture} density={0.5} />
                        </span>
                        <span className="text-[15px] font-medium leading-tight">{f.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="flex flex-col gap-1 border-t border-hairline pt-6">
                {[
                  ["/projects", labels.projects],
                  ["/about", labels.about],
                  ["/contact", labels.contact],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="wide block py-2 text-2xl font-bold tracking-[-0.02em] no-underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={buttonClass("primary", "lg")}>
                {labels.getQuote}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
