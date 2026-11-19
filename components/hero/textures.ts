/**
 * Floor textures for the sample swatches (sample board, mega menu, service
 * heroes): photos where we have them, procedural painters otherwise. The hero
 * uses the homogeneous vinyl and concrete photos.
 *
 * To swap in photos of real floors, see ASSETS.md.
 */
import type { ServiceSlug } from "@/content/services";

export type FloorKind = ServiceSlug;

/** Floor order; also seeds each painter differently. */
export const floorOrder: FloorKind[] = [
  "homogeneous-vinyl",
  "vinyl-tiles-lvt",
  "sports-flooring",
  "gym-flooring",
  "anti-static-esd",
  "carpet",
];

/** Flat colour per floor, for CSS fallbacks before a canvas paints. */
export const floorBase: Record<FloorKind, string> = {
  "homogeneous-vinyl": "#C9DAD3",
  "vinyl-tiles-lvt": "#C29870",
  "sports-flooring": "#DDB98A",
  "gym-flooring": "#232527",
  "anti-static-esd": "#D9DCDA",
  carpet: "#5E6468",
};

type Ctx = CanvasRenderingContext2D;

export interface PaintTarget {
  c: Ctx;
  /** Optional height layer: mid grey is flat, lighter is raised. */
  h?: Ctx;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// ---------------------------------------------------------------------------
// Small helpers

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/**
 * Smooth blotchy noise: random grey pixels on a tiny canvas, upscaled with
 * smoothing. Cheap and good enough for mottling.
 */
function blotch(ctx: Ctx, r: Rect, cell: number, alpha: number, rand: () => number, mode: GlobalCompositeOperation = "overlay") {
  const gw = Math.max(2, Math.ceil(r.w / cell) + 1);
  const gh = Math.max(2, Math.ceil(r.h / cell) + 1);
  const small = makeCanvas(gw, gh);
  const sctx = small.getContext("2d")!;
  const img = sctx.createImageData(gw, gh);
  for (let i = 0; i < gw * gh; i++) {
    const v = Math.floor(rand() * 255);
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  sctx.putImageData(img, 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.w, r.h);
  ctx.clip();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = mode;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(small, r.x, r.y, gw * cell, gh * cell);
  ctx.restore();
}

/** Per-pixel grain (fine, uncorrelated noise). */
function grain(ctx: Ctx, r: Rect, amount: number, rand: () => number) {
  const x = Math.floor(r.x);
  const y = Math.floor(r.y);
  const w = Math.max(1, Math.floor(r.w));
  const h = Math.max(1, Math.floor(r.h));
  const img = ctx.getImageData(x, y, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * amount;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(img, x, y);
}

function fill(ctx: Ctx, r: Rect, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(r.x, r.y, r.w, r.h);
}

const grey = (v: number) => `rgb(${v},${v},${v})`;

function pick<T>(arr: T[], rand: () => number) {
  return arr[Math.floor(rand() * arr.length)];
}

function clip(ctx: Ctx, r: Rect, draw: () => void) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.w, r.h);
  ctx.clip();
  draw();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Painters. `s` is the pattern scale (1 = sample-swatch size, ~320 px tile).

function homogeneous(t: PaintTarget, r: Rect, s: number, rand: () => number) {
  const { c, h } = t;
  fill(c, r, "#C2D6CE");
  blotch(c, r, 60 * s, 0.3, rand);
  blotch(c, r, 14 * s, 0.2, rand);
  if (h) fill(h, r, grey(128));
  const chips = ["#A9B7B3", "#8FA19C", "#ECF1EF", "#9AABA6", "#B7C4C0", "#7E938D", "#DDE7E3"];
  const n = Math.floor((r.w * r.h) / (34 * s * s));
  clip(c, r, () => {
    for (let i = 0; i < n; i++) {
      const x = r.x + rand() * r.w;
      const y = r.y + rand() * r.h;
      const rx = (0.6 + rand() * 1.9) * s;
      const ry = rx * (0.35 + rand() * 0.45);
      const rot = (rand() - 0.5) * 0.6; // chips run roughly along the roll
      c.fillStyle = pick(chips, rand);
      c.globalAlpha = 0.55 + rand() * 0.45;
      c.beginPath();
      c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      c.fill();
      if (h && rand() < 0.4) {
        h.fillStyle = grey(140);
        h.beginPath();
        h.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
        h.fill();
      }
    }
    c.globalAlpha = 1;
  });
  if (h) blotch(h, r, 3 * s, 0.12, rand, "source-over");
}

function lvt(t: PaintTarget, r: Rect, s: number, rand: () => number) {
  const { c, h } = t;
  const tones = ["#C9A27A", "#B88F66", "#C29870", "#B5895F", "#CDA982", "#BC9269"];
  const rowH = 42 * s;
  fill(c, r, "#B88F66");
  if (h) fill(h, r, grey(128));
  clip(c, r, () => {
    let row = 0;
    for (let y = r.y - rand() * rowH; y < r.y + r.h; y += rowH, row++) {
      let x = r.x - rand() * 200 * s;
      while (x < r.x + r.w) {
        const len = (170 + rand() * 150) * s;
        const tone = pick(tones, rand);
        c.fillStyle = tone;
        c.fillRect(x, y, len, rowH);
        // grain: long thin wavy lines
        const lines = Math.floor(rowH / (1.6 * s));
        const phase = rand() * 10;
        for (let i = 0; i < lines; i++) {
          const ly = y + (i + 0.5) * (rowH / lines);
          c.strokeStyle = rand() < 0.5 ? "rgba(110,76,44,0.18)" : "rgba(235,205,165,0.16)";
          c.lineWidth = (0.4 + rand() * 0.9) * s;
          c.beginPath();
          for (let gx = 0; gx <= len; gx += 8 * s) {
            const wy = ly + Math.sin(gx / (40 * s) + phase + i * 0.7) * 1.2 * s + Math.sin(gx / (11 * s) + i) * 0.3 * s;
            if (gx === 0) c.moveTo(x + gx, wy);
            else c.lineTo(x + gx, wy);
          }
          c.stroke();
        }
        if (rand() < 0.25) {
          // a knot
          const kx = x + rand() * len;
          const ky = y + rowH * (0.3 + rand() * 0.4);
          const g = c.createRadialGradient(kx, ky, 0, kx, ky, 4 * s);
          g.addColorStop(0, "rgba(95,62,35,0.55)");
          g.addColorStop(1, "rgba(95,62,35,0)");
          c.fillStyle = g;
          c.beginPath();
          c.ellipse(kx, ky, 6 * s, 2.6 * s, 0, 0, Math.PI * 2);
          c.fill();
        }
        // bevelled joints
        c.fillStyle = "#8C6A48";
        c.fillRect(x, y, 1.1 * s, rowH);
        if (h) {
          h.fillStyle = grey(70);
          h.fillRect(x - 0.5 * s, y, 2 * s, rowH);
        }
        x += len;
      }
      c.fillStyle = "#8C6A48";
      c.fillRect(r.x, y, r.w, 1.1 * s);
      if (h) {
        h.fillStyle = grey(70);
        h.fillRect(r.x, y - 0.5 * s, r.w, 2 * s);
      }
    }
  });
  blotch(c, r, 80 * s, 0.18, rand);
}

function sports(t: PaintTarget, r: Rect, s: number, rand: () => number, lines = true) {
  const { c, h } = t;
  const tones = ["#DDB98A", "#D8B283", "#E2C094", "#D4AD7D", "#E0BB8D"];
  const strip = 13 * s;
  fill(c, r, "#DDB98A");
  if (h) fill(h, r, grey(128));
  clip(c, r, () => {
    for (let y = r.y; y < r.y + r.h; y += strip) {
      let x = r.x - rand() * 120 * s;
      while (x < r.x + r.w) {
        const len = (60 + rand() * 140) * s;
        c.fillStyle = pick(tones, rand);
        c.fillRect(x, y, len, strip);
        for (let i = 0; i < 4; i++) {
          c.strokeStyle = "rgba(150,105,60,0.12)";
          c.lineWidth = 0.6 * s;
          c.beginPath();
          const ly = y + rand() * strip;
          c.moveTo(x, ly);
          c.bezierCurveTo(x + len * 0.3, ly + (rand() - 0.5) * 3 * s, x + len * 0.6, ly + (rand() - 0.5) * 3 * s, x + len, ly);
          c.stroke();
        }
        c.fillStyle = "rgba(140,100,60,0.25)";
        c.fillRect(x, y, 0.6 * s, strip);
        x += len;
      }
      c.fillStyle = "rgba(140,100,60,0.18)";
      c.fillRect(r.x, y, r.w, 0.5 * s);
    }
    if (lines) {
      const lw = 3 * s;
      const m = Math.min(r.w, r.h);
      c.strokeStyle = "#F4F3EE";
      c.lineWidth = lw;
      const inset = m * 0.16;
      c.strokeRect(r.x + inset, r.y + inset, r.w - inset * 2, r.h - inset * 2);
      c.beginPath();
      c.moveTo(r.x + r.w / 2, r.y + inset);
      c.lineTo(r.x + r.w / 2, r.y + r.h - inset);
      c.stroke();
      c.strokeStyle = "#2E6E60";
      c.beginPath();
      c.arc(r.x + r.w / 2, r.y + r.h / 2, m * 0.15, 0, Math.PI * 2);
      c.stroke();
    }
  });
  blotch(c, r, 50 * s, 0.12, rand);
  if (h) blotch(h, r, 2 * s, 0.08, rand, "source-over");
}

function gym(t: PaintTarget, r: Rect, s: number, rand: () => number) {
  const { c, h } = t;
  fill(c, r, "#232527");
  blotch(c, r, 30 * s, 0.25, rand);
  if (h) {
    fill(h, r, grey(128));
    blotch(h, r, 1.6 * s, 0.7, rand, "source-over");
  }
  const flecks = ["#5D6E7E", "#47596A", "#6B7B8A", "#3A4550", "#54606B"];
  const n = Math.floor((r.w * r.h) / (14 * s * s));
  clip(c, r, () => {
    for (let i = 0; i < n; i++) {
      const x = r.x + rand() * r.w;
      const y = r.y + rand() * r.h;
      const rad = (0.5 + rand() * 1.2) * s;
      c.fillStyle = pick(flecks, rand);
      c.globalAlpha = 0.6 + rand() * 0.4;
      c.beginPath();
      // irregular granule
      const k = 5;
      for (let j = 0; j < k; j++) {
        const a = (j / k) * Math.PI * 2;
        const rr = rad * (0.6 + rand() * 0.6);
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr;
        if (j === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
    }
    c.globalAlpha = 1;
  });
  grain(c, r, 14, rand);
}

function esd(t: PaintTarget, r: Rect, s: number, rand: () => number) {
  const { c, h } = t;
  fill(c, r, "#D9DCDA");
  blotch(c, r, 50 * s, 0.25, rand);
  if (h) fill(h, r, grey(128));
  clip(c, r, () => {
    // conductive carbon fibres
    const n = Math.floor((r.w * r.h) / (260 * s * s));
    c.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const x = r.x + rand() * r.w;
      const y = r.y + rand() * r.h;
      const len = (1.5 + rand() * 5) * s;
      const a = rand() * Math.PI;
      c.strokeStyle = `rgba(48,54,53,${0.25 + rand() * 0.4})`;
      c.lineWidth = (0.35 + rand() * 0.4) * s;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + Math.cos(a) * len * 0.5 + (rand() - 0.5) * 2 * s, y + Math.sin(a) * len * 0.5, x + Math.cos(a) * len, y + Math.sin(a) * len);
      c.stroke();
    }
    // faint copper earthing grid
    const g = 64 * s;
    c.strokeStyle = "rgba(190,122,70,0.6)";
    c.lineWidth = 1.4 * s;
    for (let x = r.x + g / 2; x < r.x + r.w; x += g) {
      c.beginPath();
      c.moveTo(x, r.y);
      c.lineTo(x, r.y + r.h);
      c.stroke();
    }
    for (let y = r.y + g / 2; y < r.y + r.h; y += g) {
      c.beginPath();
      c.moveTo(r.x, y);
      c.lineTo(r.x + r.w, y);
      c.stroke();
    }
  });
  if (h) blotch(h, r, 3 * s, 0.1, rand, "source-over");
}

function carpet(t: PaintTarget, r: Rect, s: number, rand: () => number) {
  const { c, h } = t;
  fill(c, r, "#5A6064");
  blotch(c, r, 40 * s, 0.12, rand);
  if (h) fill(h, r, grey(60));
  const step = 4.2 * s;
  clip(c, r, () => {
    let row = 0;
    for (let y = r.y; y < r.y + r.h + step; y += step * 0.86, row++) {
      const off = row % 2 ? step / 2 : 0;
      for (let x = r.x - step + off; x < r.x + r.w + step; x += step) {
        const jx = x + (rand() - 0.5) * 0.8 * s;
        const jy = y + (rand() - 0.5) * 0.8 * s;
        const light = rand();
        c.fillStyle = light > 0.85 ? "#7C8388" : light > 0.4 ? "#686F73" : "#50565A";
        c.beginPath();
        c.ellipse(jx, jy, step * 0.42, step * 0.34, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "rgba(255,255,255,0.07)";
        c.beginPath();
        c.ellipse(jx - step * 0.1, jy - step * 0.1, step * 0.2, step * 0.14, 0, 0, Math.PI * 2);
        c.fill();
        if (h) {
          h.fillStyle = grey(150 + Math.floor(rand() * 60));
          h.beginPath();
          h.ellipse(jx, jy, step * 0.38, step * 0.3, 0, 0, Math.PI * 2);
          h.fill();
        }
      }
    }
  });
  grain(c, r, 10, rand);
}

const painters: Record<FloorKind, (t: PaintTarget, r: Rect, s: number, rand: () => number) => void> = {
  "homogeneous-vinyl": homogeneous,
  "vinyl-tiles-lvt": lvt,
  "sports-flooring": sports,
  "gym-flooring": gym,
  "anti-static-esd": esd,
  carpet,
};

/** Paint one floor into a rectangle. */
export function paintFloor(kind: FloorKind, target: PaintTarget, rect: Rect, scale = 1, seed = 7) {
  painters[kind](target, rect, scale, rng(seed + floorOrder.indexOf(kind) * 101));
}

// ---------------------------------------------------------------------------
// Photo textures (public/textures/*.webp, see ASSETS.md).
// If a file fails to load, that floor falls back to its procedural painter.

interface PhotoSpec {
  src: string;
  /** How many metres of floor one tile of the photo covers. */
  metres: number;
  /** The file is turned 90°; swatches turn it back so planks run left to right. */
  rotated?: boolean;
}

export const floorPhotos: Partial<Record<FloorKind, PhotoSpec>> = {
  "homogeneous-vinyl": { src: "/textures/homogeneous.webp", metres: 0.9 },
  "vinyl-tiles-lvt": { src: "/textures/lvt.webp", metres: 1.15, rotated: true },
  "sports-flooring": { src: "/textures/sports.webp", metres: 1.1, rotated: true },
  "gym-flooring": { src: "/textures/gym.webp", metres: 0.7 },
  "anti-static-esd": { src: "/textures/esd.webp", metres: 1.0 },
};

export const concretePhoto = "/textures/concrete.webp";

const imageCache = new Map<string, Promise<HTMLImageElement | null>>();

/** Load (once) and decode an image. Resolves to null if it fails. */
export function loadImage(src: string): Promise<HTMLImageElement | null> {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
}

/** Tile an image across a rectangle, mirroring every other tile so the edges never show a seam. */
function mirrorTile(ctx: Ctx, img: CanvasImageSource, r: Rect, tile: number) {
  clip(ctx, r, () => {
    for (let j = 0, y = r.y; y < r.y + r.h; y += tile, j++) {
      for (let i = 0, x = r.x; x < r.x + r.w; x += tile, i++) {
        const fx = i % 2 === 1;
        const fy = j % 2 === 1;
        ctx.save();
        ctx.translate(x + (fx ? tile : 0), y + (fy ? tile : 0));
        ctx.scale(fx ? -1 : 1, fy ? -1 : 1);
        ctx.drawImage(img, 0, 0, tile + 0.5, tile + 0.5);
        ctx.restore();
      }
    }
  });
}

/** Court markings over the sports floor. */
function courtLines(c: Ctx, r: Rect, s: number) {
  clip(c, r, () => {
    const m = Math.min(r.w, r.h);
    const inset = m * 0.16;
    c.lineWidth = 3.2 * s;
    c.strokeStyle = "#F4F3EE";
    c.strokeRect(r.x + inset, r.y + inset, r.w - inset * 2, r.h - inset * 2);
    c.beginPath();
    c.moveTo(r.x + r.w / 2, r.y + inset);
    c.lineTo(r.x + r.w / 2, r.y + r.h - inset);
    c.stroke();
    c.strokeStyle = "#2E6E60";
    c.beginPath();
    c.arc(r.x + r.w / 2, r.y + r.h / 2, m * 0.15, 0, Math.PI * 2);
    c.stroke();
  });
}

/** Faint copper earthing grid showing through the ESD floor. */
function copperGrid(c: Ctx, r: Rect, s: number) {
  clip(c, r, () => {
    const g = 64 * s;
    c.strokeStyle = "rgba(186,118,66,0.5)";
    c.lineWidth = 1.3 * s;
    c.beginPath();
    for (let x = r.x + g / 2; x < r.x + r.w; x += g) {
      c.moveTo(x, r.y);
      c.lineTo(x, r.y + r.h);
    }
    for (let y = r.y + g / 2; y < r.y + r.h; y += g) {
      c.moveTo(r.x, y);
      c.lineTo(r.x + r.w, y);
    }
    c.stroke();
  });
}

/**
 * Paint a floor sample (sample board, mega menu, service heroes) from its
 * photo texture, planks running left to right. Falls back to the
 * procedural painter for carpet, or if the photo fails to load.
 *
 * `pxPerMetre` sets the scale: how many canvas pixels one metre of floor takes.
 */
export async function paintFloorSwatch(kind: FloorKind, ctx: Ctx, r: Rect, pxPerMetre: number, seed = 5): Promise<void> {
  const spec = floorPhotos[kind];
  const img = spec ? await loadImage(spec.src) : null;
  const s = pxPerMetre / 300;
  if (!img || !spec) {
    paintFloor(kind, { c: ctx }, r, s, seed);
    return;
  }
  const tile = spec.metres * pxPerMetre;
  if (spec.rotated) {
    ctx.save();
    ctx.translate(r.x, r.y + r.h);
    ctx.rotate(-Math.PI / 2);
    mirrorTile(ctx, img, { x: 0, y: 0, w: r.h, h: r.w }, tile);
    ctx.restore();
  } else {
    mirrorTile(ctx, img, r, tile);
  }
  if (kind === "sports-flooring") courtLines(ctx, r, s);
  if (kind === "anti-static-esd") copperGrid(ctx, r, s);
}
