import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

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
  { label: "Years Experience", value: 6, suffix: "" },
  { label: "Projects", value: 40, suffix: "+" },
  { label: "Happy Clients", value: 12, suffix: "" },
];

export default function About() {
  const row1 = "FIGMA · PRINCIPLE · FRAMER · ADOBE XD · PROTOTYPING · DESIGN SYSTEMS · ";
  const row2 = "REACT · TYPESCRIPT · TAILWIND · FRAMER MOTION · FASTAPI · FIREBASE · POSTGRESQL · ";

  return (
    <section id="about" className="py-32 relative bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Bio Side */}
          <div className="relative">
            <span className="absolute -top-16 -left-8 text-[120px] text-primary/10 font-serif leading-none select-none pointer-events-none">
              "
            </span>
            <div className="relative z-10 space-y-8 text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                I'm Sobaina, a designer-developer hybrid based in Lahore. I've spent the last few years crafting digital experiences at the intersection of human psychology and systems thinking.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                I don't just hand off Figma files. I believe the best products are built by those who understand both the creative intent and the technical constraints. I write production-ready code to ensure the final product feels exactly how it was designed to feel.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="italic"
              >
                Currently open to senior roles and select freelance projects.
              </motion.p>
            </div>
            
            <div className="mt-16 flex gap-12 md:gap-16 border-t border-white/10 pt-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-5xl font-bold text-white font-sans">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium max-w-[100px] leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Side */}
          <div className="flex flex-col justify-center h-full pt-16 lg:pt-0">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mb-12 lg:mb-16">Capabilities & Tools</h3>
            
            <div className="flex flex-col gap-4 w-[150vw] md:w-auto -ml-6 md:ml-0 overflow-hidden">
              <div className="flex w-max marquee-content">
                <div className="text-sm md:text-base text-white/50 py-4 border-y border-white/5 tracking-[0.3em] uppercase font-medium whitespace-nowrap px-4">
                  {row1}
                </div>
                <div className="text-sm md:text-base text-white/50 py-4 border-y border-white/5 tracking-[0.3em] uppercase font-medium whitespace-nowrap px-4">
                  {row1}
                </div>
              </div>
              
              <div className="flex w-max marquee-content-reverse">
                <div className="text-sm md:text-base text-white/50 py-4 border-b border-white/5 tracking-[0.3em] uppercase font-medium whitespace-nowrap px-4">
                  {row2}
                </div>
                <div className="text-sm md:text-base text-white/50 py-4 border-b border-white/5 tracking-[0.3em] uppercase font-medium whitespace-nowrap px-4">
                  {row2}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}