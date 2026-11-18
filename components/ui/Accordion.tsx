"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

/** Accessible accordion: buttons with aria-expanded, arrow keys move between headers. */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = items.length;
    let next = -1;
    if (e.key === "ArrowDown") next = (i + 1) % n;
    else if (e.key === "ArrowUp") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    buttons.current[next]?.focus();
  };

  return (
    <div className="border-t border-hairline">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-hairline">
            <h3>
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                type="button"
                id={`${id}-h${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={(e) => onKey(e, i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold"
              >
                {item.q}
                <Plus aria-hidden="true" className={cn("size-5 shrink-0 transition-transform duration-200", isOpen && "rotate-45")} />
              </button>
            </h3>
            <div
              id={`${id}-p${i}`}
              role="region"
              aria-labelledby={`${id}-h${i}`}
              className={cn("grid transition-[grid-template-rows] duration-200", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="measure pb-6 text-ink-soft">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
