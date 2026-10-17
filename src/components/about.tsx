import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Cat from "@/components/cat";

function AnimatedCounter({ end, duration = 1.5, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        
        // ease out quad
        const easeProgress = progress * (2 - progress);
        setCount(Math.floor(easeProgress * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}{count === end ? suffix : ""}
    </span>
  );
}

const stats = [
  { label: "Live websites", value: 3 },
  { label: "Projects", value: 7 },
];

const tools = [
  { group: "Design", items: ["Figma", "Canva", "Wireframing", "Prototyping", "Usability testing"] },
  { group: "Build", items: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind", "Jekyll", "Vercel"] },
];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, delay },
});

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-zinc-950 py-32">
      <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-6 md:px-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.p {...rise()} className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/45">
            About
          </motion.p>
          <motion.h2 {...rise(0.05)} className="mt-4 max-w-xl font-display text-4xl leading-[1.1] text-white md:text-5xl">
            Always wondering <em className="text-primary">why</em> things are designed the way they are.
          </motion.h2>

          <motion.div {...rise(0.1)} className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-white/65">
            <p>
              An HCI course got me hooked on the psychology behind everyday design, from a teacup to a switchboard. A
              UI/UX internship at a software house turned that into craft.
            </p>
            <p>
              Now I design and build for real people, and I graduate soon, open to work remote or anywhere.
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
              Off-screen: cats. That's why there's one <span className="hidden lg:inline">on the right</span>
              <span className="lg:hidden">below</span> 🐾
            </p>
          </motion.div>

          <motion.div {...rise(0.15)} className="mt-10 flex gap-12 border-t border-white/10 pt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-5xl text-white">
                  <AnimatedCounter end={stat.value} />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div {...rise(0.2)} className="mt-10 space-y-4">
            {tools.map((row) => (
              <div key={row.group} className="flex flex-wrap items-center gap-2">
                <span className="mr-2 w-14 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{row.group}</span>
                {row.items.map((tool) => (
                  <span key={tool} className="rounded-full border border-white/12 px-3 py-1 text-sm text-white/70">
                    {tool}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div {...rise(0.2)} className="flex justify-center lg:col-span-5">
          <div className="relative pt-12">
            <Cat className="h-56 w-[244px]" />
            {/* The ledge it sits on. */}
            <div className="mx-auto -mt-1 h-px w-72 bg-white/15" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
