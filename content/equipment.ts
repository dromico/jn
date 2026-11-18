import type { Localized } from "./types";

export interface Tool {
  id: string;
  name: Localized;
  does: Localized;
  /** Photo slot. Drop the real file at this path; until then a labelled placeholder shows. */
  image: string;
  placeholder: Localized;
  /** Shown on the homepage row */
  featured?: boolean;
}

// Showcase only. Nothing here is for sale or rent.
export const equipment: Tool[] = [
  {
    id: "welder",
    name: { en: "Hot-air welding gun", ms: "Pistol kimpalan udara panas" },
    does: { en: "Melts weld rod into vinyl seams.", ms: "Mencairkan rod kimpalan ke dalam sambungan vinil." },
    image: "/images/equipment/hot-air-welder.jpg",
    placeholder: { en: "Photo: hot-air welder", ms: "Foto: pistol kimpalan" },
    featured: true,
  },
  {
    id: "mixer",
    name: { en: "Self-levelling mixer", ms: "Pengadun simen perata" },
    does: { en: "Mixes screed to an even, lump-free pour.", ms: "Mengadun simen perata supaya sekata dan tanpa ketulan." },
    image: "/images/equipment/levelling-mixer.jpg",
    placeholder: { en: "Photo: mixer and paddle", ms: "Foto: pengadun dan pedal" },
    featured: true,
  },
  {
    id: "groover",
    name: { en: "Seam groover", ms: "Pengalur sambungan" },
    does: { en: "Cuts the channel the weld rod sits in.", ms: "Memotong alur tempat rod kimpalan diletakkan." },
    image: "/images/equipment/seam-groover.jpg",
    placeholder: { en: "Photo: seam groover", ms: "Foto: pengalur sambungan" },
    featured: true,
  },
  {
    id: "moisture",
    name: { en: "Moisture meter", ms: "Meter kelembapan" },
    does: { en: "Checks the slab is dry enough to lay on.", ms: "Memastikan slab cukup kering untuk dipasang." },
    image: "/images/equipment/moisture-meter.jpg",
    placeholder: { en: "Photo: moisture meter", ms: "Foto: meter kelembapan" },
    featured: true,
  },
  {
    id: "grinder",
    name: { en: "Floor grinder", ms: "Mesin pengisar lantai" },
    does: { en: "Takes the slab back to sound concrete.", ms: "Mengisar slab sehingga tinggal konkrit yang kukuh." },
    image: "/images/equipment/floor-grinder.jpg",
    placeholder: { en: "Photo: floor grinder", ms: "Foto: mesin pengisar" },
  },
  {
    id: "spiked-roller",
    name: { en: "Spiked roller", ms: "Roller berpaku" },
    does: { en: "Releases air bubbles from fresh screed.", ms: "Melepaskan gelembung udara daripada simen perata yang baru dituang." },
    image: "/images/equipment/spiked-roller.jpg",
    placeholder: { en: "Photo: spiked roller", ms: "Foto: roller berpaku" },
  },
  {
    id: "roller",
    name: { en: "45 kg and 68 kg floor rollers", ms: "Roller lantai 45 kg dan 68 kg" },
    does: { en: "Presses the floor into the adhesive.", ms: "Menekan lantai ke dalam gam." },
    image: "/images/equipment/floor-roller.jpg",
    placeholder: { en: "Photo: floor roller", ms: "Foto: roller lantai" },
  },
  {
    id: "scraper",
    name: { en: "Floor scraper", ms: "Pengikis lantai" },
    does: { en: "Lifts old vinyl, tiles and adhesive.", ms: "Menanggalkan vinil lama, jubin dan gam." },
    image: "/images/equipment/floor-scraper.jpg",
    placeholder: { en: "Photo: floor scraper", ms: "Foto: pengikis lantai" },
  },
  {
    id: "laser",
    name: { en: "Laser level", ms: "Aras laser" },
    does: { en: "Sets levels and set-out lines across the room.", ms: "Menentukan aras dan garisan susunan di seluruh bilik." },
    image: "/images/equipment/laser-level.jpg",
    placeholder: { en: "Photo: laser level", ms: "Foto: aras laser" },
  },
];
