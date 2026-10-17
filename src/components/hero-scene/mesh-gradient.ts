import * as THREE from "three";

// Colors are passed as raw sRGB vectors (not THREE.Color) so the shader
// output matches the hex values exactly, without color-management conversion.
function rgb(hex: string) {
  const c = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255);
}

const fullscreenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// For flat ShapeGeometry: derive 0..1 UVs from the shape's local position.
const surfaceVertex = /* glsl */ `
  uniform vec2 uSize;
  varying vec2 vUv;
  void main() {
    vUv = position.xy / uSize + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uRadius;
  uniform float uIntensity;
  uniform float uOpacity;
  uniform float uAspect;
  uniform vec3 uBase;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float blob(vec2 p, vec2 c, float r) {
    float d = distance(p, c);
    return exp(-(d * d) / (r * r));
  }

  void main() {
    float t = uTime * 0.12 + uSeed;
    vec2 p = vUv;
    p.x *= uAspect;
    p += (vec2(noise(p * 1.6 + t), noise(p * 1.6 - t + 7.3)) - 0.5) * 0.35;

    vec2 a = vec2((0.20 + 0.12 * sin(t * 1.3)) * uAspect, 0.25 + 0.12 * cos(t * 1.1));
    vec2 b = vec2((0.78 + 0.10 * cos(t * 0.9)) * uAspect, 0.60 + 0.15 * sin(t * 1.2));
    vec2 c = vec2((0.50 + 0.20 * sin(t * 0.7 + 2.0)) * uAspect, 0.95 + 0.08 * cos(t * 1.4));

    vec3 col = uBase;
    col = mix(col, uC1, blob(p, a, uRadius));
    col = mix(col, uC2, blob(p, b, uRadius * 1.1));
    col = mix(col, uC3, blob(p, c, uRadius * 0.8));
    col = mix(uBase, col, uIntensity);

    // Film grain to hide banding in the soft gradients.
    col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.035;
    gl_FragColor = vec4(col, uOpacity);
  }
`;

interface MeshGradientOptions {
  /** "fullscreen" fills the viewport; "surface" maps onto a flat shape of `size`. */
  mode: "fullscreen" | "surface";
  base: string;
  colors: readonly [string, string, string];
  seed: number;
  radius: number;
  intensity: number;
  opacity?: number;
  size?: readonly [number, number];
}

export function createMeshGradientMaterial(opts: MeshGradientOptions) {
  const [w, h] = opts.size ?? [1, 1];
  const fullscreen = opts.mode === "fullscreen";

  return new THREE.ShaderMaterial({
    vertexShader: fullscreen ? fullscreenVertex : surfaceVertex,
    fragmentShader: fragment,
    transparent: true,
    depthTest: !fullscreen,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSeed: { value: opts.seed },
      uRadius: { value: opts.radius },
      uIntensity: { value: opts.intensity },
      uOpacity: { value: opts.opacity ?? 1 },
      uAspect: { value: w / h },
      uSize: { value: new THREE.Vector2(w, h) },
      uBase: { value: rgb(opts.base) },
      uC1: { value: rgb(opts.colors[0]) },
      uC2: { value: rgb(opts.colors[1]) },
      uC3: { value: rgb(opts.colors[2]) },
    },
  });
}
