import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { WorkProject } from "@/data/work";
import SequenceViewer from "./sequence-viewer";
import BrowserViewer from "./browser-viewer";

/** Scroll distance given to each frame, in viewport heights. */
const VH_PER_FRAME = 70;

const pad = (n: number) => String(n).padStart(2, "0");

interface ProjectSequenceProps {
  project: WorkProject;
  index: number;
  total: number;
}

/**
 * One project, pinned while scrolling plays it through: app and poster work flips frame by frame;
 * a live website scrolls top to bottom inside a browser window.
 */
export default function ProjectSequence({ project, index, total }: ProjectSequenceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const live = project.frameStyle === "browser" && project.site;
  const n = project.frames.length;
  // Longer pages get more scroll; image sequences get one step per frame.
  const steps = live ? Math.max(3, Math.round((project.site?.pageRatio ?? 2) * 1.2)) : n;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Hold the start and end for a beat.
  const progress = useTransform(scrollYProgress, (p) => Math.min(1, Math.max(0, (p - 0.08) / 0.84)));
  const frame = useTransform(progress, (p) => p * (n - 1));
  const fill = useTransform(progress, (p) => `${p * 100}%`);
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(frame, "change", (v) => setCurrent(Math.round(v)));

  return (
    <div ref={ref} className="relative" style={{ height: `${steps * VH_PER_FRAME + 60}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(45% 55% at 68% 52%, ${project.glow}40, transparent 70%)` }}
        />

        <div className="container relative mx-auto grid h-full grid-rows-[auto_1fr] items-center gap-6 px-6 pb-8 pt-24 md:px-12 lg:grid-cols-12 lg:grid-rows-1 lg:gap-12 lg:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              {pad(index + 1)} / {pad(total)} <span className="text-primary">—</span> {project.kind}
            </p>
            <h3 className="mt-3 font-display text-5xl leading-none text-white md:text-7xl">{project.title}</h3>
            <p className="mt-4 line-clamp-3 max-w-md text-sm leading-relaxed text-white/65 md:text-base lg:mt-6 lg:line-clamp-none">
              {project.summary}
            </p>
            <p className="mt-4 hidden font-mono text-[11px] uppercase tracking-[0.18em] text-white/45 lg:block">
              Role <span className="text-white/80">{project.role}</span>
            </p>
            <div className="mt-5 hidden flex-wrap gap-2 lg:flex">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/60">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-4 lg:mt-10">
              {live ? (
                <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#28C840]" /> Live
                </span>
              ) : (
                <span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-white/60">
                  {pad(current + 1)} / {pad(n)}
                </span>
              )}
              <div className="h-px w-32 bg-white/15">
                <motion.div className="h-px bg-primary" style={{ width: fill }} />
              </div>
            </div>

            <div className="mt-6 flex gap-5 text-sm font-semibold">
              {!live && (
                <a href="#folder" className="group hidden items-center gap-2 text-white hover:text-primary lg:inline-flex">
                  See it in the folder <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </a>
              )}
              <a
                href={project.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group items-center gap-2 ${live ? "inline-flex text-white hover:text-primary" : "hidden text-white/60 hover:text-white lg:inline-flex"}`}
              >
                {project.link.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>

          <div className="flex min-h-0 items-center justify-center lg:col-span-7">
            {live ? <BrowserViewer project={project} progress={progress} /> : <SequenceViewer project={project} frame={frame} />}
          </div>
        </div>
      </div>
    </div>
  );
}
