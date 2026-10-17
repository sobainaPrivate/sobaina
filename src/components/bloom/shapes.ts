import { toPath, type Vec } from "./vine";

/** Geometry for the SVG flowers. Everything returns path data in coordinates local to the flower. */

const f = (n: number) => Math.round(n * 100) / 100;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rot = ([x, y]: Vec, a: number): Vec => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const pt = ([x, y]: Vec) => `${f(x)} ${f(y)}`;

/**
 * A sharp leaf pointing along `angle` from (ox, oy): two cubic curves that meet in points at the
 * base and tip, slightly asymmetric so a row of them doesn't look stamped.
 */
export function leafPath(L: number, bend: number, W = 0.3, angle = 0, ox = 0, oy = 0) {
  const T = (p: Vec): Vec => {
    const [x, y] = rot(p, angle);
    return [x + ox, y + oy];
  };
  const ta = bend * 0.45;
  const tip: Vec = [L * Math.cos(ta), L * Math.sin(ta)];
  const w = L * W;
  const blade =
    `M${pt(T([0, 0]))}` +
    `C${pt(T([L * 0.28, -w * 1.05]))} ${pt(T([L * 0.72, -w * 0.75 + tip[1] * 0.6]))} ${pt(T(tip))}` +
    `C${pt(T([L * 0.72, w * 0.6 + tip[1] * 0.6]))} ${pt(T([L * 0.28, w * 0.95]))} ${pt(T([0, 0]))}Z`;
  const vein = `M${pt(T([L * 0.06, 0]))}Q${pt(T([L * 0.5, tip[1] * 0.35]))} ${pt(T([tip[0] * 0.82, tip[1] * 0.82]))}`;
  return { blade, vein };
}

export interface FlowerSeed {
  rot: number;
  tipA: number;
  ph1: number;
  ph2: number;
  turns: number;
}

/** Bud faces along its stem; the open flower turns to face the viewer. */
const facing = (e: FlowerSeed, o: number) => lerp(e.tipA + Math.PI / 2, e.rot, o);

/** Two sepals that hug the bud (o = 0) and fold back under the open flower (o = 1). */
function sepals(R: number, o: number, turn: number) {
  const base = rot([0, R * lerp(0.18, 0.1, o)], turn);
  return [-1, 1]
    .map((s) => leafPath(R * lerp(0.85, 0.6, o), s * 0.6, 0.28, turn - Math.PI / 2 + s * lerp(0.45, 2.2, o), base[0], base[1]).blade)
    .join("");
}

/**
 * A rose at openness `o`: pointed, sepal-wrapped bud → scalloped bloom with white line-art
 * (an inner petal ring, a spiral heart and a few petal-cup doodles).
 */
export function roseParts(R: number, o: number, e: FlowerSeed) {
  const turn = facing(e, o);
  const P = (p: Vec) => rot(p, turn);

  const petals: Vec[] = Array.from({ length: 26 }, (_, i) => {
    const th = (i / 26) * Math.PI * 2;
    const bloomR = R * (1 + 0.07 * Math.sin(5 * th + e.ph1) + 0.04 * Math.sin(2 * th + e.ph2));
    let by = Math.sin(th) * R * 0.58 - R * 0.32;
    if (Math.sin(th) < 0) by -= R * 0.4 * Math.pow(-Math.sin(th), 4);
    return P([lerp(Math.cos(th) * R * 0.46, Math.cos(th) * bloomR, o), lerp(by, Math.sin(th) * bloomR, o)]);
  });

  const c: Vec = [lerp(0, Math.cos(e.ph2) * R * 0.12, o), lerp(-R * 0.32, Math.sin(e.ph2) * R * 0.12, o)];
  const sx = 0.55 + 0.45 * o;
  const ring: Vec[] = Array.from({ length: 16 }, (_, i) => {
    const th = (i / 16) * Math.PI * 2;
    const rad = R * (0.16 + 0.44 * o) * (1 + 0.06 * Math.sin(3 * th + e.ph2));
    return P([c[0] + Math.cos(th) * rad * sx, c[1] + Math.sin(th) * rad]);
  });
  const spiral: Vec[] = Array.from({ length: 31 }, (_, i) => {
    const u = i / 30;
    const ang = e.ph1 + u * (0.7 + e.turns * 0.85 * o) * Math.PI * 2;
    const rad = R * (0.04 + (0.14 + 0.3 * o) * Math.pow(u, 0.8)) * (1 + 0.08 * Math.sin(u * 9 + e.ph2));
    return P([c[0] + Math.cos(ang) * rad * sx, c[1] + Math.sin(ang) * rad]);
  });
  const doodles = [0, 1, 2]
    .map((k) => {
      const a0 = e.ph1 + k * 2.1 + 0.3;
      const arc: Vec[] = Array.from({ length: 7 }, (_, j) => {
        const a = a0 + (j / 6) * 0.55;
        const rr = R * 0.74 * (0.5 + 0.5 * o);
        return P([Math.cos(a) * rr, Math.sin(a) * rr]);
      });
      return toPath(arc, false);
    })
    .join("");

  return { sepals: sepals(R, o, turn), petals: toPath(petals, true), ring: toPath(ring, true), spiral: toPath(spiral, false), doodles };
}

function blob(cx: number, cy: number, rx: number, ry: number, a: number, n: number) {
  const pts: Vec[] = Array.from({ length: n }, (_, j) => {
    const t = (j / n) * Math.PI * 2;
    const [x, y] = rot([Math.cos(t) * rx, Math.sin(t) * ry], a);
    return [cx + x, cy + y];
  });
  return toPath(pts, true);
}

/** A sunflower at openness `o`: petals bunched into a pointed bud → double ring around a seeded disk. */
export function sunflowerParts(R: number, o: number, e: FlowerSeed) {
  const turn = facing(e, o) * (1 - o) + e.rot * 0.3 * o;
  const lift = -R * 0.3 * (1 - o);
  const n = 16;
  const ring = (offset: number, scale: number) =>
    Array.from({ length: n }, (_, i) => {
      const closed = -Math.PI / 2 + (i / (n - 1) - 0.5) * 0.6;
      const a = lerp(closed, e.ph1 + offset + (i * Math.PI * 2) / n, o) + turn;
      const len = R * scale * (0.45 + 0.55 * o);
      const d = R * 0.3 * o + len / 2;
      const [cx, cy] = rot([0, lift], turn);
      return blob(cx + Math.cos(a) * d, cy + Math.sin(a) * d, len / 2, R * (0.11 + 0.06 * o), a, 8);
    }).join("");

  const [dx, dy] = rot([0, lift], turn);
  const disk = R * (0.12 + 0.33 * o);
  const seeds = Array.from({ length: 34 }, (_, j) => {
    const rr = Math.sqrt((j + 1) / 34) * disk * 0.85;
    const ang = (j + 1) * 2.39996 + e.ph2;
    const s = Math.max(0.6, disk * 0.06);
    return blob(dx + Math.cos(ang) * rr, dy + Math.sin(ang) * rr, s, s, 0, 6);
  }).join("");

  return {
    sepals: sepals(R, o, turn),
    back: ring(Math.PI / n, 1),
    front: ring(0, 0.92),
    disk: blob(dx, dy, disk, disk, 0, 12),
    seeds,
  };
}
