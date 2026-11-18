import type { Localized } from "./types";

export type ProcessStepId =
  | "survey"
  | "moisture"
  | "grinding"
  | "levelling"
  | "adhesive"
  | "laying"
  | "welding"
  | "cove"
  | "handover";

export interface ProcessStep {
  id: ProcessStepId;
  title: Localized;
  body: Localized;
  /** A figure we actually work to, shown on the step */
  figure?: Localized;
}

/** The nine steps we follow on every job, in order. */
export const process: ProcessStep[] = [
  {
    id: "survey",
    title: { en: "Site survey", ms: "Tinjauan tapak" },
    body: {
      en: "We measure and photograph the site and agree the scope with you.",
      ms: "Kami ukur dan ambil gambar tapak, kemudian persetujui skop kerja bersama anda.",
    },
  },
  {
    id: "moisture",
    title: { en: "Moisture test", ms: "Ujian kelembapan" },
    body: {
      en: "We record slab moisture readings before we start, so the adhesive won't fail later.",
      ms: "Kami catat bacaan kelembapan slab sebelum mula, supaya gam tidak gagal kemudian.",
    },
    figure: { en: "Below 75% RH", ms: "Bawah 75% RH" },
  },
  {
    id: "grinding",
    title: { en: "Grinding", ms: "Pengisaran" },
    body: {
      en: "We grind off old adhesive, paint and laitance to get back to sound concrete.",
      ms: "Kami kisar gam lama, cat dan lapisan lemah (laitance) sehingga tinggal konkrit yang kukuh.",
    },
  },
  {
    id: "levelling",
    title: { en: "Self-levelling", ms: "Simen perata sendiri" },
    body: {
      en: "We prime the slab and pour self-levelling screed, then spike-roll out the air.",
      ms: "Kami sapu primer pada slab dan tuang simen perata sendiri (self-levelling), kemudian guna roller berpaku untuk buang udara.",
    },
    figure: { en: "Flat to ±2 mm over 2 m", ms: "Rata ±2 mm dalam 2 m" },
  },
  {
    id: "adhesive",
    title: { en: "Adhesive", ms: "Gam" },
    body: {
      en: "We spread the adhesive the manufacturer specifies with a notched trowel.",
      ms: "Kami sapu gam yang ditetapkan oleh pengeluar dengan sudip bertakuk.",
    },
  },
  {
    id: "laying",
    title: { en: "Laying", ms: "Pemasangan" },
    body: {
      en: "We lay the floor and roll it down with a 68 kg roller to push out trapped air.",
      ms: "Kami pasang lantai dan gelek dengan roller 68 kg untuk menolak keluar udara yang terperangkap.",
    },
    figure: { en: "45 kg and 68 kg rollers", ms: "Roller 45 kg dan 68 kg" },
  },
  {
    id: "welding",
    title: { en: "Hot-air welding", ms: "Kimpalan panas" },
    body: {
      en: "We groove every seam, weld it with matching rod, and trim it flush.",
      ms: "Kami alur setiap sambungan, kimpal dengan rod yang sepadan, dan potong rata.",
    },
    figure: { en: "4 mm weld rod", ms: "Rod kimpalan 4 mm" },
  },
  {
    id: "cove",
    title: { en: "Cove skirting", ms: "Skirting cove" },
    body: {
      en: "We run the floor up the wall so there are no corners for dirt to collect in.",
      ms: "Kami naikkan lantai ke dinding supaya tiada bucu untuk kotoran berkumpul.",
    },
    figure: { en: "100 to 150 mm high", ms: "Setinggi 100 hingga 150 mm" },
  },
  {
    id: "handover",
    title: { en: "Handover", ms: "Serahan" },
    body: {
      en: "We clean up, walk the floor with you, and hand over a photo report.",
      ms: "Kami bersihkan tapak, periksa lantai bersama anda, dan serahkan laporan bergambar.",
    },
  },
];

export function getSteps(ids: ProcessStepId[]) {
  return process.filter((s) => ids.includes(s.id));
}
