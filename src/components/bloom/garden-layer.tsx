import { memo, useRef } from "react";
import { useAnimationFrame, type MotionValue } from "framer-motion";
import type { El, LetterSlot } from "./garden";
import { Leaf, Rose, StemRuns, Sunflower } from "./flowers";

interface GardenLayerProps {
  els: El[];
  letters: LetterSlot[];
  layer: 0 | 1;
  S: number;
  width: number;
  height: number;
  offset: { x: number; y: number };
  bloom: MotionValue<number>;
  /** Extra sway in degrees, driven by scroll speed. */
  wind: MotionValue<number>;
  instant: boolean;
  className: string;
}

/**
 * One SVG plane of the garden — 0 sits behind the letters, 1 in front — so stems that switch planes
 * look woven through the type. Each letter's garden is its own group, swaying about the letter's base.
 */
function GardenLayer({ els, letters, layer, S, width, height, offset, bloom, wind, instant, className }: GardenLayerProps) {
  const groups = useRef<(SVGGElement | null)[]>([]);

  useAnimationFrame((t) => {
    if (instant) return;
    const gust = wind.get();
    letters.forEach((l, i) => {
      const angle = Math.sin((t / 1000) * 1.1 + i * 0.8) * 1.1 + gust;
      groups.current[i]?.setAttribute("transform", `rotate(${angle.toFixed(3)} ${l.cx} ${l.baseline})`);
    });
  });

  return (
    <svg
      aria-hidden
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`pointer-events-none absolute overflow-visible ${className}`}
      style={{ left: -offset.x, top: -offset.y }}
    >
      {letters.map((_, i) => (
        <g key={i} ref={(g) => void (groups.current[i] = g)}>
          {els.map((e) => {
            if (e.letter !== i) return null;
            if (e.t === "stem") return <StemRuns key={e.id} e={e} layer={layer} S={S} instant={instant} />;
            if (e.layer !== layer) return null;
            if (e.t === "leaf") return <Leaf key={e.id} e={e} instant={instant} />;
            const Head = e.kind === "sunflower" ? Sunflower : Rose;
            return <Head key={e.id} e={e} bloom={bloom} instant={instant} />;
          })}
        </g>
      ))}
    </svg>
  );
}

// Memoised so keystrokes (which re-render the heading) don't re-render the whole garden.
export default memo(GardenLayer);
