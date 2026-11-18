"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Google Maps iframe, only loaded when it gets near the viewport. */
export function MapEmbed({ src, title, className }: { src: string; title: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={box} className={cn("overflow-hidden rounded-md border border-hairline bg-concrete", className)}>
      {show && <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="size-full border-0" />}
    </div>
  );
}
