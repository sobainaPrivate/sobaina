import { motion, useTransform, type MotionValue } from "framer-motion";
import type { WorkProject } from "@/data/work";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const shapes: Record<WorkProject["frameStyle"], string> = {
  phone:
    "aspect-[375/812] h-[44dvh] lg:h-[74dvh] rounded-[2.4rem] border-[9px] border-neutral-900 ring-1 ring-white/15",
  screen: "aspect-[9/16] h-[44dvh] lg:h-[74dvh] rounded-[1.75rem] ring-1 ring-white/10",
  poster: "aspect-[16/10] w-full max-w-3xl rounded-2xl ring-1 ring-white/10",
  browser: "", // live sites use BrowserViewer instead
};

interface FrameProps {
  src: string;
  index: number;
  /** Continuous frame position driven by scroll, e.g. 1.4 = 40% of the way from frame 1 to 2. */
  frame: MotionValue<number>;
  fit: "cover" | "contain";
  surface: string;
  alt: string;
}

/** Each frame slides up over the one before it; the covered frame sinks back and dims. */
function SequenceFrame({ src, index, frame, fit, surface, alt }: FrameProps) {
  const y = useTransform(frame, (v) => `${clamp01(index - v) * 100}%`);
  const scale = useTransform(frame, (v) => 1 - clamp01(v - index) * 0.08);
  const shade = useTransform(frame, (v) => clamp01(v - index) * 0.55);

  return (
    <motion.div className="absolute inset-0 origin-top" style={{ y, scale, background: surface }}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        draggable={false}
        className={`h-full w-full ${fit === "cover" ? "object-cover object-top" : "object-contain"}`}
      />
      <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} />
    </motion.div>
  );
}

export default function SequenceViewer({ project, frame }: { project: WorkProject; frame: MotionValue<number> }) {
  return (
    <div
      className={`relative overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ${shapes[project.frameStyle]}`}
      style={{ background: project.surface }}
    >
      {project.frames.map((src, i) => (
        <SequenceFrame
          key={src}
          src={src}
          index={i}
          frame={frame}
          fit={project.frameStyle === "phone" ? "cover" : "contain"}
          surface={project.surface}
          alt={`${project.title}, frame ${i + 1} of ${project.frames.length}`}
        />
      ))}
    </div>
  );
}
