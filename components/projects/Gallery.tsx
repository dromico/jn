"use client";

/**
 * Sebelum / semasa / selepas tabs over a photo grid, with a lightbox.
 * Pattern from "Gallery Grid with Lightbox" by moumensoliman (21st.dev, id 10596),
 * rebuilt with our tokens and proper keyboard support.
 */
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type Stage = "sebelum" | "semasa" | "selepas";

export function Gallery({
  title,
  photos,
  labels,
}: {
  title: string;
  photos: Record<Stage, string[]>;
  labels: Record<Stage, string> & Record<`${Stage}Long`, string> & { noPhotos: string; close: string; next: string; prev: string; open: string; slot: string };
}) {
  const stages: Stage[] = ["sebelum", "semasa", "selepas"];
  const initial = stages.find((s) => photos[s].length) ?? "sebelum";
  const [stage, setStage] = useState<Stage>(initial);
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const list = photos[stage];

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = -1;
    if (e.key === "ArrowRight") n = (i + 1) % stages.length;
    if (e.key === "ArrowLeft") n = (i - 1 + stages.length) % stages.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = stages.length - 1;
    if (n < 0) return;
    e.preventDefault();
    setStage(stages[n]);
    tabs.current[n]?.focus();
  };

  const show = (i: number, from: HTMLElement) => {
    opener.current = from;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    const dlg = dialog.current;
    if (!dlg) return;
    if (open !== null && !dlg.open) {
      dlg.showModal();
      window.__lenis?.stop();
    }
    if (open === null && dlg.open) {
      dlg.close();
      window.__lenis?.start();
    }
  }, [open]);

  return (
    <div>
      <div role="tablist" aria-label={title} className="flex gap-1 border-b border-hairline">
        {stages.map((s, i) => (
          <button
            key={s}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-tab-${s}`}
            aria-selected={stage === s}
            aria-controls={`${id}-panel`}
            tabIndex={stage === s ? 0 : -1}
            onClick={() => setStage(s)}
            onKeyDown={(e) => onTabKey(e, i)}
            className={cn("-mb-px min-h-11 border-b-2 px-4 text-[15px] font-semibold", stage === s ? "border-spruce text-spruce" : "border-transparent text-stone hover:text-spruce")}
          >
            {labels[s]}
            <span className="ml-1.5 font-normal text-stone">({photos[s].length})</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${stage}`} className="mt-6">
        {list.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {list.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={(e) => show(i, e.currentTarget)}
                  aria-label={labels.open.replace("{n}", String(i + 1))}
                  className="relative block aspect-[4/3] w-full overflow-hidden rounded-xs"
                >
                  <Image src={src} alt={`${title}, ${labels[`${stage}Long`]} ${i + 1}`} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <li key={n} className="flex aspect-[4/3] items-center justify-center rounded-xs bg-concrete p-4 text-center text-[14px] text-ink-soft">
                  {labels.slot.replace("{n}", String(n)).replace("{stage}", labels[`${stage}Long`].toLowerCase())}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] text-stone">{labels.noPhotos}</p>
          </>
        )}
      </div>

      <dialog
        ref={dialog}
        aria-label={title}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-spruce/95 p-0 text-on-dark backdrop:bg-transparent"
      >
        {open !== null && list[open] && (
          <div className="on-dark flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-[14px] text-on-dark-muted">
                {labels[`${stage}Long`]}, {open + 1} / {list.length}
              </p>
              <button type="button" onClick={close} aria-label={labels.close} className="flex size-11 items-center justify-center rounded-md hover:bg-white/10" autoFocus>
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image src={list[open]} alt={`${title}, ${labels[`${stage}Long`]} ${open + 1}`} fill sizes="100vw" className="object-contain" />
            </div>
            {list.length > 1 && (
              <div className="flex justify-center gap-3 py-4">
                <button type="button" onClick={() => step(-1)} aria-label={labels.prev} className="flex size-12 items-center justify-center rounded-md border border-dark-line hover:bg-white/10">
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label={labels.next} className="flex size-12 items-center justify-center rounded-md border border-dark-line hover:bg-white/10">
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
