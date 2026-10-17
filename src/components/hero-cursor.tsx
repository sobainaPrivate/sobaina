import { AnimatePresence, motion } from "framer-motion";

/**
 * A Figma-style multiplayer cursor that wanders beside the phone stack — Sobaina "designing" the
 * wireframes, then "shipping" once they render as her live sites. Desktop only, so it never crowds mobile.
 */
export default function HeroCursor({ rendered }: { rendered: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-[56%] top-[28%] z-10 hidden lg:block"
      animate={{ x: [0, 46, 18, -14, 0], y: [0, 24, 70, 34, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="18" height="21" viewBox="0 0 18 21" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
        <path d="M2 2v15l4-4 3 6.5 2.6-1.1-2.8-6.4H14.5Z" fill="#FF1E27" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
      <div className="ml-4 -mt-1 overflow-hidden rounded-full bg-[#FF1E27] px-2.5 py-1 font-mono text-[11px] leading-none text-white shadow-lg">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={rendered ? "ship" : "design"}
            className="block whitespace-nowrap"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            sobaina · {rendered ? "shipping" : "designing"}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
