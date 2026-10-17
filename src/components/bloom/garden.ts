import { at, cubic, curl, layerAt, rng, vine, weave, type Seg, type Vec } from "./vine";

/** Garden growth model adapted from Type Garden (type-garden.vercel.app) by Akshat Agarwal. */

export const BLOOM = { rose: "#FF1E27", stem: "#0A3BFF", line: "#FFFFFF", vein: "#000000" } as const;

/** When the first letter is typed, and the average gap between keystrokes (seconds). */
export const FIRST_LETTER = 0.5;
const LETTER_GAP = 0.3;

/**
 * When character `i` is typed. Keystrokes are a little uneven, like a person typing; the letters,
 * the caret and each letter's garden all run off this one schedule.
 */
export function letterBirth(i: number) {
  let t = FIRST_LETTER;
  for (let k = 1; k <= i; k++) t += LETTER_GAP * (0.7 + 0.6 * ((Math.sin(k * 12.9898) * 43758.5453) % 1 + 1) % 1);
  return t;
}
/** Growth runs this many times slower than Type Garden's typing speed. */
const SLOW = 2.2;

export interface StemEl {
  t: "stem";
  id: number;
  /** Which letter this grew from — each letter's garden sways as one. */
  letter: number;
  pts: Vec[];
  segs: Seg[];
  start: number;
  dur: number;
  w: number;
  thorns: { u: number; s: number }[];
}
export interface LeafEl {
  t: "leaf";
  id: number;
  /** Which letter this grew from — each letter's garden sways as one. */
  letter: number;
  x: number;
  y: number;
  a: number;
  L: number;
  bend: number;
  layer: 0 | 1;
  start: number;
}
export interface RoseEl {
  t: "rose";
  kind: "rose" | "sunflower";
  id: number;
  /** Which letter this grew from — each letter's garden sways as one. */
  letter: number;
  x: number;
  y: number;
  R: number;
  rot: number;
  tipA: number;
  ph1: number;
  ph2: number;
  turns: number;
  layer: 0 | 1;
  start: number;
  /** Scroll bloom (0..1) at which this bud starts to open. */
  bloomAt: number;
}
export type El = StemEl | LeafEl | RoseEl;

export interface LetterSlot {
  ch: string;
  /** Centre x and baseline y in px. */
  cx: number;
  baseline: number;
  /** Advance width in px. */
  w: number;
}

type Tip = "rose" | "fan" | "leaf" | "curl";

interface Ctx {
  r: () => number;
  letter: number;
  els: El[];
  nid: () => number;
  /** Letter width in em; personality of this name's garden. */
  w: number;
  roseP: number;
  leafy: number;
  lean: number;
  big: number;
  curvy: number;
  bloomAt: number;
}

interface GrowOpts {
  base?: Vec;
  dir?: number;
  len?: number;
  pts?: Vec[];
  d0: number;
  depth?: boolean;
  layer0?: 0 | 1;
  tip?: Tip;
}

/** Grow one stem (em units, letter-relative, d0 in ms) with leaves, a tip and maybe a side branch. */
function grow(c: Ctx, o: GrowOpts): Vec[] {
  const { r } = c;
  const tip: Tip = o.tip ?? (r() < c.roseP ? "rose" : r() < 0.45 ? "fan" : r() < 0.6 ? "leaf" : "curl");
  let pts = o.pts ?? vine(o.base!, o.dir!, o.len!, (0.35 + r() * 0.45) * c.curvy, 1 + r() * 1.6, r() * 6.28, (r() - 0.5) * 1.2);
  if (tip === "curl") pts = curl(pts, r() < 0.5 ? -1 : 1, 0.05 + r() * 0.05);
  const segs = weave(r, o.layer0 ?? (r() < 0.5 ? 0 : 1));
  const dur = Math.max(320, (o.len ?? 0.8) * 620);
  const thorns = Array.from({ length: Math.floor(r() * 2.5) }, () => ({ u: 0.15 + r() * 0.65, s: r() < 0.5 ? -1 : 1 }));
  c.els.push({ t: "stem", letter: c.letter, id: c.nid(), pts, segs, start: o.d0, dur, w: o.depth ? 0.82 : 1, thorns });

  let side = r() < 0.5 ? -1 : 1;
  const leaves = Math.floor(r() * 2.8 * c.leafy);
  for (let i = 0; i < leaves; i++) {
    const u = 0.25 + r() * 0.6;
    const [q, a] = at(pts, u);
    side = -side;
    c.els.push({
      t: "leaf", letter: c.letter, id: c.nid(), x: q[0], y: q[1], a: a + side * (0.55 + r() * 0.5),
      L: (0.14 + r() * 0.2) * (o.depth ? 0.8 : 1), bend: (r() - 0.5) * 1.2, layer: layerAt(segs, u), start: o.d0 + dur * u,
    });
  }

  const [tp, ta] = at(pts, 1);
  const td = o.d0 + dur * 0.8;
  const tl = layerAt(segs, 1);
  if (tip === "rose") {
    const R = (0.13 + r() * 0.15) * c.big * (o.depth ? 0.75 : 1);
    // Legibility: a rose that lands over the letter body mostly tucks in behind it.
    const over = tp[1] > -0.78 && tp[1] < 0.05 && Math.abs(tp[0]) < c.w * 0.5;
    const layer: 0 | 1 = over ? (r() < 0.22 ? 1 : 0) : r() < 0.6 ? 1 : tl;
    const rose = (x: number, y: number, size: number, delay: number) =>
      c.els.push({
        t: "rose", kind: "rose", letter: c.letter, id: c.nid(), x, y, R: size, rot: (r() - 0.5) * 1.0, tipA: ta, ph1: r() * 6.28, ph2: r() * 6.28,
        turns: 1.8 + r(), layer, start: delay, bloomAt: c.bloomAt + r() * 0.1,
      });
    rose(tp[0], tp[1], R, td);
    if (r() < 0.2) {
      const oo = ta + (r() < 0.5 ? 1 : -1) * 1.3;
      rose(tp[0] + Math.cos(oo) * R * 1.4, tp[1] + Math.sin(oo) * R * 1.4, R * (0.6 + r() * 0.3), td + 120);
    }
  } else if (tip === "fan") {
    const spread = 0.6 + r() * 0.3;
    for (let j = 0; j < 2; j++) {
      c.els.push({ t: "leaf", letter: c.letter, id: c.nid(), x: tp[0], y: tp[1], a: ta + (j - 0.5) * spread, L: 0.2 + r() * 0.2, bend: (j - 0.5) * 0.8, layer: tl, start: td + j * 60 });
    }
  } else if (tip === "leaf") {
    c.els.push({ t: "leaf", letter: c.letter, id: c.nid(), x: tp[0], y: tp[1], a: ta + (r() - 0.5) * 0.3, L: 0.16 + r() * 0.16, bend: r() - 0.5, layer: tl, start: td });
  }

  if (!o.depth && r() < 0.3) {
    const u = 0.35 + r() * 0.35;
    const [q, a] = at(pts, u);
    grow(c, {
      base: q, dir: a + (r() < 0.5 ? -1 : 1) * (0.7 + r() * 0.4), len: (o.len ?? 0.8) * (0.35 + r() * 0.2),
      d0: o.d0 + dur * u, depth: true, layer0: layerAt(segs, u),
    });
  }
  return pts;
}

/**
 * Open loops and arches in lowercase Playfair Display Bold: [x as a fraction of the letter width, y in em
 * above the baseline]. A vine rooted here starts behind the letter, so it threads out through the hole.
 */
const COUNTERS: Record<string, Vec> = {
  o: [0, -0.24],
  a: [-0.04, -0.13],
  b: [0.1, -0.24],
  d: [-0.1, -0.24],
  e: [0, -0.33],
  p: [0.1, -0.24],
  q: [-0.1, -0.24],
  g: [0, -0.3],
  n: [0, -0.1],
  m: [-0.2, -0.1],
  h: [0.1, -0.1],
};

/** Everything that grows out of one letter (em units, ms after the letter lands). */
function letterGarden(c: Ctx, i: number, ch: string, last: boolean, prevW: number | null) {
  const { r, w } = c;
  const inX = () => (r() - 0.5) * w * 0.7;
  const loop = COUNTERS[ch];
  const ups = 1 + (r() < 0.45 ? 1 : 0);
  for (let k = 0; k < ups; k++) {
    const threaded = loop && k === 0;
    grow(c, {
      base: threaded ? [loop[0] * w, loop[1]] : [inX(), -r() * 0.3],
      dir: -Math.PI / 2 + c.lean * 0.5 + (r() - 0.5) * (threaded ? 0.4 : 0.7),
      len: 0.5 + r() * 0.35,
      d0: 40 + k * 130,
      layer0: threaded ? 0 : undefined,
      tip: i === 0 && k === 0 ? "rose" : undefined,
    });
  }
  if (r() < 0.4) {
    grow(c, {
      base: [inX(), -0.1 - r() * 0.35], dir: Math.PI / 2 + (r() - 0.5) * 0.8, len: 0.2 + r() * 0.2, d0: 160,
      tip: r() < 0.5 ? "curl" : "leaf",
    });
  }
  if (prevW != null && r() < 0.7) {
    // A runner that arches back to the previous letter.
    const px = -(prevW + w) / 2;
    const a: Vec = [inX(), -0.05 - r() * 0.55];
    const b: Vec = [px + (r() - 0.5) * 0.25, -0.05 - r() * 0.55];
    const bulge = (r() < 0.55 ? -1 : 1) * (0.3 + r() * 0.3);
    const dx = b[0] - a[0];
    let pts = cubic(a, [a[0] + dx * 0.15, a[1] + bulge], [b[0] - dx * 0.15, b[1] + bulge * 0.9], b, 40);
    if (r() < 0.45) pts = pts.slice(0, Math.floor(pts.length * (0.7 + r() * 0.2)));
    grow(c, { pts, len: Math.abs(dx) + Math.abs(bulge), d0: 90, tip: r() < 0.5 ? "curl" : r() < 0.5 ? "leaf" : "rose" });
  }
  if (i === 0) grow(c, { base: [-w * 0.3, -0.15 - r() * 0.4], dir: Math.PI + (r() - 0.5) * 1.2, len: 0.3 + r() * 0.2, d0: 120, tip: "curl" });
  if (last) {
    // The end of the word gets a little bouquet leaning out to the right.
    const n = 1 + Math.floor(r() * 2.5);
    for (let k = 0; k < n; k++) {
      const dir = -Math.PI / 2 + 0.6 + (k - (n - 1) / 2) * 0.9 + (r() - 0.5) * 0.4;
      grow(c, { base: [(r() - 0.2) * w * 0.6, -r() * 0.5], dir, len: 0.3 + r() * 0.3, d0: 500 + k * 90, depth: true, tip: k === 0 || r() < 0.5 ? "rose" : "fan" });
    }
  }
}

/** Build the whole garden in canvas px / seconds from measured letter slots. */
export function buildGarden(letters: LetterSlot[], S: number, seed: number): El[] {
  const wr = rng(seed * 7 + 13);
  const params = { roseP: 0.3 + wr() * 0.3, leafy: 0.6 + wr() * 0.8, lean: (wr() - 0.5) * 0.6, big: 0.85 + wr() * 0.45, curvy: 0.8 + wr() * 0.6 };
  const all: El[] = [];

  letters.forEach((slot, i) => {
    const local: El[] = [];
    let k = 0;
    const c: Ctx = {
      ...params,
      r: rng(seed * 131 + i * 977 + 1),
      letter: i,
      els: local,
      nid: () => i * 1000 + k++,
      w: slot.w / S,
      bloomAt: (i / Math.max(1, letters.length)) * 0.45,
    };
    letterGarden(c, i, slot.ch.toLowerCase(), i === letters.length - 1, i > 0 ? letters[i - 1].w / S : null);

    // Letter-relative em → canvas px; ms after landing → seconds on the page clock.
    const birth = letterBirth(i);
    const X = (x: number) => slot.cx + x * S;
    const Y = (y: number) => slot.baseline + y * S;
    const T = (ms: number) => birth + (ms * SLOW) / 1000;
    for (const e of local) {
      if (e.t === "stem") all.push({ ...e, pts: e.pts.map(([x, y]) => [X(x), Y(y)] as Vec), start: T(e.start), dur: (e.dur * SLOW) / 1000 });
      else if (e.t === "leaf") all.push({ ...e, x: X(e.x), y: Y(e.y), L: e.L * S, start: T(e.start) });
      else all.push({ ...e, x: X(e.x), y: Y(e.y), R: e.R * S, start: T(e.start) });
    }
  });

  // Legibility: any rose that lands on a letter (its own or a neighbour's) goes behind the type,
  // and nothing blooms low enough to sit on the copy under the name.
  const onLetter = (x: number, y: number, R: number) =>
    letters.some((l) => Math.abs(x - l.cx) < l.w * 0.5 + R * 0.5 && y > l.baseline - S * 0.8 - R * 0.3 && y < l.baseline + S * 0.25);
  const garden = all
    .filter((e) => e.t !== "rose" || e.y < letters[0].baseline + S * 0.2)
    .map((e) => (e.t === "rose" && onLetter(e.x, e.y, e.R) ? { ...e, layer: 0 as const } : e));
  return withSunflowers(garden, letters, S);
}

/**
 * Swap up to two roses for sunflowers: ones that sit clear above the letters, roughly a third and
 * three quarters of the way along the name, so they read as accents rather than a cluster.
 */
function withSunflowers(els: El[], letters: LetterSlot[], S: number): El[] {
  const first = letters[0];
  const last = letters[letters.length - 1];
  if (!first || !last) return els;
  const left = first.cx - first.w / 2;
  const span = last.cx + last.w / 2 - left;
  const candidates = els.filter((e): e is RoseEl => e.t === "rose" && e.y < first.baseline - S * 0.6 && e.R > S * 0.1);
  const chosen: RoseEl[] = [];
  for (const target of [0.3, 0.75]) {
    const x = left + span * target;
    const pick = candidates
      .filter((c) => !chosen.includes(c) && chosen.every((o) => Math.abs(o.x - c.x) > S * 1.5))
      .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0];
    if (pick) chosen.push(pick);
  }
  return els.map((e) => (chosen.includes(e as RoseEl) ? { ...(e as RoseEl), kind: "sunflower" as const, R: (e as RoseEl).R * 1.15, layer: 1 as const } : e));
}
