export type Vec = [number, number];

/** A run of a stem that sits behind (0) or in front of (1) the letters. */
export interface Seg {
  u0: number;
  u1: number;
  layer: 0 | 1;
}

// Small deterministic PRNG so a given seed always grows the same garden.
export function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A wandering stem: walks `len` from `base`, wobbling sideways in `waves` and bending as it goes. */
export function vine(base: Vec, dir: number, len: number, amp: number, waves: number, ph: number, bend: number, n = 40) {
  const pts: Vec[] = [[base[0], base[1]]];
  const step = len / n;
  let [x, y] = base;
  for (let i = 1; i <= n; i++) {
    const u = i / n;
    const a = dir + bend * u + amp * Math.sin(u * Math.PI * waves + ph) * Math.min(1, u * 3);
    x += Math.cos(a) * step;
    y += Math.sin(a) * step;
    pts.push([x, y]);
  }
  return pts;
}

/** Finish a stem in a tightening spiral. */
export function curl(pts: Vec[], sign: number, rad: number) {
  const n = pts.length;
  const e = pts[n - 1];
  const a = Math.atan2(e[1] - pts[n - 2][1], e[0] - pts[n - 2][0]);
  const c: Vec = [e[0] - Math.sin(a) * sign * rad, e[1] + Math.cos(a) * sign * rad];
  const a0 = Math.atan2(e[1] - c[1], e[0] - c[0]);
  for (let i = 1; i <= 14; i++) {
    const u = i / 14;
    const t = a0 + sign * u * Math.PI * 1.6;
    const rr = rad * (1 - 0.5 * u);
    pts.push([c[0] + Math.cos(t) * rr, c[1] + Math.sin(t) * rr]);
  }
  return pts;
}

export function cubic(a: Vec, b: Vec, c: Vec, d: Vec, n: number) {
  const pts: Vec[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    pts.push([
      u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
      u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
    ]);
  }
  return pts;
}

/** Point and direction at fraction `u` along a polyline. */
export function at(pts: Vec[], u: number): [Vec, number] {
  const n = pts.length;
  const i = Math.min(n - 2, Math.max(1, Math.round(u * (n - 1))));
  return [pts[i], Math.atan2(pts[i + 1][1] - pts[i - 1][1], pts[i + 1][0] - pts[i - 1][0])];
}

/** Cut a stem into runs that alternate behind and in front of the type, so it weaves through it. */
export function weave(r: () => number, start: 0 | 1): Seg[] {
  const cuts = Array.from({ length: 1 + Math.floor(r() * 3) }, () => 0.15 + r() * 0.7).sort((a, b) => a - b);
  const segs: Seg[] = [];
  let u0 = 0;
  let layer = start;
  for (const c of cuts) {
    if (c <= u0) continue;
    segs.push({ u0, u1: c, layer });
    // Sometimes leave a small gap where the stem "passes through" a letter.
    u0 = r() < 0.3 ? Math.min(0.98, c + 0.02 + r() * 0.03) : c;
    layer = layer === 0 ? 1 : 0;
  }
  segs.push({ u0, u1: 1, layer });
  return segs;
}

export function layerAt(segs: Seg[], u: number): 0 | 1 {
  for (const s of segs) if (u >= s.u0 && u <= s.u1) return s.layer;
  return segs[segs.length - 1].layer;
}

const f = (n: number) => Math.round(n * 100) / 100;

/**
 * SVG path data for a smooth curve through points (midpoint quadratics), open or closed.
 * The command structure depends only on the point count, so two calls with the same count can be
 * tweened into each other — that's how the roses morph from bud to bloom.
 */
export function toPath(p: Vec[], closed: boolean) {
  const n = p.length;
  if (n < 2) return "";
  const mid = (a: Vec, b: Vec): Vec => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const out: string[] = [];
  if (closed) {
    const s0 = mid(p[n - 1], p[0]);
    out.push(`M${f(s0[0])} ${f(s0[1])}`);
    for (let i = 0; i < n; i++) {
      const q = mid(p[i], p[(i + 1) % n]);
      out.push(`Q${f(p[i][0])} ${f(p[i][1])} ${f(q[0])} ${f(q[1])}`);
    }
    out.push("Z");
  } else {
    out.push(`M${f(p[0][0])} ${f(p[0][1])}`);
    for (let i = 1; i < n - 1; i++) {
      const q = mid(p[i], p[i + 1]);
      out.push(`Q${f(p[i][0])} ${f(p[i][1])} ${f(q[0])} ${f(q[1])}`);
    }
    out.push(`L${f(p[n - 1][0])} ${f(p[n - 1][1])}`);
  }
  return out.join("");
}
