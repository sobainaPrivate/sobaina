import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import { useCoins } from "@/context/coin-context";
import { badges } from "@/data/badges";

const EYE = "#FFD23F";
const STROKE = "rgba(255,255,255,0.85)";

/**
 * A black line-art cat (Sobaina loves cats) sitting beside the About text. Its eyes follow the cursor, the tail swishes
 * and it blinks; click for a "mrrp". Find every treat on the page and it closes its eyes, happy.
 */
export default function Cat({ className = "h-28 w-[122px]" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { earnedIds } = useCoins();
  const found = badges.filter((b) => earnedIds.includes(b.id)).length;
  const content = found === badges.length;
  const [meow, setMeow] = useState(false);
  const [hover, setHover] = useState(false);
  const px = useSpring(0, { stiffness: 120, damping: 14 });
  const py = useSpring(0, { stiffness: 120, damping: 14 });

  // Pupils look toward the pointer, a couple of units at most.
  useEffect(() => {
    const look = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.38);
      const d = Math.hypot(dx, dy) || 1;
      px.set((dx / d) * 1.8);
      py.set((dy / d) * 1.8);
    };
    window.addEventListener("pointermove", look);
    return () => window.removeEventListener("pointermove", look);
  }, [px, py]);

  const purr = () => {
    setMeow(true);
    setTimeout(() => setMeow(false), 1400);
  };
  const happy = content || meow;
  const bubble = meow ? "mrrp!" : content ? "all treats found. purr." : `explore to find treats 🐾 ${found}/${badges.length}`;

  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <AnimatePresence>
        {(hover || meow || content) && (
          <motion.span
            key={bubble}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full right-0 mb-1 whitespace-nowrap rounded-full bg-white px-3 py-1 font-mono text-[11px] text-black"
          >
            {bubble}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.svg
        ref={ref}
        viewBox="0 0 120 110"
        className={`cursor-pointer overflow-visible ${className}`}
        onClick={purr}
        role="img"
        aria-label="A small black cat"
        whileHover={{ y: -2 }}
      >
        <motion.path
          d="M86 102 C106 100 112 80 103 66"
          fill="none"
          stroke="#0A3BFF"
          strokeWidth={6}
          strokeLinecap="round"
          style={{ originX: "86px", originY: "102px" }}
          animate={reduced ? undefined : { rotate: happy ? [0, 14, 0] : [-6, 10, -6] }}
          transition={{ duration: happy ? 0.9 : 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <path d="M30 105 C26 80 36 58 60 56 C84 58 94 80 90 105 Z" fill="#0b0b0b" stroke={STROKE} strokeWidth={1.6} />
        <path d="M40 34 L42 11 L57 25 Z M80 34 L78 11 L63 25 Z" fill="#0b0b0b" stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M44 28 L45 17 L52 24 Z M76 28 L75 17 L68 24 Z" fill="#FF1E27" />
        <ellipse cx="60" cy="42" rx="25" ry="20" fill="#0b0b0b" stroke={STROKE} strokeWidth={1.6} />

        {happy ? (
          <path d="M46 43 Q51 38 56 43 M64 43 Q69 38 74 43" fill="none" stroke={EYE} strokeWidth={2.2} strokeLinecap="round" />
        ) : (
          <motion.g
            style={{ originY: "42px" }}
            animate={reduced ? undefined : { scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 4.2, times: [0, 0.92, 0.96, 1], repeat: Infinity }}
          >
            <ellipse cx="51" cy="42" rx="4.6" ry="5.2" fill={EYE} />
            <ellipse cx="69" cy="42" rx="4.6" ry="5.2" fill={EYE} />
            <motion.g style={{ x: px, y: py }}>
              <ellipse cx="51" cy="42" rx="1.6" ry="3.8" fill="#000" />
              <ellipse cx="69" cy="42" rx="1.6" ry="3.8" fill="#000" />
            </motion.g>
          </motion.g>
        )}

        <path d="M58 48.5 L62 48.5 L60 51 Z" fill="#FF1E27" />
        <path d="M56.5 52.5 Q60 55 60 51.5 Q60 55 63.5 52.5" fill="none" stroke={STROKE} strokeWidth={1.1} strokeLinecap="round" />
        <path d="M44 49 L33 47 M44 52 L33 54 M76 49 L87 47 M76 52 L87 54" stroke="rgba(255,255,255,0.45)" strokeWidth={0.9} strokeLinecap="round" />
        <ellipse cx="51" cy="104" rx="6" ry="3.6" fill="#0b0b0b" stroke={STROKE} strokeWidth={1.4} />
        <ellipse cx="69" cy="104" rx="6" ry="3.6" fill="#0b0b0b" stroke={STROKE} strokeWidth={1.4} />

        <AnimatePresence>
          {content && !reduced && (
            <motion.path
              d="M60 18 C57 14 52 16 54 20 L60 25 L66 20 C68 16 63 14 60 18 Z"
              fill="#FF1E27"
              initial={{ opacity: 0, y: 6, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: [6, -10, -22], scale: 1 }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2 }}
            />
          )}
        </AnimatePresence>
      </motion.svg>
    </div>
  );
}
