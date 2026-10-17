import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { createMeshGradientMaterial } from "./mesh-gradient";
import ScreenStack, { DESKTOP_MIN } from "./screen-stack";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** True isometric view: orthographic camera on the (1,1,1) diagonal. */
function IsoCamera() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const desktop = size.width >= DESKTOP_MIN;
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    camera.zoom = desktop
      ? Math.min(size.width * 0.42, size.height * 0.62) / 3.2
      : Math.min(size.width * 0.6, size.height * 0.28) / 3.2;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Backdrop({ rendered, reduced }: { rendered: boolean; reduced: boolean }) {
  const { size } = useThree();
  const material = useMemo(
    () =>
      createMeshGradientMaterial({
        mode: "fullscreen",
        base: "#000000",
        colors: ["#FF1400", "#3257FF", "#FFB4A8"],
        seed: 2,
        radius: 0.32,
        intensity: 0.35,
      }),
    [],
  );

  useFrame((state, dt) => {
    const u = material.uniforms;
    u.uAspect.value = size.width / size.height;
    u.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    u.uIntensity.value = THREE.MathUtils.damp(u.uIntensity.value, rendered ? 0.8 : 0.35, 2, dt);
  });

  return (
    <mesh material={material} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export default function HeroScene({ rendered }: { rendered: boolean }) {
  const reduced = usePrefersReducedMotion();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      gl={{ antialias: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <IsoCamera />
      <Backdrop rendered={rendered} reduced={reduced} />
      <Grid
        position={[0, -0.75, 0]}
        infiniteGrid
        cellSize={0.25}
        sectionSize={1}
        cellThickness={0.6}
        sectionThickness={0.9}
        cellColor="#1E1E1E"
        sectionColor="#3A3A3A"
        fadeDistance={24}
        fadeStrength={2}
      />
      <ScreenStack rendered={rendered} reduced={reduced} pointer={pointer} />
    </Canvas>
  );
}
