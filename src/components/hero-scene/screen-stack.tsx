import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createMeshGradientMaterial } from "./mesh-gradient";
import { buildSkeleton } from "./ui-skeleton";

/** Matches Tailwind's `lg` breakpoint, where the hero copy and the stack sit side by side. */
export const DESKTOP_MIN = 1024;

// Phone slab dimensions (world units).
const W = 1;
const D = 2;
const H = 0.07;
const RADIUS = 0.14;
const INSET = 0.06;
const SCREEN: readonly [number, number] = [W - INSET * 2, D - INSET * 2];

// Bottom → top. In Render mode each phone shows the mobile view of one of Sobaina's live sites.
const LAYERS = [
  { variant: 2, seed: 9, base: "#FFB4A8", colors: ["#FF8A00", "#FF1400", "#3257FF"], shot: "/work/aistear/mobile.webp" },
  { variant: 1, seed: 4, base: "#9FB4FF", colors: ["#3257FF", "#E63CFF", "#FFB7C5"], shot: "/work/tasleem/mobile.webp" },
  { variant: 0, seed: 0, base: "#FFE2B8", colors: ["#FF1400", "#3257FF", "#FFB4A8"], shot: "/work/ihsan/mobile.webp" },
] as const;

// Screen-space right/up directions for a camera at (1,1,1) looking at the origin.
const SCREEN_RIGHT = new THREE.Vector3(1, 0, -1).normalize();
const SCREEN_UP = new THREE.Vector3(-1, 2, -1).normalize();


/** ShapeGeometry UVs are in shape units; remap them to 0..1 so an image fills the screen. */
function fitUVs(geometry: THREE.BufferGeometry, [w, h]: readonly [number, number]) {
  const pos = geometry.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geometry;
}

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

interface SlabProps {
  layer: (typeof LAYERS)[number];
  index: number;
  rendered: boolean;
  reduced: boolean;
}

function Slab({ layer, index, rendered, reduced }: SlabProps) {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(0);

  const parts = useMemo(() => {
    const body = new THREE.ExtrudeGeometry(roundedRect(W, D, RADIUS), {
      depth: H,
      bevelEnabled: false,
      curveSegments: 12,
    });
    return {
      body,
      edges: new THREE.EdgesGeometry(body, 40),
      screen: fitUVs(new THREE.ShapeGeometry(roundedRect(SCREEN[0], SCREEN[1], RADIUS - INSET / 2), 12), SCREEN),
      skeleton: buildSkeleton(layer.variant, SCREEN[0], SCREEN[1], H + 0.004),
      bodyMat: new THREE.MeshBasicMaterial({ color: "#0a0a0a", transparent: true, opacity: 0 }),
      edgeMat: new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0 }),
      skelMat: new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0 }),
      screenMat: createMeshGradientMaterial({
        mode: "surface",
        size: SCREEN,
        base: layer.base,
        colors: layer.colors,
        seed: layer.seed,
        radius: 0.55,
        intensity: 1,
        opacity: 0,
      }),
      // Loaded without suspending, so the wireframe shows straight away and the shot is ready by Render.
      shotMat: new THREE.MeshBasicMaterial({
        map: (() => {
          const tex = new THREE.TextureLoader().load(layer.shot);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          return tex;
        })(),
        transparent: true,
        opacity: 0,
        toneMapped: false,
      }),
    };
  }, [layer]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    // Lower layers react a beat later, so the stack "cascades" between modes.
    const lambda = 3.2 - index * 0.7;
    const p = (progress.current = THREE.MathUtils.damp(progress.current, rendered ? 1 : 0, lambda, dt));
    const t = state.clock.elapsedTime;

    const gap = THREE.MathUtils.lerp(0.78, 0.42, p);
    const float = reduced ? 0 : Math.sin(t * 0.8 + index * 1.3) * 0.04;
    g.position.y = THREE.MathUtils.damp(g.position.y, index * gap + float, 4, dt);

    const intro = Math.min(t / 1.2, 1);
    parts.bodyMat.opacity = p * 0.96;
    parts.bodyMat.depthWrite = p > 0.6;
    parts.edgeMat.opacity = THREE.MathUtils.lerp(0.9, 0.2, p) * intro;
    // The wireframe linework hands over to the real screen: gradient first, then the live site on top.
    parts.skelMat.opacity = THREE.MathUtils.lerp(0.55, 0, Math.min(1, p * 1.6)) * intro;
    parts.screenMat.uniforms.uOpacity.value = p;
    parts.shotMat.opacity = Math.min(1, Math.max(0, (p - 0.25) / 0.6));
    parts.screenMat.uniforms.uTime.value = reduced ? 0 : t;
  });

  return (
    <group ref={group}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={parts.body} material={parts.bodyMat} />
        <lineSegments geometry={parts.edges} material={parts.edgeMat} />
        <mesh geometry={parts.screen} material={parts.screenMat} position={[0, 0, H + 0.002]} />
        <mesh geometry={parts.screen} material={parts.shotMat} position={[0, 0, H + 0.003]} />
        <lineSegments geometry={parts.skeleton} material={parts.skelMat} />
      </group>
    </group>
  );
}

interface ScreenStackProps {
  rendered: boolean;
  reduced: boolean;
  pointer: RefObject<{ x: number; y: number }>;
}

export default function ScreenStack({ rendered, reduced, pointer }: ScreenStackProps) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { size, camera } = useThree();

  useFrame((_, dt) => {
    if (!outer.current || !inner.current) return;
    // Sit to the right of the copy on desktop, above it on mobile.
    const desktop = size.width >= DESKTOP_MIN;
    const dx = desktop ? size.width * 0.2 : 0;
    const dy = desktop ? -size.height * 0.02 : size.height / 2 - Math.max(150, size.height * 0.19);
    outer.current.position
      .copy(SCREEN_RIGHT)
      .multiplyScalar(dx / camera.zoom)
      .addScaledVector(SCREEN_UP, dy / camera.zoom);

    const { x, y } = pointer.current;
    inner.current.rotation.y = THREE.MathUtils.damp(inner.current.rotation.y, x * 0.35, 3, dt);
    inner.current.rotation.z = THREE.MathUtils.damp(inner.current.rotation.z, y * 0.08, 3, dt);
  });

  return (
    <group ref={outer}>
      <group ref={inner} position={[0, -0.6, 0]}>
        {LAYERS.map((layer, i) => (
          <Slab key={layer.seed} layer={layer} index={i} rendered={rendered} reduced={reduced} />
        ))}
      </group>
    </group>
  );
}
