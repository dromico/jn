"use client";

/**
 * The hero: a hospital ward as an architect's cutaway model. Scrolling dives
 * into the cut corner of the floor, takes the floor back to the bare slab and
 * builds it up again, one layer at a time: white primer, 3 mm self-levelling
 * compound, white adhesive, then 2 mm homogeneous vinyl, coved up the wall
 * and heat-welded with a rod a shade darker than the floor. The camera then
 * pulls back to the finished, furnished room.
 *
 * World units are metres. Layer thicknesses are exaggerated (about ×5) and
 * each layer stops short of the one below, so the cut edge reads as steps.
 */
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { concretePhoto, floorPhotos, loadImage } from "./textures";

// ---------------------------------------------------------------------------
// Dimensions

const W = 4.4; // room width (x)
const D = 3.6; // room depth (z); the open front edge is at z = D
const WALL_T = 0.12;
const WALL_H = 2.5;
const SLAB_T = 0.24;

const PRIMER = 0.007;
const SCREED = 0.032;
const ADH = 0.011;
const VINYL = 0.018;
const Y_SCREED = PRIMER;
const Y_ADH = PRIMER + SCREED;
const Y_VINYL = Y_ADH + ADH;
const Y_TOP = Y_VINYL + VINYL;

/** Each layer's front edge steps back from the slab edge. 1 primer … 4 vinyl. */
const STEP = 0.09;
const edgeZ = (i: number) => D - i * STEP;

const COVE_R = 0.05;
const COVE_H = 0.16;
const FLANGE = 0.07;
/** Where the coved skirting meets the floor sheet (and is welded). */
const JOINT = COVE_R + FLANGE;
/** Seam between the two floor sheets. */
const SEAM_X = 2.2;
const VINYL_LEN = edgeZ(4) - JOINT;
const CORE = 0.06;

// Window in the left wall
const WIN_Z0 = 1.15;
const WIN_Z1 = 2.35;
const WIN_Y0 = 0.9;
const WIN_Y1 = 2.1;

// ---------------------------------------------------------------------------
// Public types

/**
 * Where the visible frame sits inside the full-bleed canvas. The hero opens
 * with the scene clipped to the right-hand column and grows it to the full
 * screen; `grow` runs 0 (column) to 1 (full screen). Rect is in CSS pixels,
 * relative to the canvas.
 */
export interface SceneFrame {
  grow: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SceneProps {
  /** 0..1 scroll progress, already smoothed by the parent; read every frame. */
  progress: MutableRefObject<number>;
  frame: MutableRefObject<SceneFrame>;
  /** Normalised pointer, -1..1 on each axis, written by the parent. */
  pointer: MutableRefObject<{ x: number; y: number }>;
  quality: "high" | "low";
  active: boolean;
  /** -1 the room, 0 slab, 1 primer, 2 self-levelling, 3 adhesive, 4 vinyl, 5 finished. */
  onStage?: (stage: number) => void;
  onReady?: () => void;
  /** Called when the frame rate drops, so the parent can lower quality. */
  onDecline?: () => void;
}

// ---------------------------------------------------------------------------
// Timeline

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lin = (a: number, b: number, v: number) => clamp01((v - a) / (b - a));
const smooth = (a: number, b: number, v: number) => {
  const x = lin(a, b, v);
  return x * x * (3 - 2 * x);
};
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeIn = (x: number) => x * x;

/** Scroll position (0..1) at which each caption takes over. */
export const STAGE_AT = [0.15, 0.25, 0.36, 0.51, 0.615, 0.86];

export function stageAt(p: number) {
  let s = -1;
  for (let i = 0; i < STAGE_AT.length; i++) if (p >= STAGE_AT[i]) s = i;
  return s;
}

/**
 * Everything the scene does is a function of scroll progress. While the
 * camera dives in (p < 0.2) the floor rewinds to bare slab, last layer
 * first; then each layer is built in turn.
 */
function timeline(p: number) {
  const rew = p < 0.2;
  const fwd = (a: number, b: number) => lin(a, b, p);
  const rev = (a: number, b: number) => 1 - lin(a, b, p);
  return {
    dive: easeInOut(lin(0.03, 0.21, p)),
    back: easeInOut(lin(0.85, 0.985, p)),
    /** Furniture lifts out for the works and drops back in at the end. */
    lift: smooth(0.035, 0.12, p) * (1 - smooth(0.9, 0.975, p)),
    primer: rew ? rev(0.16, 0.175) : fwd(0.25, 0.345),
    screed: rew ? rev(0.14, 0.16) : fwd(0.37, 0.505),
    adhesive: rew ? rev(0.12, 0.14) : fwd(0.515, 0.61),
    /** 0: the full rolls sit at the front edge; 1: lifted away. */
    drop: rew ? lin(0.11, 0.125, p) : 1 - fwd(0.62, 0.645),
    vinylA: rew ? rev(0.08, 0.11) : fwd(0.645, 0.725),
    vinylB: rew ? rev(0.08, 0.11) : fwd(0.66, 0.735),
    cove: rew ? rev(0.07, 0.085) : fwd(0.735, 0.765),
    weld: rew ? rev(0.065, 0.08) : fwd(0.765, 0.845),
    tools: !rew,
    /** Slow orbit across the build so the close-up never sits still. */
    drift: lin(0.18, 0.85, p),
    /** The close-up widens while the rolls run away from the camera. */
    wide: smooth(0.63, 0.72, p),
  };
}

// ---------------------------------------------------------------------------
// Geometry helpers

/** Axis-aligned box from its bounds. */
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return g;
}

/** Planar UVs in metres, picked per face from its normal (for tiled photos). */
function worldUV<G extends THREE.BufferGeometry>(g: G, tile: number): G {
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const ax = Math.abs(nor.getX(i));
    const ay = Math.abs(nor.getY(i));
    const az = Math.abs(nor.getZ(i));
    let u: number;
    let v: number;
    if (ay >= ax && ay >= az) {
      u = pos.getX(i);
      v = pos.getZ(i);
    } else if (ax >= az) {
      u = pos.getZ(i);
      v = pos.getY(i);
    } else {
      u = pos.getX(i);
      v = pos.getY(i);
    }
    uv[i * 2] = u / tile;
    uv[i * 2 + 1] = v / tile;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

/** A cylinder running from a to b. */
function rodGeometry(a: THREE.Vector3, b: THREE.Vector3, r: number, seg = 10) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const g = new THREE.CylinderGeometry(r, r, len, seg);
  g.translate(0, len / 2, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  g.applyQuaternion(q);
  g.translate(a.x, a.y, a.z);
  return g;
}

/** Cross-section of the coved skirting: up the wall, round the cove, out to the joint. */
function coveShape() {
  const s = new THREE.Shape();
  const y = Y_VINYL;
  s.moveTo(0, COVE_H);
  s.lineTo(0, y + COVE_R);
  s.absarc(COVE_R, y + COVE_R, COVE_R, Math.PI, Math.PI * 1.5, false);
  s.lineTo(JOINT, y);
  s.lineTo(JOINT, y + VINYL);
  s.lineTo(COVE_R, y + VINYL);
  s.absarc(COVE_R, y + COVE_R, COVE_R - VINYL, Math.PI * 1.5, Math.PI, true);
  s.lineTo(VINYL, COVE_H);
  s.closePath();
  return s;
}

/** The cove former that fills the corner behind the curve. */
function formerShape() {
  const s = new THREE.Shape();
  const y = Y_VINYL;
  s.moveTo(0, y);
  s.lineTo(COVE_R, y);
  s.absarc(COVE_R, y + COVE_R, COVE_R, Math.PI * 1.5, Math.PI, true);
  s.lineTo(0, y);
  return s;
}

/** Adhesive combed into ridges by the notched trowel, across the full width. */
function adhesiveShape(pitch: number) {
  const s = new THREE.Shape();
  const base = Y_ADH + ADH * 0.36;
  s.moveTo(0, Y_ADH);
  s.lineTo(W, Y_ADH);
  s.lineTo(W, base);
  for (let x = W; x > pitch; x -= pitch) {
    s.lineTo(x - pitch * 0.18, base);
    s.lineTo(x - pitch * 0.3, Y_ADH + ADH);
    s.lineTo(x - pitch * 0.62, Y_ADH + ADH);
    s.lineTo(x - pitch * 0.74, base);
  }
  s.lineTo(0, base);
  s.closePath();
  return s;
}

// ---------------------------------------------------------------------------
// The vinyl roll: one strip with real thickness. Laid material lies flat
// behind the roll; the rest winds on an Archimedean spiral that shrinks as the
// roll unwinds. Local x runs along the sheet, z across it.

const VERTS_PER_RING = 8;

class RollSheet extends THREE.BufferGeometry {
  private pos: THREE.BufferAttribute;
  private nor: THREE.BufferAttribute;
  private cx: Float32Array;
  private cy: Float32Array;
  private tx: Float32Array;
  private ty: Float32Array;

  constructor(
    readonly segments: number,
    readonly length: number,
    readonly width: number,
  ) {
    super();
    const rings = segments + 1;
    const count = rings * VERTS_PER_RING + 4;
    this.pos = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.nor = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.pos.setUsage(THREE.DynamicDrawUsage);
    this.nor.setUsage(THREE.DynamicDrawUsage);
    const uv = new Float32Array(count * 2);
    this.cx = new Float32Array(rings);
    this.cy = new Float32Array(rings);
    this.tx = new Float32Array(rings);
    this.ty = new Float32Array(rings);

    for (let k = 0; k < rings; k++) {
      const u = k / segments;
      const b = k * VERTS_PER_RING * 2;
      uv.set([u, 0, u, 1, u, 0, u, 1], b);
      const su = u * length * 3;
      uv.set([su, 0, su, 1, su, 0, su, 1], b + 8);
    }
    uv.set([0, 0, 1, 0, 0, 1, 1, 1], rings * VERTS_PER_RING * 2);

    const faces: number[] = [];
    const edges: number[] = [];
    for (let k = 0; k < segments; k++) {
      const a = k * VERTS_PER_RING;
      const c = (k + 1) * VERTS_PER_RING;
      faces.push(a, a + 1, c, a + 1, c + 1, c);
      faces.push(a + 2, c + 2, a + 3, a + 3, c + 2, c + 3);
      edges.push(a + 5, c + 5, a + 4, c + 5, c + 4, a + 4);
      edges.push(a + 7, a + 6, c + 7, c + 7, a + 6, c + 6);
    }
    const ec = rings * VERTS_PER_RING;
    edges.push(ec, ec + 2, ec + 1, ec + 1, ec + 2, ec + 3);

    this.setIndex([...faces, ...edges]);
    this.addGroup(0, faces.length, 0);
    this.addGroup(faces.length, edges.length, 1);
    this.setAttribute("position", this.pos);
    this.setAttribute("normal", this.nor);
    this.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    this.update(0, 0);
  }

  /** Lay out the sheet with `s` metres unrolled. Returns the roll's outer radius. */
  update(s: number, settle: number) {
    const N = this.segments;
    const L = this.length;
    const t = VINYL;
    const rOuter = Math.sqrt(CORE * CORE + ((L - s) * t) / Math.PI);
    const rMid = rOuter - t / 2;
    const ccx = s;
    const ccy = rOuter;
    const { cx, cy, tx, ty } = this;

    let theta = 0;
    let prevU = s;
    for (let k = 0; k <= N; k++) {
      const u = (k / N) * L;
      if (u <= s) {
        // Laid flat, with a low hump just behind the roll and a slight curl at
        // the cut edge that both relax once the sheet is down.
        const d = s - u;
        const w = 0.16;
        const hump = 0.006 * (d / w) * Math.exp(1 - d / w) * (1 - settle);
        const dh = 0.006 * (1 - settle) * Math.exp(1 - d / w) * (1 / w) * (d / w - 1);
        const curl = 0.012 * Math.exp(-u / 0.08) * (1 - Math.min(1, s / 0.8)) * (1 - settle);
        const dc = -curl / 0.08;
        cx[k] = u;
        cy[k] = t / 2 + hump + curl;
        const dy = dh + dc;
        const len = Math.hypot(1, dy);
        tx[k] = 1 / len;
        ty[k] = dy / len;
      } else {
        const du = u - prevU;
        const r0 = Math.max(CORE + t / 2, rMid - (t * theta) / (Math.PI * 2));
        theta += du / r0;
        const r = Math.max(CORE + t / 2, rMid - (t * theta) / (Math.PI * 2));
        const phi = -Math.PI / 2 + theta;
        cx[k] = ccx + r * Math.cos(phi);
        cy[k] = ccy + r * Math.sin(phi);
        tx[k] = -Math.sin(phi);
        ty[k] = Math.cos(phi);
      }
      prevU = Math.max(u, s);
    }

    const p = this.pos.array as Float32Array;
    const n = this.nor.array as Float32Array;
    const hw = this.width / 2;
    const ht = t * 0.495;
    for (let k = 0; k <= N; k++) {
      const nx = -ty[k];
      const ny = tx[k];
      const topX = cx[k] + nx * ht;
      const topY = cy[k] + ny * ht;
      const botX = cx[k] - nx * ht;
      const botY = cy[k] - ny * ht;
      const i = k * VERTS_PER_RING * 3;
      p.set([topX, topY, -hw, topX, topY, hw, botX, botY, -hw, botX, botY, hw, topX, topY, hw, botX, botY, hw, topX, topY, -hw, botX, botY, -hw], i);
      n.set([nx, ny, 0, nx, ny, 0, -nx, -ny, 0, -nx, -ny, 0, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1], i);
    }
    const e = (N + 1) * VERTS_PER_RING * 3;
    const nx = -ty[0];
    const ny = tx[0];
    const tX = cx[0] + nx * ht;
    const tY = cy[0] + ny * ht;
    const bX = cx[0] - nx * ht;
    const bY = cy[0] - ny * ht;
    p.set([tX, tY, -hw, tX, tY, hw, bX, bY, -hw, bX, bY, hw], e);
    n.set([-tx[0], -ty[0], 0, -tx[0], -ty[0], 0, -tx[0], -ty[0], 0, -tx[0], -ty[0], 0], e);

    this.pos.needsUpdate = true;
    this.nor.needsUpdate = true;
    this.computeBoundingSphere();
    return rOuter;
  }
}

// ---------------------------------------------------------------------------
// Materials

function makeMaterials() {
  const std = (color: string, roughness: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, ...extra });

  // The roll's spiral end: darker at each face of the sheet so the wraps read.
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 32;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 32);
  g.addColorStop(0, "#7F9381");
  g.addColorStop(0.16, "#A6B9A7");
  g.addColorStop(0.84, "#A6B9A7");
  g.addColorStop(1, "#7F9381");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 32);
  const edgeMap = new THREE.CanvasTexture(c);
  edgeMap.colorSpace = THREE.SRGBColorSpace;
  edgeMap.wrapS = THREE.RepeatWrapping;

  const vinyl = () =>
    new THREE.MeshPhysicalMaterial({ color: "#B8CBB9", roughness: 0.46, clearcoat: 0.5, clearcoatRoughness: 0.32, envMapIntensity: 0.8 });

  const m = {
    slab: std("#B3B9B6", 0.93, { envMapIntensity: 0.6 }),
    cut: std("#E4E6E3", 0.95, { envMapIntensity: 0.7 }),
    paint: std("#F7F7F4", 0.9, { envMapIntensity: 0.8 }),
    primer: new THREE.MeshPhysicalMaterial({ color: "#F7F8F5", roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.18 }),
    screed: std("#C9CECB", 0.55),
    wet: std("#C2C8C5", 0.06, { envMapIntensity: 0.9 }),
    adhesive: std("#F4F1E9", 0.7),
    former: std("#E2DED4", 0.8),
    vinylA: vinyl(),
    vinylB: vinyl(),
    vinylCove: vinyl(),
    vinylCut: std("#A6B9A7", 0.6),
    rollEdge: std("#FFFFFF", 0.6, { map: edgeMap }),
    rod: std("#8A9D8C", 0.34),
    cap: std("#E7EAE8", 0.4, { metalness: 0.2 }),
    core: std("#B79A73", 0.85, { side: THREE.DoubleSide }),
    plastic: std("#F2F3F1", 0.45),
    linen: std("#FAFBF9", 0.85),
    blanket: std("#CFDDD3", 0.85),
    fabric: std("#2F4A42", 0.9),
    curtain: std("#4D7868", 0.88, { side: THREE.DoubleSide }),
    metal: std("#B4BBB8", 0.35, { metalness: 0.6 }),
    dark: std("#3B4441", 0.6),
    frame: std("#E6EAE8", 0.5),
    glass: new THREE.MeshPhysicalMaterial({ color: "#E3ECEF", transparent: true, opacity: 0.3, roughness: 0.05, envMapIntensity: 1.2, depthWrite: false }),
    roller: std("#F1F0EA", 1),
    steel: std("#C9CFCD", 0.3, { metalness: 0.85 }),
    handle: std("#23312D", 0.6),
    spikes: std("#4A5350", 0.5),
    welder: std("#4C5753", 0.45),
    glow: new THREE.MeshBasicMaterial({ color: "#FFB36B", transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    halo: new THREE.MeshBasicMaterial({ color: "#E07A1F", transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
  };
  return { ...m, extra: [edgeMap] as THREE.Texture[] };
}

type Mats = ReturnType<typeof makeMaterials>;

/** Load the concrete and vinyl photos and hang them on the materials. */
function usePhotos(m: Mats, aniso: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const made: THREE.Texture[] = [];
    Promise.all([loadImage(concretePhoto), loadImage(floorPhotos["homogeneous-vinyl"]!.src)]).then(([concrete, vinyl]) => {
      if (cancelled) return;
      const tex = (img: HTMLImageElement, rx: number, ry: number) => {
        const t = new THREE.Texture(img);
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
        t.repeat.set(rx, ry);
        t.anisotropy = aniso;
        t.needsUpdate = true;
        made.push(t);
        return t;
      };
      if (concrete) {
        m.slab.map = tex(concrete, 1, 1);
        m.cut.map = m.slab.map;
        m.slab.needsUpdate = m.cut.needsUpdate = true;
      }
      if (vinyl) {
        const tile = floorPhotos["homogeneous-vinyl"]!.metres;
        m.vinylA.map = tex(vinyl, VINYL_LEN / tile, (SEAM_X - JOINT) / tile);
        m.vinylB.map = tex(vinyl, VINYL_LEN / tile, (W - SEAM_X) / tile);
        m.vinylCove.map = tex(vinyl, 1 / tile, 1 / tile);
        for (const v of [m.vinylA, m.vinylB, m.vinylCove]) {
          v.color.set("#FFFFFF");
          v.needsUpdate = true;
        }
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
      made.forEach((t) => t.dispose());
    };
  }, [m, aniso]);
  return ready;
}

// ---------------------------------------------------------------------------
// Static geometry: slab, walls, window, furniture

type Part = { geo: THREE.BufferGeometry; mat: THREE.Material | THREE.Material[]; shadow?: boolean };

function buildRoom(m: Mats): Part[] {
  const parts: Part[] = [];
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], shadow = true) => parts.push({ geo, mat, shadow });

  add(worldUV(box(-WALL_T, W, -SLAB_T, 0, -WALL_T, D), 1.4), m.slab);

  // Face order: +x, -x, +y, -y, +z, -z
  const wall = (b: [number, number, number, number, number, number], cut: number[]) => {
    const mats = [0, 1, 2, 3, 4, 5].map((f) => (cut.includes(f) ? m.cut : m.paint));
    add(worldUV(box(...b), 1.4), mats);
  };
  wall([-WALL_T, W, 0, WALL_H, -WALL_T, 0], [0, 2]); // back
  wall([-WALL_T, 0, 0, WALL_H, -WALL_T, WIN_Z0], [2]); // left, behind the window
  wall([-WALL_T, 0, 0, WALL_H, WIN_Z1, D], [2, 4]); // left, in front of the window (cut at the front)
  wall([-WALL_T, 0, 0, WIN_Y0, WIN_Z0, WIN_Z1], []); // under the sill
  wall([-WALL_T, 0, WIN_Y1, WALL_H, WIN_Z0, WIN_Z1], [2]); // over the head

  // Window: frame, mullion, glass
  const fx0 = -0.075;
  const fx1 = -0.035;
  const fw = 0.05;
  add(box(fx0, fx1, WIN_Y0, WIN_Y0 + fw, WIN_Z0, WIN_Z1), m.frame);
  add(box(fx0, fx1, WIN_Y1 - fw, WIN_Y1, WIN_Z0, WIN_Z1), m.frame);
  add(box(fx0, fx1, WIN_Y0, WIN_Y1, WIN_Z0, WIN_Z0 + fw), m.frame);
  add(box(fx0, fx1, WIN_Y0, WIN_Y1, WIN_Z1 - fw, WIN_Z1), m.frame);
  add(box(fx0, fx1, WIN_Y0, WIN_Y1, (WIN_Z0 + WIN_Z1) / 2 - 0.02, (WIN_Z0 + WIN_Z1) / 2 + 0.02), m.frame);
  add(box(-0.057, -0.053, WIN_Y0 + fw, WIN_Y1 - fw, WIN_Z0 + fw, WIN_Z1 - fw), m.glass, false);
  add(box(0, 0.05, WIN_Y0 - 0.02, WIN_Y0, WIN_Z0 - 0.04, WIN_Z1 + 0.04), m.plastic); // sill

  // Bedhead services panel on the back wall
  add(box(1.65, 3.45, 1.22, 1.44, 0, 0.06), m.plastic);
  for (let i = 0; i < 5; i++) add(box(2.15 + i * 0.13, 2.23 + i * 0.13, 1.29, 1.37, 0.06, 0.07), i % 2 ? m.metal : m.blanket, false);
  add(box(1.4, 1.46, 0.6, 2.2, 0, 0.03), m.frame, false); // light switch strip
  // Hand rub and bin
  add(box(3.95, 4.1, 1.18, 1.38, 0, 0.09), m.plastic);
  return parts;
}

function buildFurniture(m: Mats): Part[] {
  const parts: Part[] = [];
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, shadow = true) => parts.push({ geo, mat, shadow });
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  // Bed: head to the back wall
  const bx = 2.55;
  add(box(bx - 0.48, bx + 0.48, 0.24, 0.34, 0.14, 2.16), m.plastic);
  for (const [x, z] of [[bx - 0.4, 0.24], [bx + 0.4, 0.24], [bx - 0.4, 2.06], [bx + 0.4, 2.06]] as const) {
    add(rodGeometry(v(x, Y_TOP + 0.05, z), v(x, 0.25, z), 0.018), m.metal);
    add(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16).rotateZ(Math.PI / 2).translate(x, Y_TOP + 0.04, z), m.dark);
  }
  parts.push({ geo: roundedBox(0.92, 0.16, 1.95, 0.05).translate(bx, 0.42, 1.16), mat: m.linen, shadow: true });
  parts.push({ geo: roundedBox(0.97, 0.06, 1.2, 0.03).translate(bx, 0.5, 1.5), mat: m.blanket, shadow: true });
  parts.push({ geo: roundedBox(0.6, 0.1, 0.34, 0.05).translate(bx, 0.54, 0.42), mat: m.linen, shadow: true });
  parts.push({ geo: roundedBox(1.02, 0.52, 0.05, 0.02).translate(bx, 0.6, 0.12), mat: m.plastic, shadow: true });
  parts.push({ geo: roundedBox(1.02, 0.4, 0.05, 0.02).translate(bx, 0.55, 2.18), mat: m.plastic, shadow: true });
  for (const x of [bx - 0.5, bx + 0.5]) parts.push({ geo: roundedBox(0.03, 0.13, 0.85, 0.012).translate(x, 0.6, 0.85), mat: m.frame, shadow: true });

  // Bedside cabinet
  parts.push({ geo: roundedBox(0.48, 0.76, 0.44, 0.03).translate(1.55, Y_TOP + 0.38, 0.3), mat: m.plastic, shadow: true });
  add(box(1.33, 1.77, 0.57, 0.58, 0.52, 0.525), m.metal, false);
  add(box(1.5, 1.6, 0.66, 0.68, 0.52, 0.535), m.dark, false);

  // Over-bed table on the near side
  parts.push({ geo: roundedBox(0.78, 0.03, 0.38, 0.012).translate(2.28, 0.86, 1.62), mat: m.plastic, shadow: true });
  add(box(1.86, 1.91, Y_TOP, 0.85, 1.6, 1.65), m.metal);
  add(box(1.83, 1.94, Y_TOP, Y_TOP + 0.03, 1.32, 1.92), m.metal);

  // Visitor chair, turned towards the bed
  const cg: Part[] = [];
  cg.push({ geo: roundedBox(0.56, 0.11, 0.52, 0.04).translate(0, 0.46, 0), mat: m.fabric });
  cg.push({ geo: roundedBox(0.56, 0.62, 0.1, 0.04).rotateX(-0.12).translate(0, 0.82, -0.25), mat: m.fabric });
  for (const x of [-0.31, 0.31]) {
    cg.push({ geo: roundedBox(0.06, 0.05, 0.5, 0.02).translate(x, 0.66, 0.02), mat: m.frame });
    cg.push({ geo: box(x - 0.015, x + 0.015, 0.4, 0.66, 0.2, 0.23), mat: m.metal });
    cg.push({ geo: box(x - 0.015, x + 0.015, Y_TOP, 0.42, -0.22, -0.19), mat: m.metal });
    cg.push({ geo: box(x - 0.015, x + 0.015, Y_TOP, 0.42, 0.19, 0.22), mat: m.metal });
  }
  const cm = new THREE.Matrix4().makeRotationY(-1.95).setPosition(3.7, 0, 1.4);
  for (const c of cg) {
    c.geo.applyMatrix4(cm);
    parts.push({ ...c, shadow: true });
  }

  // Bin
  add(new THREE.CylinderGeometry(0.15, 0.13, 0.42, 24).translate(4.1, Y_TOP + 0.21, 0.32), m.plastic);
  return parts;
}

/** drei's RoundedBox as plain geometry, so it can be merged into the parts list. */
function roundedBox(w: number, h: number, d: number, r: number) {
  // A box with its edges rounded by subdividing and pushing vertices out
  // from an inner box; cheap and close enough for furniture.
  const seg = 4;
  const g = new THREE.BoxGeometry(w, h, d, seg, seg, seg);
  const pos = g.attributes.position;
  const inner = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r);
  const p = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    c.set(THREE.MathUtils.clamp(p.x, -inner.x, inner.x), THREE.MathUtils.clamp(p.y, -inner.y, inner.y), THREE.MathUtils.clamp(p.z, -inner.z, inner.z));
    const dvec = p.sub(c);
    if (dvec.lengthSq() > 0) dvec.setLength(r);
    pos.setXYZ(i, c.x + dvec.x, c.y + dvec.y, c.z + dvec.z);
  }
  g.computeVertexNormals();
  return g;
}

// ---------------------------------------------------------------------------
// The world

function World({ progress, frame, pointer, quality, onStage, onReady }: Omit<SceneProps, "active" | "onDecline">) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const size = useThree((s) => s.size);
  const high = quality === "high";
  const shadowSize = high ? 2048 : 1024;

  const m = useMemo(makeMaterials, []);
  const photosReady = usePhotos(m, Math.min(8, gl.capabilities.getMaxAnisotropy()));
  const room = useMemo(() => buildRoom(m), [m]);
  const furniture = useMemo(() => buildFurniture(m), [m]);

  const geo = useMemo(() => {
    const unitZ = (y0: number, y1: number) => box(0, W, y0, y1, 0, 1);
    const coveSh = coveShape();
    const formerSh = formerShape();
    const coveLeft = new THREE.ExtrudeGeometry(coveSh, { depth: edgeZ(4), bevelEnabled: false, curveSegments: 14 });
    const coveBack = new THREE.ExtrudeGeometry(coveSh, { depth: W, bevelEnabled: false, curveSegments: 14 });
    const formerLeft = new THREE.ExtrudeGeometry(formerSh, { depth: edgeZ(4), bevelEnabled: false, curveSegments: 10 });
    const formerBack = new THREE.ExtrudeGeometry(formerSh, { depth: W, bevelEnabled: false, curveSegments: 10 });
    const adhesive = new THREE.ExtrudeGeometry(adhesiveShape(high ? 0.024 : 0.03), { depth: 1, bevelEnabled: false });

    const rodZ = new THREE.CylinderGeometry(0.0065, 0.0065, 1, 10).rotateX(Math.PI / 2).translate(0, 0, -0.5);
    const rodX = new THREE.CylinderGeometry(0.0065, 0.0065, 1, 10).rotateZ(Math.PI / 2).translate(0.5, 0, 0);

    // Tools. Each is built around its contact point at the origin.
    const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    const rollerR = 0.032;
    const roller = {
      sleeve: new THREE.CylinderGeometry(rollerR, rollerR, 0.2, 24).rotateZ(Math.PI / 2),
      frame: mergeAll([
        rodGeometry(v(0.1, 0, 0), v(0.125, 0, 0), 0.004),
        rodGeometry(v(0.125, 0, 0), v(0.13, 0.1, -0.08), 0.004),
        rodGeometry(v(0.13, 0.1, -0.08), v(0.02, 0.3, -0.28), 0.004),
      ]),
      pole: rodGeometry(v(0.02, 0.3, -0.28), v(-0.5, 1.5, -1.4), 0.012),
      r: rollerR,
    };
    const spikeR = 0.026;
    const spiked = {
      drum: new THREE.CylinderGeometry(spikeR, spikeR, 0.24, 20).rotateZ(Math.PI / 2),
      spike: new THREE.ConeGeometry(0.0035, 0.024, 6).translate(0, spikeR + 0.012, 0),
      frame: mergeAll([
        rodGeometry(v(-0.13, 0, 0), v(0.13, 0, 0), 0.004),
        rodGeometry(v(0.13, 0, 0), v(0.14, 0.12, -0.1), 0.004),
        rodGeometry(v(-0.13, 0, 0), v(-0.14, 0.12, -0.1), 0.004),
        rodGeometry(v(-0.14, 0.12, -0.1), v(0.14, 0.12, -0.1), 0.004),
      ]),
      pole: rodGeometry(v(0, 0.12, -0.1), v(0.3, 1.5, -1.4), 0.012),
      r: spikeR + 0.024,
    };
    // Notched trowel: steel blade with square notches, the same pitch as the ridges.
    const blade = new THREE.Shape();
    const bw = 0.28;
    const pitch = high ? 0.024 : 0.03;
    blade.moveTo(-bw / 2, 0.12);
    blade.lineTo(-bw / 2, 0);
    for (let x = -bw / 2; x < bw / 2 - pitch / 2; x += pitch) {
      blade.lineTo(x + pitch * 0.3, 0);
      blade.lineTo(x + pitch * 0.3, 0.008);
      blade.lineTo(x + pitch * 0.66, 0.008);
      blade.lineTo(x + pitch * 0.66, 0);
    }
    blade.lineTo(bw / 2, 0);
    blade.lineTo(bw / 2, 0.12);
    blade.closePath();
    const trowel = {
      blade: new THREE.ExtrudeGeometry(blade, { depth: 0.0018, bevelEnabled: false }),
      handle: mergeAll([
        rodGeometry(v(-0.06, 0.12, 0), v(-0.06, 0.16, 0.02), 0.006),
        rodGeometry(v(0.06, 0.12, 0), v(0.06, 0.16, 0.02), 0.006),
        roundedBox(0.16, 0.03, 0.035, 0.012).translate(0, 0.17, 0.025),
      ]),
    };
    // Hot-air welder: nozzle at the origin, body up and to the right.
    const wd = v(0.55, 0.72, 0.42).normalize();
    const at = (d: number) => wd.clone().multiplyScalar(d);
    const welder = {
      nozzle: mergeAll([rodGeometry(v(0, 0.004, 0), at(0.1), 0.006, 12), rodGeometry(at(0.1), at(0.13), 0.012, 12)]),
      body: rodGeometry(at(0.13), at(0.42), 0.028, 20),
      grip: rodGeometry(at(0.24), at(0.36), 0.031, 20),
      cable: rodGeometry(at(0.42), at(1.4), 0.006, 8),
    };
    // Self-levelling pumped through a hose: nozzle, then a glossy stream that widens as it lands.
    const stream = new THREE.CylinderGeometry(0.006, 0.01, 0.26, 14).translate(0, 0.13, 0);
    const hose = mergeAll([
      rodGeometry(v(0, 0.26, 0), v(0, 0.33, 0), 0.014, 16),
      rodGeometry(v(0, 0.33, 0), v(0.03, 0.42, -0.06), 0.019, 16),
      rodGeometry(v(0.03, 0.42, -0.06), v(0.35, 1.3, -1.1), 0.019, 12),
    ]);
    const splash = new THREE.SphereGeometry(0.06, 20, 10).scale(1, 0.18, 1);
    const lip = new THREE.CylinderGeometry(SCREED / 2, SCREED / 2, W, 12).rotateZ(Math.PI / 2).translate(W / 2, 0, 0);
    const tip = new THREE.SphereGeometry(0.008, 12, 8);
    const halo = new THREE.SphereGeometry(0.03, 16, 10);

    return {
      primer: unitZ(0, PRIMER),
      screed: unitZ(Y_SCREED, Y_ADH),
      adhesive,
      coveLeft,
      coveBack,
      formerLeft,
      formerBack,
      capLeft: box(0, 0.016, COVE_H - 0.004, COVE_H + 0.006, 0, edgeZ(4)),
      capBack: box(0, W, COVE_H - 0.004, COVE_H + 0.006, 0, 0.016),
      rodZ,
      rodX,
      roller,
      spiked,
      trowel,
      welder,
      stream,
      hose,
      splash,
      lip,
      tip,
      halo,
    };
  }, [high]);

  const segs = high ? 520 : 260;
  const sheets = useMemo(
    () => ({ a: new RollSheet(segs, VINYL_LEN, SEAM_X - JOINT), b: new RollSheet(segs, VINYL_LEN, W - SEAM_X) }),
    [segs],
  );
  const coreGeo = useMemo(() => new THREE.CylinderGeometry(CORE - 0.004, CORE - 0.004, 1, 28, 1, true).rotateX(Math.PI / 2), []);

  useEffect(
    () => () => {
      for (const p of [...room, ...furniture]) p.geo.dispose();
      const all: unknown[] = Object.values(geo).flatMap((g) => (g instanceof THREE.BufferGeometry ? [g] : Object.values(g)));
      all.forEach((g) => g instanceof THREE.BufferGeometry && g.dispose());
    },
    [room, furniture, geo],
  );
  useEffect(() => () => [sheets.a, sheets.b, coreGeo].forEach((g) => g.dispose()), [sheets, coreGeo]);
  useEffect(
    () => () => {
      Object.values(m).forEach((x) => (Array.isArray(x) ? x.forEach((t) => t.dispose()) : (x as THREE.Material).dispose()));
    },
    [m],
  );

  const spikeCount = high ? 14 * 9 : 10 * 7;
  const spikesRef = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const mesh = spikesRef.current;
    if (!mesh) return;
    const around = high ? 14 : 10;
    const along = spikeCount / around;
    const mtx = new THREE.Matrix4();
    let i = 0;
    for (let a = 0; a < along; a++) {
      for (let r = 0; r < around; r++) {
        const x = -0.11 + (0.22 * a) / (along - 1);
        mtx.makeRotationX((r / around) * Math.PI * 2 + (a % 2) * 0.2).setPosition(x, 0, 0);
        mesh.setMatrixAt(i++, mtx);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [high, spikeCount]);

  // Refs for everything that moves
  const r = {
    furniture: useRef<THREE.Group>(null),
    primer: useRef<THREE.Mesh>(null),
    screed: useRef<THREE.Mesh>(null),
    lip: useRef<THREE.Mesh>(null),
    adhesive: useRef<THREE.Mesh>(null),
    roller: useRef<THREE.Group>(null),
    sleeve: useRef<THREE.Mesh>(null),
    pour: useRef<THREE.Group>(null),
    spiked: useRef<THREE.Group>(null),
    drum: useRef<THREE.Group>(null),
    trowel: useRef<THREE.Group>(null),
    rollA: useRef<THREE.Group>(null),
    rollB: useRef<THREE.Group>(null),
    coreA: useRef<THREE.Mesh>(null),
    coreB: useRef<THREE.Mesh>(null),
    cove: useRef<THREE.Group>(null),
    formers: useRef<THREE.Group>(null),
    rodL: useRef<THREE.Mesh>(null),
    rodS: useRef<THREE.Mesh>(null),
    rodB: useRef<THREE.Mesh>(null),
    tips: useRef<THREE.Group>(null),
    welder: useRef<THREE.Group>(null),
    key: useRef<THREE.DirectionalLight>(null),
  };

  const st = useRef({ mx: 0, my: 0, stage: -2, ready: false });
  const tmp = useMemo(
    () => ({
      target: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      sph: new THREE.Spherical(),
      roomT: new THREE.Vector3(W * 0.5, 0.72, D * 0.5),
      roomD: new THREE.Vector3(1.0, 0.92, 1.2).normalize(),
      closeT: new THREE.Vector3(),
      closeD: new THREE.Vector3(),
      a: new THREE.Vector3(),
      yAxis: new THREE.Vector3(0, 1, 0),
    }),
    [],
  );

  useFrame((_, dt) => {
    const s = st.current;
    const p = progress.current;
    s.mx = THREE.MathUtils.damp(s.mx, pointer.current.x, 4, dt);
    s.my = THREE.MathUtils.damp(s.my, pointer.current.y, 4, dt);
    const t = timeline(p);

    // --- Furniture out and back in
    if (r.furniture.current) {
      r.furniture.current.position.y = easeIn(t.lift) * 3.2;
      r.furniture.current.visible = t.lift < 0.99;
    }

    // --- Primer: rolled on from the back wall towards the cut edge
    const primerF = easeOut(lin(0, 0.85, t.primer));
    const primerZ = primerF * edgeZ(1);
    setZ(r.primer.current, primerZ);
    m.primer.roughness = THREE.MathUtils.lerp(0.08, 0.32, smooth(0.85, 1, t.primer));
    if (r.roller.current) {
      const on = t.tools && t.primer > 0 && t.primer < 1;
      r.roller.current.visible = on;
      const liftOff = smooth(0.85, 1, t.primer);
      r.roller.current.position.set(0.3, PRIMER + geo.roller.r + liftOff * 0.35, primerZ - 0.035 - liftOff * 0.1);
      if (r.sleeve.current) r.sleeve.current.rotation.x = primerZ / geo.roller.r;
    }

    // --- Self-levelling: poured from a hose at the moving front, then spiked
    const flow = easeOut(lin(0, 0.7, t.screed));
    const screedZ = flow * edgeZ(2);
    setZ(r.screed.current, screedZ);
    m.screed.roughness = THREE.MathUtils.lerp(0.1, 0.55, smooth(0.75, 1, t.screed));
    if (r.lip.current) {
      const l = 1 - smooth(0.75, 1, flow);
      r.lip.current.visible = screedZ > 0.01 && l > 0.01;
      r.lip.current.position.set(0, Y_SCREED + (SCREED / 2) * l, screedZ);
      r.lip.current.scale.set(1, l, l);
    }
    if (r.pour.current) {
      const pouring = t.tools && t.screed > 0 && t.screed < 0.72;
      r.pour.current.visible = pouring;
      const thin = 1 - smooth(0.6, 0.72, t.screed);
      r.pour.current.position.set(0.42, Y_ADH - 0.002, Math.max(0.1, screedZ - 0.09));
      const stream = r.pour.current.children[0];
      stream.scale.set(thin, 1, thin);
    }
    if (r.spiked.current) {
      const a = lin(0.55, 0.93, t.screed);
      const on = t.tools && a > 0 && t.screed < 1;
      r.spiked.current.visible = on;
      const z = THREE.MathUtils.lerp(edgeZ(2) - 1.1, edgeZ(2) - 0.08, easeOut(a));
      const liftOff = smooth(0.93, 1, t.screed);
      r.spiked.current.position.set(0.44, Y_ADH + geo.spiked.r + liftOff * 0.35, z - liftOff * 0.1);
      if (r.drum.current) r.drum.current.rotation.x = z / geo.spiked.r;
    }

    // --- Adhesive: combed on with a notched trowel
    const adhF = easeOut(lin(0, 0.85, t.adhesive));
    const adhZ = adhF * edgeZ(3);
    setZ(r.adhesive.current, adhZ);
    if (r.trowel.current) {
      const on = t.tools && t.adhesive > 0 && t.adhesive < 1;
      r.trowel.current.visible = on;
      const liftOff = smooth(0.85, 1, t.adhesive);
      r.trowel.current.position.set(0.34, Y_ADH + liftOff * 0.3, adhZ + 0.004);
      r.trowel.current.rotation.set(-0.95 + liftOff * 0.4, 0.05, 0);
    }

    // --- Vinyl: two rolls laid from the cut edge back to the far wall
    const settle = smooth(0.92, 1, Math.min(t.vinylA, t.vinylB));
    const drop = easeIn(t.drop);
    const rolls: [THREE.Group | null, THREE.Mesh | null, RollSheet, number][] = [
      [r.rollA.current, r.coreA.current, sheets.a, t.vinylA],
      [r.rollB.current, r.coreB.current, sheets.b, t.vinylB],
    ];
    for (const [group, core, sheet, f] of rolls) {
      if (!group) continue;
      const sLaid = easeInOut(f) * VINYL_LEN;
      const rOuter = sheet.update(sLaid, settle);
      group.visible = t.drop < 0.999;
      group.position.y = Y_VINYL + drop * 0.6;
      if (core) {
        core.visible = sLaid < VINYL_LEN - 0.01;
        core.position.set(sLaid, rOuter, 0);
        core.rotation.z = -sLaid / CORE;
      }
    }

    // --- Coved skirting drops in, then the joints are welded
    if (r.cove.current) {
      r.cove.current.visible = t.cove > 0;
      r.cove.current.position.y = (1 - easeOut(t.cove)) * 0.35;
    }
    if (r.formers.current) r.formers.current.visible = t.drop < 0.999 || t.vinylA > 0;
    const w = easeIn(t.weld);
    const welding = t.tools && t.weld > 0 && t.weld < 1;
    const zL = edgeZ(4) - w * VINYL_LEN;
    setRod(r.rodL.current, w * VINYL_LEN, "z");
    setRod(r.rodS.current, w * VINYL_LEN, "z");
    setRod(r.rodB.current, w * (W - JOINT), "x");
    if (r.tips.current) {
      r.tips.current.visible = welding;
      const [a, b, c] = r.tips.current.children;
      a.position.set(JOINT, Y_TOP + 0.002, zL);
      b.position.set(SEAM_X, Y_TOP + 0.002, zL);
      c.position.set(JOINT + w * (W - JOINT), Y_TOP + 0.002, JOINT);
      const flicker = 0.85 + Math.sin(performance.now() * 0.03) * 0.15;
      m.halo.opacity = 0.5 * flicker;
    }
    if (r.welder.current) {
      r.welder.current.visible = welding;
      r.welder.current.position.set(JOINT, Y_TOP + 0.004, zL);
    }

    // --- Caption stage
    const stage = stageAt(p);
    if (stage !== s.stage) {
      s.stage = stage;
      onStage?.(stage);
    }

    // --- Camera. While the canvas is clipped to the column, zoom and shift
    // the projection so the column shows the framing it would have as its own
    // canvas; both relax to a plain full-screen camera as it grows.
    const fr = frame.current;
    const g = clamp01(fr.grow);
    const Wpx = Math.max(1, size.width);
    const Hpx = Math.max(1, size.height);
    const fw = fr.w > 0 ? fr.w : Wpx;
    const fh = fr.h > 0 ? fr.h : Hpx;
    const aspect = THREE.MathUtils.lerp(fw / fh, Wpx / Hpx, g);
    // Full screen: on wide screens the subject moves right of the captions,
    // on tall ones it moves up above them.
    const wideScreen = smooth(1.1, 1.5, aspect) * g;
    const tall = (1 - smooth(0.8, 1.1, aspect)) * g;
    const dx = fr.x + fw / 2 - Wpx / 2;
    const dy = fr.y + fh / 2 - Hpx / 2;
    camera.zoom = THREE.MathUtils.lerp(fh / Hpx, 1, g);
    camera.setViewOffset(Wpx, Hpx, -dx * (1 - g) - Wpx * 0.13 * wideScreen, -dy * (1 - g) + Hpx * 0.1 * tall, Wpx, Hpx);
    camera.updateProjectionMatrix();

    const close = t.dive * (1 - t.back);
    tmp.closeT.set(0.3 + 0.3 * t.wide, 0.02, edgeZ(0) - 0.2 - 0.55 * t.wide);
    tmp.closeD.set(1.0, 0.72, 1.0).normalize().applyAxisAngle(tmp.yAxis, THREE.MathUtils.lerp(0.14, -0.14, t.drift));
    const closeR = 0.36 + 0.3 * t.wide;
    const roomR = 3.15;
    tmp.target.lerpVectors(tmp.roomT, tmp.closeT, close);
    tmp.dir.lerpVectors(tmp.roomD, tmp.closeD, close).normalize();
    const radius = Math.exp(THREE.MathUtils.lerp(Math.log(roomR), Math.log(closeR), close));
    // Fit a sphere of that radius in the narrower field of view.
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const usable = aspect * (1 - 0.26 * wideScreen);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * usable);
    const fitFov = Math.min(vfov * (1 - 0.2 * tall), hfov);
    const dist = radius / Math.sin(fitFov / 2);

    tmp.sph.setFromVector3(tmp.dir);
    tmp.sph.theta += THREE.MathUtils.degToRad(3) * s.mx;
    tmp.sph.phi = THREE.MathUtils.clamp(tmp.sph.phi + THREE.MathUtils.degToRad(2.5) * s.my, 0.35, 1.45);
    tmp.dir.setFromSpherical(tmp.sph);
    camera.position.copy(tmp.target).addScaledVector(tmp.dir, dist);
    camera.near = Math.max(0.01, dist * 0.04);
    camera.far = dist * 6 + 20;
    camera.lookAt(tmp.target);
    camera.updateProjectionMatrix();

    // --- Key light: a big softbox upper left; its shadow camera hugs the view.
    const key = r.key.current;
    if (key) {
      const k = radius / roomR;
      key.position.copy(tmp.target).add(tmp.a.set(3.2 + s.mx, 5.6, 2.6 - s.my).multiplyScalar(Math.max(0.35, k)));
      key.target.position.copy(tmp.target);
      key.target.updateMatrixWorld();
      const sc = key.shadow.camera;
      const half = radius * 1.5;
      if (Math.abs(sc.right - half) > 1e-4) {
        sc.left = -half;
        sc.right = half;
        sc.top = half;
        sc.bottom = -half;
        sc.near = 0.05;
        sc.far = 12 * Math.max(0.35, k) + 4;
        sc.updateProjectionMatrix();
      }
      key.shadow.normalBias = 0.004 + 0.02 * k;
    }

    if (!s.ready && photosReady) {
      s.ready = true;
      requestAnimationFrame(() => onReady?.());
    }
  });

  return (
    <>
      <color attach="background" args={["#EEF0EE"]} />
      <hemisphereLight args={["#F6F8F6", "#C9CEC9", 0.55]} />
      <directionalLight
        ref={r.key}
        intensity={1.75}
        color="#FFF7EC"
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-radius={6}
        shadow-blurSamples={12}
        shadow-bias={-0.0003}
      />

      <Environment resolution={high ? 256 : 64} frames={1}>
        <Lightformer form="rect" intensity={1.5} color="#FFFFFF" position={[-5, 6, 4]} rotation={[-Math.PI / 2.6, -0.5, 0]} scale={[9, 7, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#F3F6F4" position={[0, 7, -4]} rotation-x={Math.PI / 2} scale={[14, 6, 1]} />
        <Lightformer form="rect" intensity={0.55} color="#EEF3F0" position={[2, 2.5, 8]} rotation-y={Math.PI} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#3A423F" position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 5, 1]} />
        <mesh scale={30}>
          <sphereGeometry args={[1, 16, 8]} />
          <meshBasicMaterial color="#AEB3AF" side={THREE.BackSide} />
        </mesh>
      </Environment>

      <ContactShadows position={[W / 2 - WALL_T / 2, -SLAB_T - 0.002, D / 2 - WALL_T / 2]} scale={[W * 1.7, D * 1.7]} far={1.2} blur={2.6} opacity={0.45} resolution={high ? 512 : 256} frames={1} color="#23312D" />

      {room.map((p, i) => (
        <mesh key={i} geometry={p.geo} material={p.mat} castShadow={p.shadow} receiveShadow />
      ))}
      <group ref={r.furniture}>
        {furniture.map((p, i) => (
          <mesh key={i} geometry={p.geo} material={p.mat} castShadow={p.shadow} receiveShadow />
        ))}
        <Curtain material={m.curtain} frame={m.frame} />
      </group>

      {/* Layers */}
      <mesh ref={r.primer} geometry={geo.primer} material={m.primer} receiveShadow castShadow />
      <mesh ref={r.screed} geometry={geo.screed} material={m.screed} receiveShadow castShadow />
      <mesh ref={r.lip} geometry={geo.lip} material={m.screed} receiveShadow />
      <mesh ref={r.adhesive} geometry={geo.adhesive} material={m.adhesive} receiveShadow castShadow />

      <group ref={r.formers}>
        <mesh geometry={geo.formerLeft} material={m.former} receiveShadow />
        <mesh geometry={geo.formerBack} material={m.former} rotation-y={-Math.PI / 2} position-x={W} receiveShadow />
      </group>

      {/* Sheet A runs from the cove joint to the seam, sheet B from the seam to the open side. */}
      <group ref={r.rollA} position={[(JOINT + SEAM_X) / 2, Y_VINYL, edgeZ(4)]} rotation-y={Math.PI / 2}>
        <mesh geometry={sheets.a} material={[m.vinylA, m.rollEdge]} castShadow receiveShadow frustumCulled={false} />
        <mesh ref={r.coreA} geometry={coreGeo} material={m.core} scale={[1, 1, SEAM_X - JOINT + 0.03]} castShadow />
      </group>
      <group ref={r.rollB} position={[(SEAM_X + W) / 2, Y_VINYL, edgeZ(4)]} rotation-y={Math.PI / 2}>
        <mesh geometry={sheets.b} material={[m.vinylB, m.rollEdge]} castShadow receiveShadow frustumCulled={false} />
        <mesh ref={r.coreB} geometry={coreGeo} material={m.core} scale={[1, 1, W - SEAM_X + 0.03]} castShadow />
      </group>

      <group ref={r.cove}>
        <mesh geometry={geo.coveLeft} material={[m.vinylCut, m.vinylCove]} castShadow receiveShadow />
        <mesh geometry={geo.coveBack} material={[m.vinylCut, m.vinylCove]} rotation-y={-Math.PI / 2} position-x={W} castShadow receiveShadow />
        <mesh geometry={geo.capLeft} material={m.cap} castShadow />
        <mesh geometry={geo.capBack} material={m.cap} castShadow />
      </group>

      <mesh ref={r.rodL} geometry={geo.rodZ} material={m.rod} position={[JOINT, Y_TOP - 0.002, edgeZ(4)]} castShadow />
      <mesh ref={r.rodS} geometry={geo.rodZ} material={m.rod} position={[SEAM_X, Y_TOP - 0.002, edgeZ(4)]} castShadow />
      <mesh ref={r.rodB} geometry={geo.rodX} material={m.rod} position={[JOINT, Y_TOP - 0.002, JOINT]} castShadow />
      <group ref={r.tips} visible={false}>
        {[0, 1, 2].map((i) => (
          <group key={i}>
            <mesh geometry={geo.tip} material={m.glow} />
            <mesh geometry={geo.halo} material={m.halo} scale={[1, 0.35, 1]} />
          </group>
        ))}
      </group>

      {/* Tools */}
      <group ref={r.roller} visible={false}>
        <mesh ref={r.sleeve} geometry={geo.roller.sleeve} material={m.roller} castShadow />
        <mesh geometry={geo.roller.frame} material={m.metal} castShadow />
        <mesh geometry={geo.roller.pole} material={m.handle} castShadow />
      </group>
      <group ref={r.pour} visible={false}>
        <mesh geometry={geo.stream} material={m.wet} castShadow />
        <mesh geometry={geo.splash} material={m.wet} />
        <mesh geometry={geo.hose} material={m.dark} castShadow />
      </group>
      <group ref={r.spiked} visible={false}>
        <group ref={r.drum}>
          <mesh geometry={geo.spiked.drum} material={m.spikes} castShadow />
          <instancedMesh ref={spikesRef} args={[geo.spiked.spike, m.spikes, spikeCount]} castShadow />
        </group>
        <mesh geometry={geo.spiked.frame} material={m.metal} castShadow />
        <mesh geometry={geo.spiked.pole} material={m.handle} castShadow />
      </group>
      <group ref={r.trowel} visible={false}>
        <mesh geometry={geo.trowel.blade} material={m.steel} castShadow />
        <mesh geometry={geo.trowel.handle} material={m.handle} castShadow />
      </group>
      <group ref={r.welder} visible={false}>
        <mesh geometry={geo.welder.nozzle} material={m.steel} castShadow />
        <mesh geometry={geo.welder.body} material={m.welder} castShadow />
        <mesh geometry={geo.welder.grip} material={m.handle} castShadow />
        <mesh geometry={geo.welder.cable} material={m.dark} castShadow />
      </group>
    </>
  );
}

/** The cubicle curtain, bunched against the back wall, and its ceiling track. */
function Curtain({ material, frame }: { material: THREE.Material; frame: THREE.Material }) {
  const geo = useMemo(() => {
    const curtain = new THREE.PlaneGeometry(0.7, 2.05, 48, 1);
    const pos = curtain.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setXYZ(i, Math.sin(x * 70) * 0.035, pos.getY(i), x);
    }
    curtain.computeVertexNormals();
    curtain.translate(1.82, 0.28 + 2.05 / 2, 0.42);
    const track = mergeAll([box(1.8, 1.84, 2.36, 2.39, 0, 2.5), box(1.8, 3.6, 2.36, 2.39, 2.46, 2.5)]);
    return { curtain, track };
  }, []);
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  return (
    <>
      <mesh geometry={geo.curtain} material={material} castShadow receiveShadow />
      <mesh geometry={geo.track} material={frame} castShadow />
    </>
  );
}

function setZ(mesh: THREE.Mesh | null, z: number) {
  if (!mesh) return;
  mesh.visible = z > 0.002;
  mesh.scale.z = Math.max(0.0001, z);
}

function setRod(mesh: THREE.Mesh | null, len: number, axis: "x" | "z") {
  if (!mesh) return;
  mesh.visible = len > 0.002;
  mesh.scale[axis] = Math.max(0.0001, len);
}

/** Merge geometries that share a material (positions, normals and UVs only). */
function mergeAll(list: THREE.BufferGeometry[]) {
  const parts = list.map((g) => (g.index ? g.toNonIndexed() : g));
  let count = 0;
  for (const g of parts) count += g.attributes.position.count;
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  let o = 0;
  for (const g of parts) {
    if (!g.attributes.normal) g.computeVertexNormals();
    pos.set(g.attributes.position.array as Float32Array, o * 3);
    nor.set(g.attributes.normal.array as Float32Array, o * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array as Float32Array, o * 2);
    o += g.attributes.position.count;
  }
  list.forEach((g) => g.dispose());
  parts.forEach((g) => g.dispose());
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  out.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return out;
}

export default function FloorBuildScene(props: SceneProps) {
  const { active, onDecline, ...rest } = props;
  const dprRef = useRef<[number, number]>([1, 1.25]);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dprRef.current}
      shadows={{ type: THREE.VSMShadowMap }}
      camera={{ fov: 26, near: 0.05, far: 80, position: [8, 7, 9] }}
      gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.06;
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor flipflops={2} onDecline={() => onDecline?.()} />
      <World {...rest} />
    </Canvas>
  );
}
