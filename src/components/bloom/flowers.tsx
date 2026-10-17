import { motion, useTransform, type MotionValue } from "framer-motion";
import { BLOOM, type LeafEl, type RoseEl, type StemEl } from "./garden";
import { leafPath, roseParts, sunflowerParts } from "./shapes";
import { layerAt, toPath, type Vec } from "./vine";

const SUN = { petal: "#FFD23F", petalBack: "#FF8A00", disk: "#3B1F0E", seed: "#8A5A24" } as const;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Shared by every head and leaf: pop in from nothing once the stem reaches it. */
const pop = (delay: number, instant: boolean) => ({
  initial: { scale: 0 },
  animate: { scale: [0, 1] },
  transition: instant ? { duration: 0 } : { delay, duration: 0.55, ease: "easeOut" as const },
});

/** The part of a polyline between fractions u0 and u1. */
function slice(pts: Vec[], u0: number, u1: number): Vec[] {
  const n = pts.length - 1;
  const at = (t: number): Vec => {
    const i = Math.min(n - 1, Math.floor(t));
    const fr = t - i;
    return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * fr, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * fr];
  };
  const out: Vec[] = [at(u0 * n)];
  for (let i = Math.floor(u0 * n) + 1; i < u1 * n; i++) out.push(pts[i]);
  out.push(at(u1 * n));
  return out;
}

/** The runs of one stem that sit in this layer; each run draws on (spring) once the run before it is done. */
export function StemRuns({ e, layer, S, instant }: { e: StemEl; layer: 0 | 1; S: number; instant: boolean }) {
  const width = Math.max(1.2, S * 0.022 * e.w);
  return (
    <>
      {e.segs.map((seg, k) => {
        if (seg.layer !== layer) return null;
        const delay = e.start + e.dur * seg.u0;
        return (
          <motion.path
            key={k}
            d={toPath(slice(e.pts, seg.u0, seg.u1), false)}
            fill="none"
            stroke={BLOOM.stem}
            strokeWidth={width}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={
              instant
                ? { duration: 0 }
                : {
                    pathLength: { type: "spring", bounce: 0, duration: Math.max(0.2, e.dur * (seg.u1 - seg.u0)), delay },
                    opacity: { duration: 0.01, delay },
                  }
            }
          />
        );
      })}
      {e.thorns.map((th, k) => {
        if (layerAt(e.segs, th.u) !== layer) return null;
        const i = Math.round(th.u * (e.pts.length - 1));
        const [p, q] = [e.pts[i], e.pts[Math.min(e.pts.length - 1, i + 1)]];
        const d = Math.atan2(q[1] - p[1], q[0] - p[0]) + th.s * 2.3;
        const L = S * 0.045;
        return (
          <motion.path
            key={`t${k}`}
            d={`M${p[0]} ${p[1]}L${p[0] + Math.cos(d) * L} ${p[1] + Math.sin(d) * L}`}
            stroke={BLOOM.stem}
            strokeWidth={width}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: instant ? 0 : e.start + e.dur * th.u, duration: instant ? 0 : 0.2 }}
          />
        );
      })}
    </>
  );
}

export function Leaf({ e, instant }: { e: LeafEl; instant: boolean }) {
  const { blade, vein } = leafPath(e.L, e.bend);
  return (
    <g transform={`translate(${e.x} ${e.y}) rotate(${(e.a * 180) / Math.PI})`}>
      <motion.g {...pop(e.start, instant)} style={{ originX: 0, originY: 0.5 }}>
        <path d={blade} fill={BLOOM.stem} />
        <path d={vein} fill="none" stroke={BLOOM.vein} strokeWidth={Math.max(0.7, e.L * 0.035)} strokeLinecap="round" />
      </motion.g>
    </g>
  );
}

interface HeadProps {
  e: RoseEl;
  bloom: MotionValue<number>;
  instant: boolean;
}

/** How open this flower is (0..1) for the scroll-driven bloom, eased and staggered per flower. */
function useOpen(e: RoseEl, bloom: MotionValue<number>) {
  return useTransform(bloom, (b) => {
    const o = clamp01((b - e.bloomAt) / 0.45);
    return o * o * (3 - 2 * o);
  });
}

export function Rose({ e, bloom, instant }: HeadProps) {
  const parts = useTransform(useOpen(e, bloom), (o) => roseParts(e.R, o, e));
  const sepals = useTransform(parts, (p) => p.sepals);
  const petals = useTransform(parts, (p) => p.petals);
  const ring = useTransform(parts, (p) => p.ring);
  const spiral = useTransform(parts, (p) => p.spiral);
  const doodles = useTransform(parts, (p) => p.doodles);
  const doodleOpacity = useTransform(useOpen(e, bloom), (o) => clamp01((o - 0.25) / 0.4));
  const line = Math.max(1, e.R * 0.07);
  return (
    <g transform={`translate(${e.x} ${e.y})`}>
      <motion.g {...pop(e.start, instant)}>
        <motion.path d={sepals} fill={BLOOM.stem} />
        <motion.path d={petals} fill={BLOOM.rose} />
        <g fill="none" stroke={BLOOM.line} strokeWidth={line} strokeLinecap="round" strokeLinejoin="round">
          <motion.path d={ring} />
          <motion.path d={spiral} />
          <motion.path d={doodles} style={{ opacity: doodleOpacity }} />
        </g>
      </motion.g>
    </g>
  );
}

export function Sunflower({ e, bloom, instant }: HeadProps) {
  const open = useOpen(e, bloom);
  const parts = useTransform(open, (o) => sunflowerParts(e.R, o, e));
  const sepals = useTransform(parts, (p) => p.sepals);
  const back = useTransform(parts, (p) => p.back);
  const front = useTransform(parts, (p) => p.front);
  const disk = useTransform(parts, (p) => p.disk);
  const seeds = useTransform(parts, (p) => p.seeds);
  const seedOpacity = useTransform(open, (o) => clamp01((o - 0.3) / 0.4));
  return (
    <g transform={`translate(${e.x} ${e.y})`}>
      <motion.g {...pop(e.start, instant)}>
        <motion.path d={sepals} fill={BLOOM.stem} />
        <motion.path d={back} fill={SUN.petalBack} />
        <motion.path d={front} fill={SUN.petal} />
        <motion.path d={disk} fill={SUN.disk} />
        <motion.path d={seeds} fill={SUN.seed} style={{ opacity: seedOpacity }} />
      </motion.g>
    </g>
  );
}
