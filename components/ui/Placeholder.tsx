import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A pale-grey block labelled with the photo that belongs there.
 * When `src` is given, shows the real image instead.
 */
export function Photo({
  src,
  alt,
  label,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  tone = "concrete",
  priority,
  labelAlign = "center",
  fit = "cover",
}: {
  src?: string | null;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
  tone?: "concrete" | "mint" | "stone";
  priority?: boolean;
  /** Where the placeholder label sits (used by the before/after slider so both labels stay readable). */
  labelAlign?: "center" | "start" | "end";
  /** "contain" shows the whole image on white with a margin: for product shots on a white background. */
  fit?: "cover" | "contain";
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xs", className)}>
      {src && fit === "contain" ? (
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-[8%]">
            <Image src={src} alt={alt} fill sizes={sizes} className="object-contain" priority={priority} />
          </div>
        </div>
      ) : src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
      ) : (
        <div
          role="img"
          aria-label={label}
          className={cn(
            "flex size-full items-center p-5 text-center text-[14px]",
            labelAlign === "center" && "justify-center",
            labelAlign === "start" && "justify-start pl-[8%] text-left",
            labelAlign === "end" && "justify-end pr-[8%] text-right",
            tone === "concrete" && "bg-concrete text-ink-soft",
            tone === "mint" && "bg-mint text-[#2E4A42]",
            tone === "stone" && "bg-[#D2D4CF] text-ink-soft",
          )}
        >
          <span aria-hidden="true" className={labelAlign === "center" ? undefined : "max-w-[38%]"}>{label}</span>
        </div>
      )}
    </div>
  );
}
