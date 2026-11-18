import { cn } from "@/lib/cn";

/**
 * Client logos scrolling sideways. Pauses on hover and focus, stops for
 * reduced motion (see .marquee in globals.css). Items are duplicated once so
 * the loop is seamless; the copy is hidden from assistive tech.
 */
export function LogoMarquee({ items, label, className }: { items: { name: string; src?: string }[]; label: string; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 gap-4 pr-4" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex h-14 w-[168px] items-center justify-center rounded-sm border border-dashed border-[#B3BBB7] text-[13px] text-stone">
          {item.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.src} alt={hidden ? "" : item.name} className="max-h-9 max-w-[130px] object-contain grayscale" loading="lazy" />
          ) : (
            <span>{item.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]", className)} aria-label={label} role="region" tabIndex={0}>
      <div className="marquee-track flex w-max" style={{ ["--marquee-duration" as string]: `${items.length * 5}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
