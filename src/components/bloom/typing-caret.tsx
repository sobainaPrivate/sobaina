import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { letterBirth } from "./garden";

/** How many characters have been "typed" so far, on the shared keystroke schedule. */
export function useTyping(chars: number, instant: boolean) {
  const [typed, setTyped] = useState(instant ? chars : 0);
  useEffect(() => {
    if (instant) {
      setTyped(chars);
      return;
    }
    const timers = Array.from({ length: chars }, (_, i) => window.setTimeout(() => setTyped(i + 1), letterBirth(i) * 1000));
    return () => timers.forEach(clearTimeout);
  }, [chars, instant]);
  return typed;
}

interface TypingCaretProps {
  /** The heading whose `[data-type]` characters are being typed. */
  host: RefObject<HTMLElement | null>;
  typed: number;
}

/**
 * A text-input caret that sits right after the last typed character. It's re-keyed on every
 * keystroke so the blink restarts: solid while typing, blinking once typing stops.
 */
export default function TypingCaret({ host, typed }: TypingCaretProps) {
  const [left, setLeft] = useState<number | null>(null);

  // Measured from the live letters (not cached), so it stays right after web fonts swap in or on resize.
  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const place = () => {
      const spans = el.querySelectorAll<HTMLElement>("[data-type]");
      if (!spans.length) return;
      const base = el.getBoundingClientRect().left;
      setLeft(typed === 0 ? spans[0].getBoundingClientRect().left - base : spans[Math.min(typed, spans.length) - 1].getBoundingClientRect().right - base);
    };
    place();
    document.fonts.ready.then(place);
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => ro.disconnect();
  }, [host, typed]);

  if (left == null) return null;
  return <span key={typed} aria-hidden className="bloom-caret" style={{ left: `calc(${left}px + 0.03em)` }} />;
}
