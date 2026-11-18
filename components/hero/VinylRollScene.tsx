"use client";

/**
 * The hero: a vinyl roll that unrolls across a concrete slab as you scroll.
 *
 * The sheet is one strip of material with real thickness. Laid material lies
 * flat behind the roll; the rest is wound on an Archimedean spiral whose
 * radius shrinks as the roll gets lighter. Six floors are painted end to end
 * along the strip (see textures.ts), and an amber hot-weld runs across each
 * seam just after the roll passes it.
 */
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { buildFloorAtlasAsync, concretePhoto, loadImage, paintConcrete, type FloorAtlas } from "./textures";

// World units are roughly metres, with the thickness exaggerated so you can see it.
const SHEET_LENGTH = 6;
const SHEET_WIDTH = 3;
const THICKNESS = 0.02;
const CORE_RADIUS = 0.085;
const X0 = -SHEET_LENGTH / 2;
const ZONES = 6;
const SLAB_SIZE = 60;

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
  onZone?: (zone: number) => void;
  onReady?: () => void;
  /** Called when the frame rate drops, so the parent can lower quality. */
  onDecline?: () => void;
}

// ---------------------------------------------------------------------------
// Geometry

const VERTS_PER_RING = 8;

class SheetGeometry extends THREE.BufferGeometry {
  readonly segments: number;
  private pos: THREE.BufferAttribute;
  private nor: THREE.BufferAttribute;
  private cx = new Float32Array(0);
  private cy = new Float32Array(0);
  private tx = new Float32Array(0);
  private ty = new Float32Array(0);

  constructor(segments: number) {
    super();
    this.segments = segments;
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
      // top -W/2, top +W/2, bottom -W/2, bottom +W/2
      uv.set([u, 0, u, 1, u, 0, u, 1], b);
      // sides: v runs across the thickness (wear layer at 0, backing at 1)
      const su = u * SHEET_LENGTH * 3;
      uv.set([su, 0, su, 1, su, 0, su, 1], b + 8);
    }
    const e = rings * VERTS_PER_RING * 2;
    uv.set([0, 0, 1, 0, 0, 1, 1, 1], e);

    const faces: number[] = [];
    const edges: number[] = [];
    for (let k = 0; k < segments; k++) {
      const a = k * VERTS_PER_RING;
      const c = (k + 1) * VERTS_PER_RING;
      faces.push(a, a + 1, c, a + 1, c + 1, c); // top
      faces.push(a + 2, c + 2, a + 3, a + 3, c + 2, c + 3); // bottom
      edges.push(a + 5, c + 5, a + 4, c + 5, c + 4, a + 4); // side +z
      edges.push(a + 7, a + 6, c + 7, c + 7, a + 6, c + 6); // side -z
    }
    const ec = rings * VERTS_PER_RING;
    edges.push(ec, ec + 2, ec + 1, ec + 1, ec + 2, ec + 3); // cut edge

    this.setIndex([...faces, ...edges]);
    this.addGroup(0, faces.length, 0);
    this.addGroup(faces.length, edges.length, 1);
    this.setAttribute("position", this.pos);
    this.setAttribute("normal", this.nor);
    this.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    this.update(0);
  }

  /** Lay out the sheet with `s` units already unrolled. Returns the roll's outer radius. */
  update(s: number, settle = 0) {
    const N = this.segments;
    const L = SHEET_LENGTH;
    const t = THICKNESS;
    const rOuter = Math.sqrt(CORE_RADIUS * CORE_RADIUS + ((L - s) * t) / Math.PI);
    const rMid = rOuter - t / 2;
    const ccx = X0 + s;
    const ccy = rOuter;
    const { cx, cy, tx, ty } = this;

    let theta = 0;
    let prevU = s;
    for (let k = 0; k <= N; k++) {
      const u = (k / N) * L;
      if (u <= s) {
        // Laid flat. A low hump just behind the roll relaxes into the floor,
        // and the free cut edge curls up slightly until the sheet settles.
        const d = s - u;
        const w = 0.22;
        const hump = 0.016 * (d / w) * Math.exp(1 - d / w) * (1 - settle);
        const dh = 0.016 * (1 - settle) * Math.exp(1 - d / w) * (1 / w) * (d / w - 1); // d/du of hump
        const curl = 0.05 * Math.exp(-u / 0.12) * (1 - Math.min(1, s / 1.2)) * (1 - settle);
        const dc = (-curl / 0.12);
        cx[k] = X0 + u;
        cy[k] = t / 2 + hump + curl;
        const dy = dh + dc;
        const len = Math.hypot(1, dy);
        tx[k] = 1 / len;
        ty[k] = dy / len;
      } else {
        const du = u - prevU;
        const r0 = Math.max(CORE_RADIUS + t / 2, rMid - (t * theta) / (Math.PI * 2));
        theta += du / r0;
        const r = Math.max(CORE_RADIUS + t / 2, rMid - (t * theta) / (Math.PI * 2));
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
    const hw = SHEET_WIDTH / 2;
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
    // cut edge at u = 0
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
    return rOuter;
  }
}

// ---------------------------------------------------------------------------
// Textures and materials

function useSheetMaterials(quality: "high" | "low") {
  const gl = useThree((s) => s.gl);
  const [atlas, setAtlas] = useState<FloorAtlas | null>(null);

  // Paint the six floors off the critical path, one at a time.
  useEffect(() => {
    const signal = { cancelled: false };
    const ppu = quality === "high" ? 384 : 170;
    buildFloorAtlasAsync(ppu, SHEET_LENGTH / ZONES, SHEET_WIDTH, signal).then((a) => a && setAtlas(a));
    return () => {
      signal.cancelled = true;
    };
  }, [quality]);

  return useMemo(() => {
    if (!atlas) return null;
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());

    const map = new THREE.CanvasTexture(atlas.color);
    map.colorSpace = THREE.SRGBColorSpace;
    const normalMap = new THREE.CanvasTexture(atlas.normal);
    const surface = new THREE.CanvasTexture(atlas.surface);
    for (const tex of [map, normalMap, surface]) {
      tex.anisotropy = aniso;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
    }

    const face = new THREE.MeshPhysicalMaterial({
      map,
      normalMap,
      normalScale: new THREE.Vector2(0.6, 0.6),
      roughness: 1,
      roughnessMap: surface,
      clearcoat: 1,
      clearcoatMap: surface,
      clearcoatRoughness: 0.32,
      envMapIntensity: 0.7,
      side: THREE.FrontSide,
    });

    // The cut edge: clear wear layer, coloured body, darker backing, so the
    // layers read as a spiral on the end of the roll.
    const edgeCanvas = document.createElement("canvas");
    edgeCanvas.width = 4;
    edgeCanvas.height = 32;
    const ectx = edgeCanvas.getContext("2d")!;
    const g = ectx.createLinearGradient(0, 0, 0, 32);
    g.addColorStop(0, "#F2F4F2");
    g.addColorStop(0.18, "#DCE1DE");
    g.addColorStop(0.2, "#B7C0BC");
    g.addColorStop(0.72, "#A8B1AD");
    g.addColorStop(0.75, "#6F7774");
    g.addColorStop(1, "#59605D");
    ectx.fillStyle = g;
    ectx.fillRect(0, 0, 4, 32);
    const edgeMap = new THREE.CanvasTexture(edgeCanvas);
    edgeMap.colorSpace = THREE.SRGBColorSpace;
    edgeMap.wrapS = THREE.RepeatWrapping;
    const edge = new THREE.MeshStandardMaterial({ map: edgeMap, roughness: 0.75, envMapIntensity: 0.6 });

    return { face, edge, dispose: () => [map, normalMap, surface, edgeMap, face, edge].forEach((d) => d.dispose()) };
  }, [gl, atlas]);
}

function useConcrete(quality: "high" | "low") {
  // Procedural slab first, swapped for the photo texture once it has loaded.
  const fallback = useMemo(() => {
    const size = quality === "high" ? 512 : 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    paintConcrete(c.getContext("2d", { willReadFrequently: true })!, { x: 0, y: 0, w: size, h: size }, size / 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  }, [quality]);
  const [photo, setPhoto] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tex: THREE.Texture | null = null;
    loadImage(concretePhoto).then((img) => {
      if (!img || cancelled) return;
      tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      // Mirrored repeat hides the tile edges without needing a seamless photo.
      tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
      tex.repeat.set(SLAB_SIZE / 2.4, SLAB_SIZE / 2.4);
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      setPhoto(tex);
    });
    return () => {
      cancelled = true;
      tex?.dispose();
    };
  }, []);

  useEffect(() => () => fallback.dispose(), [fallback]);
  return photo ?? fallback;
}

/** Soft dark gradient used as the contact shadow where the roll meets the floor. */
function useContactTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    // Greyscale alpha map: white is full shadow.
    const g = ctx.createLinearGradient(0, 0, 128, 0);
    const stops: [number, number][] = [[0, 0], [0.28, 30], [0.44, 120], [0.5, 215], [0.56, 120], [0.72, 30], [1, 0]];
    for (const [at, v] of stops) g.addColorStop(at, `rgb(${v},${v},${v})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    // Fade to nothing just past each end of the roll.
    const m = ctx.createLinearGradient(0, 0, 0, 128);
    m.addColorStop(0, "rgba(0,0,0,1)");
    m.addColorStop(0.1, "rgba(0,0,0,0)");
    m.addColorStop(0.9, "rgba(0,0,0,0)");
    m.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = m;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);
}

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 4;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 64, 0);
    g.addColorStop(0, "rgba(224,122,31,0)");
    g.addColorStop(0.5, "rgba(255,170,90,1)");
    g.addColorStop(1, "rgba(224,122,31,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 4);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

// ---------------------------------------------------------------------------
// Helpers

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** Unrolled length for a given scroll progress. Finishes at 76%. */
// The first 8% of the scroll grows the frame to full screen; the roll starts as it lands.
export const unrolledAt = (p: number) => SHEET_LENGTH * easeInOut(clamp01((p - 0.06) / 0.72));

// ---------------------------------------------------------------------------
// The world

function World({ progress, frame, pointer, quality, onZone, onReady }: Omit<SceneProps, "active" | "onDecline">) {
  const segments = quality === "high" ? 720 : 380;
  const geometry = useMemo(() => new SheetGeometry(segments), [segments]);
  const mats = useSheetMaterials(quality);
  const concrete = useConcrete(quality);
  const glowTex = useGlowTexture();
  const contactTex = useContactTexture();
  // Phones get a smaller shadow map rather than none, so the 3D scene matches the still it replaces.
  const shadows = true;
  const shadowSize = quality === "high" ? 2048 : 1024;

  // The contact shadow is a soft strip on the slab under the roll, plus a
  // half strip lying on top of the laid sheet behind it (the slab strip is
  // hidden under the sheet there).
  const contactGeo = useMemo(() => {
    const LEN = SHEET_WIDTH + 0.5;
    const front = new THREE.PlaneGeometry(2, LEN).rotateX(-Math.PI / 2);
    const behind = new THREE.PlaneGeometry(1, SHEET_WIDTH).rotateX(-Math.PI / 2).translate(-0.5, 0, 0);
    const uv = behind.attributes.uv as THREE.BufferAttribute;
    const pad = 0.25 / LEN;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.5, pad + uv.getY(i) * (1 - pad * 2));
    return { behind, front };
  }, []);
  const contactMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#1C2623", alphaMap: contactTex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.8, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }), [contactTex]);
  const contact = useRef<THREE.Group>(null);

  const sheet = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Group>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const sheen = useRef<THREE.PointLight>(null);
  const welds = useRef<(THREE.Group | null)[]>([]);
  const weldMats = useMemo(
    () =>
      Array.from({ length: ZONES - 1 }, () => ({
        bead: new THREE.MeshStandardMaterial({ color: "#E07A1F", emissive: "#E07A1F", emissiveIntensity: 0.5, roughness: 0.35 }),
        glow: new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
        tip: new THREE.MeshBasicMaterial({ color: "#FFD9A8", transparent: true, opacity: 0, toneMapped: false }),
      })),
    [glowTex],
  );

  // Weld geometry runs from z = 0 back to z = -W so scaling z draws the weld along the seam.
  const weldGeo = useMemo(() => {
    const bead = new THREE.BoxGeometry(0.024, 0.005, SHEET_WIDTH).translate(0, 0, -SHEET_WIDTH / 2);
    const glow = new THREE.PlaneGeometry(0.26, SHEET_WIDTH).rotateX(-Math.PI / 2).translate(0, 0, -SHEET_WIDTH / 2);
    const tip = new THREE.SphereGeometry(0.028, 12, 8);
    return { bead, glow, tip };
  }, []);

  const state = useRef({ p: -1, mx: 0, my: 0, sheen: 0, sheenTarget: 0, zone: -1, ready: false });
  const tmp = useMemo(
    () => ({
      target: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      top: new THREE.Vector3(),
      offset: new THREE.Vector3(),
      sph: new THREE.Spherical(),
      origin: new THREE.Vector3(),
      up: new THREE.Vector3(),
      worldUp: new THREE.Vector3(0, 1, 0),
      // Portrait screens: the finished floor runs top to bottom, first floor at the top.
      portraitUp: new THREE.Vector3(-1, 0, 0),
    }),
    [],
  );
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const size = useThree((s) => s.size);

  useEffect(() => () => {
    geometry.dispose();
    glowTex.dispose();
    weldMats.forEach((m) => Object.values(m).forEach((x) => x.dispose()));
    Object.values(weldGeo).forEach((g) => g.dispose());
    Object.values(contactGeo).forEach((g) => g.dispose());
    contactMat.dispose();
    contactTex.dispose();
  }, [geometry, glowTex, weldMats, weldGeo, contactGeo, contactMat, contactTex]);
  useEffect(() => () => mats?.dispose(), [mats]);

  useFrame((_, dt) => {
    const st = state.current;
    // The parent smooths scroll progress once and drives the DOM from the same
    // value, so the frame, the headline and the 3D stay in step.
    const p = progress.current;
    st.p = p;
    st.mx = THREE.MathUtils.damp(st.mx, pointer.current.x, 4, dt);
    st.my = THREE.MathUtils.damp(st.my, pointer.current.y, 4, dt);

    // --- Sheet
    const s = unrolledAt(p);
    const settle = smooth(0.78, 0.9, p);
    const rOuter = geometry.update(s, settle);

    // Cardboard core: rolls on with the sheet, then carries on off the slab.
    if (core.current) {
      const off = Math.pow(smooth(0.76, 0.92, p), 1.6) * 5;
      core.current.position.set(X0 + s + off, rOuter, 0);
      core.current.rotation.z = -(s + off) / CORE_RADIUS;
      core.current.visible = off < 4.9;
      if (contact.current) {
        contact.current.position.x = core.current.position.x;
        contact.current.scale.x = rOuter * 2.4;
        contactMat.opacity = (shadows ? 0.7 : 0.85) * (1 - smooth(0.9, 0.98, p));
        contact.current.visible = core.current.visible;
        // Once the sheet is fully laid, the core rolls on over bare slab.
        contact.current.children[0].position.y = off > 0.05 ? 0.0015 : THICKNESS + 0.0015;
      }
    }

    // --- Welds: each seam is welded just after the roll passes it.
    const finale = smooth(0.8, 0.9, p) * (1 - smooth(0.93, 1, p) * 0.4);
    for (let i = 0; i < ZONES - 1; i++) {
      const g = welds.current[i];
      if (!g) continue;
      const seamU = ((i + 1) * SHEET_LENGTH) / ZONES;
      const w = clamp01((s - seamU - 0.25) / 0.7);
      const m = weldMats[i];
      g.visible = w > 0;
      const bead = g.children[0] as THREE.Mesh;
      const tip = g.children[2] as THREE.Mesh;
      bead.scale.z = Math.max(0.0001, w);
      tip.position.z = -w * SHEET_WIDTH;
      const hot = w > 0 && w < 1 ? 1 : 0;
      m.tip.opacity = hot;
      m.bead.emissiveIntensity = 0.45 + finale * 0.7;
      m.glow.opacity = Math.min(0.45, 0.05 + hot * 0.25 + finale * 0.25) * (w > 0 ? 1 : 0);
      (g.children[1] as THREE.Mesh).scale.z = Math.max(0.0001, w);
    }

    // --- Spec card zone
    const zone = p >= 0.86 ? ZONES : Math.min(ZONES - 1, Math.floor((s / SHEET_LENGTH) * ZONES + 1e-4));
    if (zone !== st.zone) {
      st.zone = zone;
      onZone?.(zone);
    }

    // --- Camera: a low product shot looking along the roll's end, the laid
    // floor running away to the left. It pulls back and rises as the floor
    // grows, then lifts to top-down.
    // Frame: zoom out and shift the projection so that, while the canvas is
    // clipped to the column, the column shows exactly the framing it would
    // have as its own canvas. Both relax to a plain full-screen camera.
    const fr = frame.current;
    const g = clamp01(fr.grow);
    const W = Math.max(1, size.width);
    const H = Math.max(1, size.height);
    const fw = fr.w > 0 ? fr.w : W;
    const fh = fr.h > 0 ? fr.h : H;
    const dx = fr.x + fw / 2 - W / 2;
    const dy = fr.y + fh / 2 - H / 2;
    camera.zoom = THREE.MathUtils.lerp(fh / H, 1, g);
    camera.setViewOffset(W, H, -dx * (1 - g), -dy * (1 - g), W, H);
    camera.updateProjectionMatrix();
    const aspect = THREE.MathUtils.lerp(fw / fh, W / H, g);

    const f = s / SHEET_LENGTH;
    const follow = f * f * (3 - 2 * f);
    const rollX = X0 + s;
    tmp.target.set(
      THREE.MathUtils.lerp(rollX - 0.25, rollX - SHEET_LENGTH * 0.36, follow),
      THREE.MathUtils.lerp(0.2, 0, follow),
      THREE.MathUtils.lerp(0.55, 0.1, follow),
    );
    tmp.offset.set(
      THREE.MathUtils.lerp(2.3, 3.4, follow),
      THREE.MathUtils.lerp(1.05, 3.5, follow),
      THREE.MathUtils.lerp(4.3, 6.6, follow),
    );
    // Narrow viewports need to step back to keep the roll in frame.
    const back = aspect < 1.1 ? 1 + (1.1 - aspect) * 1.5 : 1;
    tmp.offset.multiplyScalar(back);
    // Subtle parallax, ±3°
    tmp.sph.setFromVector3(tmp.offset);
    tmp.sph.theta += THREE.MathUtils.degToRad(3) * st.mx;
    tmp.sph.phi = THREE.MathUtils.clamp(tmp.sph.phi + THREE.MathUtils.degToRad(3) * st.my * 0.8, 0.2, Math.PI / 2 - 0.05);
    tmp.offset.setFromSpherical(tmp.sph);
    tmp.pos.copy(tmp.target).add(tmp.offset);

    // Top-down framing that fits the whole laid floor.
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    // On a portrait screen the camera turns 90° so the strip runs top to bottom.
    const portrait = aspect < 1;
    // Margins leave room for the spec card (top) and the floor strip (bottom).
    const across = portrait ? SHEET_LENGTH * 1.36 : SHEET_WIDTH * 1.34;
    const along = portrait ? SHEET_WIDTH * 1.18 : SHEET_LENGTH * 1.14;
    const fitH = across / 2 / Math.tan(vfov / 2);
    const fitW = along / 2 / (Math.tan(vfov / 2) * aspect);
    const height = Math.max(fitH, fitW);
    tmp.top.set(st.mx * 0.08, height, 0.001 + st.my * 0.06);
    const b = easeInOut(smooth(0.78, 0.98, p));
    tmp.pos.lerp(tmp.top, b);
    tmp.target.lerp(tmp.origin, b);
    camera.position.copy(tmp.pos);
    tmp.up.copy(tmp.worldUp);
    if (portrait) tmp.up.lerp(tmp.portraitUp, b).normalize();
    camera.up.copy(tmp.up);
    camera.lookAt(tmp.target);

    // Keep the fog behind the floor as the camera rises, so a high top-down
    // shot (narrow screens) doesn't fade the floor into the background.
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      fog.near = THREE.MathUtils.lerp(9, height + 2, b);
      fog.far = THREE.MathUtils.lerp(24, height + 24, b);
    }

    // --- Key light follows the cursor so the sheen moves across the vinyl.
    if (key.current) {
      // Upper left of frame, like a large softbox; the cursor nudges it.
      key.current.position.set(tmp.target.x - 3.2 + st.mx * 2.2, 6.5, tmp.target.z + 3.6 - st.my * 1.6);
      key.current.target.position.copy(tmp.target);
      key.current.target.updateMatrixWorld();
    }

    // --- Hover sheen on the roll
    st.sheen = THREE.MathUtils.damp(st.sheen, st.sheenTarget, 6, dt);
    if (sheen.current) sheen.current.intensity = st.sheen * 3;

    if (!st.ready && mats) {
      st.ready = true;
      requestAnimationFrame(() => onReady?.());
    }
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (sheen.current) sheen.current.position.copy(e.point).add(new THREE.Vector3(0.2, 0.45, 0.5));
    state.current.sheenTarget = 1;
  };
  const onOut = () => {
    state.current.sheenTarget = 0;
  };

  return (
    <>
      <color attach="background" args={["#EEF0EE"]} />
      <fog attach="fog" args={["#EEF0EE", 9, 24]} />
      <hemisphereLight args={["#F6F8F6", "#C6CBC7", 0.22]} />
      <directionalLight
        ref={key}
        intensity={1.7}
        color="#FFF6EA"
        castShadow={shadows}
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-radius={7}
        shadow-blurSamples={12}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      >
        <orthographicCamera attach="shadow-camera" args={[-5.5, 5.5, 4.5, -4.5, 0.5, 22]} />
      </directionalLight>
      <pointLight ref={sheen} intensity={0} distance={2.2} decay={2} color="#FFFFFF" />

      <Environment resolution={quality === "high" ? 256 : 64} frames={1}>
        {/* A photo studio built in place (no HDRI download): one big softbox
            upper left, a weak fill, and a dark flag on the right so the roll
            keeps a gradient across its curve. */}
        <Lightformer form="rect" intensity={1.5} color="#FFFFFF" position={[-5, 6, 4]} rotation={[-Math.PI / 2.6, -0.5, 0]} scale={[9, 7, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#F3F6F4" position={[0, 7, -4]} rotation-x={Math.PI / 2} scale={[14, 6, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#EEF3F0" position={[2, 2.5, 8]} rotation-y={Math.PI} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1} color="#3A423F" position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 5, 1]} />
        <mesh scale={30}>
          <sphereGeometry args={[1, 16, 8]} />
          <meshBasicMaterial color="#AEB3AF" side={THREE.BackSide} />
        </mesh>
      </Environment>

      {/* Concrete slab */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.0005, 0]} receiveShadow>
        <planeGeometry args={[SLAB_SIZE, SLAB_SIZE]} />
        <meshStandardMaterial map={concrete} color="#FFFFFF" roughness={0.94} envMapIntensity={0.75} />
      </mesh>

      <group ref={contact}>
        <mesh geometry={contactGeo.behind} material={contactMat} position={[0, THICKNESS + 0.0015, 0]} renderOrder={2} />
        <mesh geometry={contactGeo.front} material={contactMat} position={[0, 0.0015, 0]} renderOrder={2} />
      </group>

      {mats && (
        <mesh ref={sheet} geometry={geometry} material={[mats.face, mats.edge]} frustumCulled={false} castShadow={shadows} receiveShadow onPointerMove={onMove} onPointerOut={onOut} />
      )}

      <group ref={core}>
        <mesh rotation-x={Math.PI / 2} castShadow={shadows}>
          <cylinderGeometry args={[CORE_RADIUS - 0.004, CORE_RADIUS - 0.004, SHEET_WIDTH + 0.04, 32, 1, true]} />
          <meshStandardMaterial color="#B79A73" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {Array.from({ length: ZONES - 1 }, (_, i) => {
        const x = X0 + ((i + 1) * SHEET_LENGTH) / ZONES;
        const m = weldMats[i];
        return (
          <group key={i} ref={(g) => { welds.current[i] = g; }} position={[x, THICKNESS + 0.001, SHEET_WIDTH / 2]} visible={false}>
            <mesh material={m.bead} geometry={weldGeo.bead} />
            <mesh material={m.glow} geometry={weldGeo.glow} position={[0, 0.003, 0]} />
            <mesh material={m.tip} geometry={weldGeo.tip} position={[0, 0.012, 0]} />
          </group>
        );
      })}

    </>
  );
}

export default function VinylRollScene(props: SceneProps) {
  const { active, quality, onDecline, ...rest } = props;
  // Full-screen canvas: cap the pixel ratio at 1.25 to keep scrolling smooth.
  const dprRef = useRef<[number, number]>([1, 1.25]);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dprRef.current}
      shadows={{ type: THREE.VSMShadowMap }}
      camera={{ fov: 26, near: 0.05, far: 60, position: [1, 1.2, 5] }}
      gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
      onCreated={({ gl }) => {
        // Neutral keeps the floor colours true where ACES would grey them.
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1;
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor flipflops={2} onDecline={() => onDecline?.()} />
      <World quality={quality} {...rest} />
    </Canvas>
  );
}
