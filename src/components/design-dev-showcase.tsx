import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "design" | "dev";

const codeLines = [
  { indent: 0, text: "export function LeadCard({ lead }: Props) {" },
  { indent: 1, text: "return (" },
  { indent: 2, text: '<div className="rounded-xl bg-surface p-4">' },
  { indent: 3, text: "<Avatar src={lead.photo} />" },
  { indent: 3, text: "<h3>{lead.name}</h3>" },
  { indent: 3, text: '<Badge tone="teal">{lead.status}</Badge>' },
  { indent: 2, text: "</div>" },
  { indent: 1, text: ");" },
  { indent: 0, text: "}" },
];

const annotations = [
  { top: "18%", left: "12%", width: "34%", height: "16%", note: "Increase padding to 24px" },
  { top: "42%", left: "55%", width: "30%", height: "12%", note: "Use brand teal for status" },
  { top: "68%", left: "18%", width: "40%", height: "14%", note: "Avatar needs a fallback state" },
];

function TypedLine({ text, indent, delay }: { text: string; indent: number; delay: number }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 14);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay]);

  return (
    <div style={{ paddingLeft: `${indent * 1.25}rem` }} className="whitespace-pre">
      <span className="text-teal">{shown}</span>
      <motion.span
        className="inline-block w-[2px] h-4 bg-teal/70 ml-0.5 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
    </div>
  );
}

export default function DesignDevShowcase() {
  const [mode, setMode] = useState<Mode>("design");

  return (
    <section className="relative w-full py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
              How I actually work
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Same screen, two brains
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {(["design", "dev"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors duration-300 ${
                  mode === m ? "text-black" : "text-white/50 hover:text-white/80"
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="mode-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{m === "design" ? "Design" : "Dev"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-[#0d0d0f] overflow-hidden aspect-[16/10]">
          <AnimatePresence mode="wait">
            {mode === "design" ? (
              <motion.div
                key="design"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 p-6"
              >
                {/* mock UI screen — swap this block for a real screenshot <img> if you have one */}
                <div className="w-full h-full rounded-lg bg-[#141418] p-6 relative overflow-hidden">
                  <div className="h-3 w-24 rounded-full bg-white/10 mb-4" />
                  <div className="h-2 w-40 rounded-full bg-white/5 mb-8" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 rounded-lg bg-teal/10 border border-teal/20" />
                    <div className="h-20 rounded-lg bg-gold/10 border border-gold/20" />
                  </div>

                  {annotations.map((a, i) => (
                    <div key={i}>
                      <motion.svg
                        className="absolute pointer-events-none"
                        style={{ top: a.top, left: a.left, width: a.width, height: a.height }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <motion.rect
                          x="1" y="1" width="98" height="98"
                          rx="4"
                          fill="none"
                          stroke="#1D9E75"
                          strokeWidth="1.5"
                          strokeDasharray="6 4"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.15 * i, ease: "easeInOut" }}
                        />
                      </motion.svg>
                      <motion.div
                        className="absolute z-10 flex items-center gap-2 bg-white text-black text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg"
                        style={{ top: `calc(${a.top} - 1.75rem)`, left: a.left }}
                        initial={{ opacity: 0, y: 8, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.4 + 0.15 * i }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                        {a.note}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dev"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 p-6 font-mono text-[13px] leading-relaxed"
              >
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="text-white/30 text-[11px] ml-3">LeadCard.tsx</span>
                </div>
                {codeLines.map((line, i) => (
                  <TypedLine key={i} text={line.text} indent={line.indent} delay={i * 90} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}