"use client";

/** Filterable project grid (by floor and by sector) with Motion layout animations. */
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export interface GridProject {
  slug: string;
  title: string;
  meta: string;
  services: string[];
  sector?: string;
  cover: string | null;
  photoLabel: string;
  placeholder?: boolean;
}

interface Option {
  value: string;
  label: string;
}

function FilterGroup({ label, options, value, onChange, allLabel }: { label: string; options: Option[]; value: string; onChange: (v: string) => void; allLabel: string }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="mb-2 w-full text-[14px] text-stone">{label}</legend>
      {[{ value: "all", label: allLabel }, ...options].map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn("min-h-10 rounded-sm border px-3 text-[14px]", active ? "border-spruce bg-spruce text-slab" : "border-hairline-strong hover:border-spruce")}
          >
            {o.label}
          </button>
        );
      })}
    </fieldset>
  );
}

export function ProjectGrid({
  projects,
  serviceOptions,
  sectorOptions,
  labels,
}: {
  projects: GridProject[];
  serviceOptions: Option[];
  sectorOptions: Option[];
  labels: { service: string; sector: string; all: string; empty: string; placeholder: string; countTemplate: { zero: string; one: string; other: string } };
}) {
  const [service, setService] = useState("all");
  const [sector, setSector] = useState("all");
  const reduce = useReducedMotion();

  const shown = useMemo(
    () => projects.filter((p) => (service === "all" || p.services.includes(service)) && (sector === "all" || p.sector === sector)),
    [projects, service, sector],
  );
  const usedSectors = sectorOptions.filter((o) => projects.some((p) => p.sector === o.value));
  const count = shown.length === 0 ? labels.countTemplate.zero : (shown.length === 1 ? labels.countTemplate.one : labels.countTemplate.other).replace("#", String(shown.length));

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-hairline pb-8 lg:flex-row lg:gap-12">
        <FilterGroup label={labels.service} options={serviceOptions} value={service} onChange={setService} allLabel={labels.all} />
        <FilterGroup label={labels.sector} options={usedSectors} value={sector} onChange={setSector} allLabel={labels.all} />
      </div>
      <p className="mt-6 text-[14px] text-stone" aria-live="polite">
        {count}
      </p>

      <LayoutGroup>
        <motion.ul layout={!reduce} className="mt-6 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <Link href={`/projects/${p.slug}`} className="group block no-underline">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xs">
                    {p.cover ? (
                      <Image src={p.cover} alt={p.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-concrete p-5 text-center text-[14px] text-ink-soft">{p.photoLabel}</div>
                    )}
                    {p.placeholder && <span className="absolute left-3 top-3 rounded-sm bg-white px-2 py-1 text-[12px] font-medium text-stone">{labels.placeholder}</span>}
                  </div>
                  <h2 className="mt-4 text-[18px] font-semibold leading-snug group-hover:text-vinyl">{p.title}</h2>
                  <p className="mt-1 text-[14px] text-stone">{p.meta}</p>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
      {shown.length === 0 && <p className="mt-6 text-ink-soft">{labels.empty}</p>}
    </div>
  );
}
