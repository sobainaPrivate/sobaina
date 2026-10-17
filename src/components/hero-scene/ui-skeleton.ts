import * as THREE from "three";

/** [x0, y0, x1, y1] in normalized screen space: -0.5..0.5, +y is the top of the phone. */
type Rect = readonly [number, number, number, number];

const header: Rect = [-0.42, 0.4, 0.42, 0.44];

function listRows(): Rect[] {
  return [0, 1, 2].flatMap((i): Rect[] => {
    const y = -0.02 - i * 0.11;
    return [
      [-0.42, y - 0.07, -0.3, y],
      [-0.25, y - 0.025, 0.3, y - 0.005],
      [-0.25, y - 0.065, 0.1, y - 0.045],
    ];
  });
}

function bars(): Rect[] {
  const heights = [0.08, 0.14, 0.1, 0.18, 0.12, 0.2];
  return heights.map((h, i): Rect => {
    const x = -0.4 + i * 0.14;
    return [x, -0.42, x + 0.09, -0.42 + h];
  });
}

// Three simple app layouts so each screen in the stack reads as a different view.
const layouts: Rect[][] = [
  // List / feed
  [header, [-0.42, 0.1, 0.42, 0.35], ...listRows(), [-0.42, -0.44, 0.42, -0.37]],
  // Dashboard
  [
    header,
    [-0.42, 0.12, -0.02, 0.35],
    [0.02, 0.12, 0.42, 0.35],
    [-0.42, -0.16, -0.02, 0.07],
    [0.02, -0.16, 0.42, 0.07],
    ...bars(),
  ],
  // Profile / form
  [
    header,
    [-0.1, 0.22, 0.1, 0.32],
    [-0.25, 0.15, 0.25, 0.18],
    [-0.42, -0.02, 0.42, 0.06],
    [-0.42, -0.14, 0.42, -0.06],
    [-0.42, -0.26, 0.42, -0.18],
    [-0.42, -0.44, 0.42, -0.36],
  ],
];

/** Line-segment geometry of UI blocks, laid out on a w × h screen at height z. */
export function buildSkeleton(variant: number, w: number, h: number, z: number) {
  const points: number[] = [];
  for (const [x0, y0, x1, y1] of layouts[variant % layouts.length]) {
    const corners = [
      [x0 * w, y0 * h],
      [x1 * w, y0 * h],
      [x1 * w, y1 * h],
      [x0 * w, y1 * h],
    ];
    for (let i = 0; i < 4; i++) {
      const [ax, ay] = corners[i];
      const [bx, by] = corners[(i + 1) % 4];
      points.push(ax, ay, z, bx, by, z);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}
