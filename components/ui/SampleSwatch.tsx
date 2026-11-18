import { Link } from "@/i18n/navigation";
import type { FloorKind } from "@/components/hero/textures";
import { SwatchCanvas } from "./SwatchCanvas";
import { TiltCard } from "./TiltCard";

/** A physical-looking floor sample: 4:5 tile, 8px darker thickness edge, name and use below. */
export function SampleSwatch({ slug, texture, edge, name, use }: { slug: string; texture: FloorKind; edge: string; name: string; use: string }) {
  return (
    <Link href={`/services/${slug}`} className="group block rounded-xs no-underline">
      <TiltCard className="aspect-[4/5] rounded-xs shadow-[0_1px_0_rgba(35,49,45,0.08)]" style={{ borderBottom: `8px solid ${edge}` }}>
        <SwatchCanvas kind={texture} />
      </TiltCard>
      <p className="mb-1 mt-3.5 text-[17px] font-semibold leading-snug group-hover:text-vinyl">{name}</p>
      <p className="text-[14px] leading-[1.45] text-stone">{use}</p>
    </Link>
  );
}
