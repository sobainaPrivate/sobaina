import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import BloomingName from "@/components/bloom/blooming-name";
import HeroCursor from "@/components/hero-cursor";

// three.js is split into its own chunk so the copy paints before the 3D loads.
const HeroScene = lazy(() => import("@/components/hero-scene/scene"));

const AUTO_TOGGLE_MS = 3800;

function ModeToggle({ rendered, onChange }: { rendered: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-md font-mono text-[11px] uppercase tracking-[0.18em]">
      {[
        { label: "Wireframe", value: false },
        { label: "Render", value: true },
      ].map((opt) => {
        const active = rendered === opt.value;
        return (
          <button
            key={opt.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`relative rounded-full px-4 py-2 transition-colors duration-300 ${
              active ? "text-black" : "text-white/55 hover:text-white"
            }`}
          >
            {active && (
              <motion.span
                layoutId="hero-mode"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Hero() {
  const [rendered, setRendered] = useState(false);
  const [auto, setAuto] = useState(true);

  // Demo the transition on its own until the visitor takes over.
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setRendered((r) => !r), AUTO_TOGGLE_MS);
    return () => clearInterval(id);
  }, [auto]);

  const choose = (value: boolean) => {
    setAuto(false);
    setRendered(value);
  };

  // The hero is pinned for one extra screen of scroll; that scroll opens the buds.
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const bloom = useSpring(useTransform(scrollYProgress, [0, 0.85], [0, 1]), { stiffness: 90, damping: 24 });
  const hintOpacity = useTransform(bloom, [0, 0.15], [1, 0]);

  return (
    <section ref={section} className="relative h-[200vh] w-full bg-black">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_55%,rgba(50,87,255,0.18),transparent),radial-gradient(40%_40%_at_15%_80%,rgba(255,20,0,0.14),transparent)]" />
        <Suspense fallback={null}>
          <HeroScene rendered={rendered} />
        </Suspense>
        <HeroCursor rendered={rendered} />

        <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-6 pb-24 pt-32 md:px-12 lg:justify-center lg:pb-32">
          <div className="max-w-xl">
            <BloomingName
              text="sobaina"
              bloom={bloom}
              suffix={<span className="text-primary">.</span>}
              className="font-display text-[clamp(3.5rem,10vw,7.5rem)] font-bold lowercase leading-[0.9] tracking-[-0.02em] text-white"
            />

            <motion.p {...rise(0.3)} className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
              UI/UX Designer <span className="text-primary">/</span> Frontend Developer
            </motion.p>

            <motion.p {...rise(0.35)} className="mt-4 max-w-md text-base leading-relaxed text-white/70 md:mt-8 md:text-xl">
              I design interfaces, then I build them. From the first wireframe to the rendered,
              shipped product, in one pair of hands.
            </motion.p>

            <motion.div {...rise(0.5)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ModeToggle rendered={rendered} onChange={choose} />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
                {auto ? "Try it" : rendered ? "Surface" : "Structure"}
              </span>
            </motion.div>

            <motion.div {...rise(0.65)} className="mt-12 flex flex-wrap gap-4">
              <a
                href="#work"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#ff3a26]"
              >
                See the work
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm font-semibold text-white transition-colors hover:border-white/50"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-between px-6 pb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 md:px-12">
          <span>Lahore, PK</span>
          <motion.span style={{ opacity: hintOpacity }} className="hidden sm:inline">
            Scroll — let it bloom
          </motion.span>
          <span>{rendered ? "fig. 02 — render · my live sites" : "fig. 01 — wireframe"}</span>
        </div>
      </div>
    </section>
  );
}
