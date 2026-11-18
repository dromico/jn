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
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { buildFloorAtlas, paintConcrete } from "./textures";

// World units are roughly metres, with the thickness exaggerated so you can see it.
const SHEET_LENGTH = 6;
const SHEET_WIDTH = 3;
const THICKNESS = 0.028;
const CORE_RADIUS = 0.085;
const X0 = -SHEET_LENGTH / 2;
const ZONES = 6;

export interface SceneProps {
  /** 0..1 scroll progress, written by the parent; read every frame. */
  progress: MutableRefObject<number>;
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
  return useMemo(() => {
    const ppu = quality === "high" ? 256 : 150;
    const atlas = buildFloorAtlas(ppu * (SHEET_LENGTH / ZONES), ppu * SHEET_WIDTH, ppu / 300);
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
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughness: 1,
      roughnessMap: surface,
      clearcoat: 1,
      clearcoatMap: surface,
      clearcoatRoughness: 0.22,
      envMapIntensity: 0.55,
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
  }, [gl, quality]);
}

function useConcrete(quality: "high" | "low") {
  return useMemo(() => {
    const size = quality === "high" ? 1024 : 512;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    paintConcrete(c.getContext("2d", { willReadFrequently: true })!, { x: 0, y: 0, w: size, h: size }, size / 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    tex.anisotropy = 4;
    return tex;
  }, [quality]);
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
export const unrolledAt = (p: number) => SHEET_LENGTH * easeInOut(clamp01((p - 0.02) / 0.74));

// ---------------------------------------------------------------------------
// The world

function World({ progress, pointer, quality, onZone, onReady }: Omit<SceneProps, "active" | "onDecline">) {
  const segments = quality === "high" ? 720 : 380;
  const geometry = useMemo(() => new SheetGeometry(segments), [segments]);
  const mats = useSheetMaterials(quality);
  const concrete = useConcrete(quality);
  const glowTex = useGlowTexture();

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
  const tmp = useMemo(() => ({ target: new THREE.Vector3(), pos: new THREE.Vector3(), top: new THREE.Vector3(), offset: new THREE.Vector3(), sph: new THREE.Spherical() }), []);
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const size = useThree((s) => s.size);

  useEffect(() => () => {
    geometry.dispose();
    mats.dispose();
    concrete.dispose();
    glowTex.dispose();
    weldMats.forEach((m) => Object.values(m).forEach((x) => x.dispose()));
    Object.values(weldGeo).forEach((g) => g.dispose());
  }, [geometry, mats, concrete, glowTex, weldMats, weldGeo]);

  useFrame((_, dt) => {
    const st = state.current;
    const goal = progress.current;
    // Damp toward the scroll position so Lenis-smoothed input stays silky.
    st.p = st.p < 0 ? goal : THREE.MathUtils.damp(st.p, goal, 7, dt);
    if (Math.abs(st.p - goal) < 0.0004) st.p = goal;
    const p = st.p;
    st.mx = THREE.MathUtils.damp(st.mx, pointer.current.x, 4, dt);
    st.my = THREE.MathUtils.damp(st.my, pointer.current.y, 4, dt);

    // --- Sheet
    const s = unrolledAt(p);
    const settle = smooth(0.76, 0.9, p);
    const rOuter = geometry.update(s, settle);

    // Cardboard core: rolls on with the sheet, then carries on off the slab.
    if (core.current) {
      const off = Math.pow(smooth(0.74, 0.92, p), 1.6) * 5;
      core.current.position.set(X0 + s + off, rOuter, 0);
      core.current.rotation.z = -(s + off) / CORE_RADIUS;
      core.current.visible = off < 4.9;
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

    // --- Camera: follow the roll in three-quarter view, then rise to top-down.
    const aspect = size.width / Math.max(1, size.height);
    const follow = smooth(0, 0.76, p);
    tmp.target.set(X0 + 0.55 + s * 0.72, 0.12 * (1 - follow), 0.1);
    tmp.offset.set(
      THREE.MathUtils.lerp(-2.1, -2.0, follow),
      THREE.MathUtils.lerp(2.0, 2.9, follow),
      THREE.MathUtils.lerp(5.0, 5.8, follow),
    );
    // Narrow viewports need to step back to keep the roll in frame.
    const back = aspect < 1.1 ? 1 + (1.1 - aspect) * 0.9 : 1;
    tmp.offset.multiplyScalar(back);
    // Subtle parallax, ±3°
    tmp.sph.setFromVector3(tmp.offset);
    tmp.sph.theta += THREE.MathUtils.degToRad(3) * st.mx;
    tmp.sph.phi = THREE.MathUtils.clamp(tmp.sph.phi + THREE.MathUtils.degToRad(3) * st.my * 0.8, 0.2, Math.PI / 2 - 0.05);
    tmp.offset.setFromSpherical(tmp.sph);
    tmp.pos.copy(tmp.target).add(tmp.offset);

    // Top-down framing that fits the whole laid floor.
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const fitH = (SHEET_WIDTH * 1.18) / 2 / Math.tan(vfov / 2);
    const fitW = (SHEET_LENGTH * 1.1) / 2 / (Math.tan(vfov / 2) * aspect);
    const height = Math.max(fitH, fitW);
    tmp.top.set(st.mx * 0.08, height, 0.001 + st.my * 0.06);
    const b = easeInOut(smooth(0.76, 0.98, p));
    tmp.pos.lerp(tmp.top, b);
    tmp.target.lerp(new THREE.Vector3(0, 0, 0), b);
    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.target);

    // --- Key light follows the cursor so the sheen moves across the vinyl.
    if (key.current) {
      key.current.position.set(tmp.target.x + st.mx * 4, 6, tmp.target.z + 3 - st.my * 3);
      key.current.target.position.copy(tmp.target);
      key.current.target.updateMatrixWorld();
    }

    // --- Hover sheen on the roll
    st.sheen = THREE.MathUtils.damp(st.sheen, st.sheenTarget, 6, dt);
    if (sheen.current) sheen.current.intensity = st.sheen * 3;

    if (!st.ready) {
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
      <fog attach="fog" args={["#EEF0EE", 10, 26]} />
      <hemisphereLight args={["#F4F7F5", "#B8BDB9", 0.4]} />
      <directionalLight ref={key} intensity={1.9} color="#FFF8EE" />
      <pointLight ref={sheen} intensity={0} distance={2.2} decay={2} color="#FFFFFF" />

      <Environment resolution={quality === "high" ? 256 : 64} frames={1}>
        {/* A soft studio, built in place so there is no HDRI download. */}
        <Lightformer form="rect" intensity={1.3} color="#FFFFFF" position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#F3F6F4" position={[-6, 2.5, 3]} rotation-y={Math.PI / 2.5} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#EAF1EE" position={[6, 2, -2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#FFFFFF" position={[2, 3, 6]} scale={2.5} />
        <mesh scale={30}>
          <sphereGeometry args={[1, 16, 8]} />
          <meshBasicMaterial color="#D9DDDA" side={THREE.BackSide} />
        </mesh>
      </Environment>

      {/* Concrete slab */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.0005, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial map={concrete} color="#E4E7E4" roughness={0.92} envMapIntensity={0.5} />
      </mesh>

      <mesh ref={sheet} geometry={geometry} material={[mats.face, mats.edge]} frustumCulled={false} onPointerMove={onMove} onPointerOut={onOut} />

      <group ref={core}>
        <mesh rotation-x={Math.PI / 2}>
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

      {quality === "high" && (
        <ContactShadows position={[0, 0.0008, 0]} scale={16} resolution={512} far={1.2} blur={2.2} opacity={0.42} frames={Infinity} color="#23312D" />
      )}
    </>
  );
}

export default function VinylRollScene(props: SceneProps) {
  const { active, quality, onDecline, ...rest } = props;
  const dprRef = useRef<[number, number]>([1, quality === "high" ? 1.5 : 1.25]);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dprRef.current}
      camera={{ fov: 30, near: 0.05, far: 60, position: [-4, 1.5, 3.5] }}
      gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.86;
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor flipflops={2} onDecline={() => onDecline?.()} />
      <World quality={quality} {...rest} />
    </Canvas>
  );
}
