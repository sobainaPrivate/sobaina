import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "framer-motion";
import { buildGarden, FIRST_LETTER, type El, type LetterSlot } from "./garden";
import GardenLayer from "./garden-layer";
import TypingCaret, { useTyping } from "./typing-caret";

interface Garden {
  els: El[];
  letters: LetterSlot[];
  S: number;
  width: number;
  height: number;
  offset: { x: number; y: number };
}

/** Measure each letter (centre, baseline, width) and the room the garden needs around the heading. */
function measure(el: HTMLElement, seed: number, elapsed: number): Garden {
  const base = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const S = parseFloat(style.fontSize);
  const offset = { x: Math.round(S * 1.1), y: Math.round(S * 1.7) };
  const width = Math.ceil(base.width + offset.x * 2);
  const height = Math.ceil(base.height + offset.y + S);

  const probe = document.createElement("canvas").getContext("2d");
  if (probe) probe.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const letters: LetterSlot[] = [];
  el.querySelectorAll<HTMLElement>("[data-bloom]").forEach((span) => {
    const r = span.getBoundingClientRect();
    const ch = span.textContent ?? "";
    // Inline boxes span the font's ascent + descent, so the baseline sits `ascent` below their top.
    const ascent = probe?.measureText(ch).fontBoundingBoxAscent ?? S * 0.8;
    letters.push({ ch, cx: r.left - base.left + offset.x + r.width / 2, baseline: r.top - base.top + offset.y + ascent, w: r.width });
  });

  // Delays are relative to when the SVG mounts; line them up with the letters already animating in.
  const els = buildGarden(letters, S, seed).map((e) => ({ ...e, start: Math.max(0, e.start - elapsed) }));
  return { els, letters, S, width, height, offset };
}

interface BloomingNameProps {
  text: string;
  /** 0 = closed buds, 1 = full bloom. */
  bloom: MotionValue<number>;
  className?: string;
  suffix?: ReactNode;
}

export default function BloomingName({ text, bloom, className, suffix }: BloomingNameProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(performance.now());
  const [seed, setSeed] = useState(7);
  const [garden, setGarden] = useState<Garden | null>(null);
  const instant = useReducedMotion() ?? false;
  // One typing state drives both the letters and the caret, so they never drift apart.
  const typed = useTyping(text.length + 1, instant);

  // Scrolling blows a little wind through the garden.
  const { scrollY } = useScroll();
  const speed = useSpring(useVelocity(scrollY), { stiffness: 60, damping: 20 });
  const wind = useTransform(speed, (v) => Math.max(-5, Math.min(5, v * 0.004)));

  useEffect(() => {
    const el = heading.current;
    if (!el) return;
    let cancelled = false;
    const build = () =>
      document.fonts.ready.then(() => {
        if (!cancelled) setGarden(measure(el, seed, (performance.now() - mounted.current) / 1000));
      });
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [text, seed]);

  const regrow = () => {
    // Letters are already on screen, so the new garden starts growing straight away.
    mounted.current = performance.now() - FIRST_LETTER * 1000;
    setSeed((s) => s + 1);
  };

  const layer = (n: 0 | 1, className: string) =>
    garden && (
      <GardenLayer
        key={`${seed}-${n}`}
        {...garden}
        layer={n}
        bloom={bloom}
        wind={wind}
        instant={instant}
        className={className}
      />
    );

  return (
    <h1
      ref={heading}
      aria-label={text}
      title="Click to grow a new garden"
      onClick={regrow}
      className={`relative isolate cursor-pointer select-none ${className ?? ""}`}
    >
      {layer(0, "-z-10")}
      <span aria-hidden>
        {[...text].map((ch, i) => (
          <span key={i} data-bloom data-type style={{ opacity: typed > i ? 1 : 0 }}>
            {ch}
          </span>
        ))}
        <span data-type style={{ opacity: typed > text.length ? 1 : 0 }}>
          {suffix}
        </span>
      </span>
      {layer(1, "z-10")}
      <TypingCaret host={heading} typed={typed} />
    </h1>
  );
}
