import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import type { WorkProject } from "@/data/work";

/** Height ÷ width of the browser viewport (16:10). */
const VIEWPORT = 0.625;

/**
 * A browser window onto a live site: as the section scrolls, the full-page capture scrolls
 * through the viewport, top of the page to the footer.
 */
export default function BrowserViewer({ project, progress }: { project: WorkProject; progress: MotionValue<number> }) {
  const ratio = project.site?.pageRatio ?? 2;
  // How far (as % of the capture's own height) the page has to travel to bring the footer into view.
  const travel = Math.max(0, 1 - VIEWPORT / ratio) * 100;
  const y = useTransform(progress, (p) => `-${p * travel}%`);

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-[#1b1b1d] ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#222225] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
        </div>
        <div className="flex flex-1 justify-center">
          <span className="flex w-full max-w-xs items-center justify-center gap-2 truncate rounded-md bg-black/40 px-3 py-1 font-mono text-[11px] text-white/60">
            <Lock className="h-3 w-3 shrink-0" />
            {project.site?.url}
          </span>
        </div>
        <a
          href={project.link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={project.link.label}
          className="text-white/45 transition-colors hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden" style={{ background: project.surface }}>
        <motion.img
          src={project.frames[0]}
          alt={`${project.title} website, full page`}
          decoding="async"
          draggable={false}
          style={{ y }}
          className="absolute inset-x-0 top-0 w-full"
        />
      </div>
    </div>
  );
}
