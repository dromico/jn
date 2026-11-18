"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Before/after slider. Drag the handle, click anywhere, or use the arrow keys
 * (Home/End jump to the ends).
 */
export function ImageCompare({
  before,
  after,
  beforeLabel,
  afterLabel,
  handleLabel,
  className,
}: {
  before: ReactNode;
  after: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  handleLabel: string;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromX = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromX(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromX(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={box}
      className={cn("relative touch-pan-y select-none overflow-hidden rounded-md", className)}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(35,49,45,0.15)]" style={{ left: `${pos}%` }} />
      <button
        type="button"
        role="slider"
        aria-label={handleLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}%`}
        onKeyDown={onKey}
        className="absolute top-1/2 flex size-[52px] -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-spruce text-white shadow-[0_4px_14px_rgba(35,49,45,0.3)]"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight aria-hidden="true" className="size-6" />
      </button>

      <span className="pointer-events-none absolute left-4 top-4 rounded-sm bg-spruce px-2.5 py-1.5 text-[13px] font-semibold text-slab">{beforeLabel}</span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-sm bg-vinyl px-2.5 py-1.5 text-[13px] font-semibold text-white">{afterLabel}</span>
    </div>
  );
}
