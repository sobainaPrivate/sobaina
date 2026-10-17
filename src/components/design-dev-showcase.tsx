import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, X, ExternalLink, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { figmaProjects, type FigmaProject } from "@/data/figma-projects";

// Computes a fan-out position for item `i` of `total`, so the bouquet
// always has enough slots no matter how many projects are in the data file.
function getBouquetPosition(i: number, total: number) {
  const spreadDeg = Math.min(40 + total * 12, 160);
  const radius = 170 + total * 10;
  const t = total > 1 ? i / (total - 1) : 0.5;
  const deg = -spreadDeg / 2 + t * spreadDeg;
  const rad = (deg * Math.PI) / 180;
  return {
    x: radius * Math.sin(rad),
    y: -radius * Math.cos(rad),
    rotate: deg * 0.5,
  };
}

/** <img> with a graceful fallback frame when the real export hasn't been added yet. */
function ProjectImage({
  src,
  color,
  label,
  className,
}: {
  src?: string;
  color: string;
  label?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 ${className}`}
        style={{ backgroundColor: color + "1A" }}
      >
        <ImageOff className="w-5 h-5" style={{ color }} />
        {label && <span className="text-[10px] text-white/30 px-2 text-center">{label}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={label ?? ""}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

function ExpandedProject({
  project,
  onClose,
}: {
  project: FigmaProject;
  onClose: () => void;
}) {
  const [screenIndex, setScreenIndex] = useState(0);
  const screen = project.screens[screenIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="absolute inset-3 md:inset-6 z-30 rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0f] flex flex-col md:flex-row"
    >
      {project.pdf ? (
        <div className="relative flex-1 min-h-[55%] md:min-h-full bg-black/30">
          <iframe
            src={project.pdf}
            title={project.name}
            className="w-full h-full border-0"
          />
        </div>
      ) : (
        <div className="relative flex-1 min-h-[55%] md:min-h-full bg-black/30 flex items-center justify-center p-4 md:p-6">
          <div className="relative h-full max-h-full rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black aspect-[1242/2688]">
            <ProjectImage
              src={screen}
              color={project.color}
              label={screen ? `Add ${screen.split("/").pop()}` : "No screens added yet"}
              className="w-full h-full"
            />
          </div>

          {project.screens.length > 1 && (
            <>
              <button
                onClick={() =>
                  setScreenIndex((i) => (i === 0 ? project.screens.length - 1 : i - 1))
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white/70 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setScreenIndex((i) => (i + 1) % project.screens.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white/70 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {project.screens.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setScreenIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === screenIndex ? "bg-white" : "bg-white/25"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="w-full md:w-64 p-6 flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-white/10 overflow-hidden">
        <div className="overflow-y-auto pr-1">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
            {project.platform === "figma" ? "Figma file" : "Canva file"}
          </p>
          <h3 className="text-xl font-bold text-white">{project.name}</h3>
          <p className="text-sm text-white/50 mt-2 leading-relaxed">{project.description}</p>
          <p className="text-xs text-white/30 mt-3">
            {project.pdf
              ? "Scroll to view all pages"
              : `${screenIndex + 1} / ${project.screens.length} curated screens`}
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-6 shrink-0">
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-black bg-white rounded-full py-2.5 hover:opacity-90 transition-opacity"
          >
            {project.platform === "figma" ? "View full project" : "View in Canva"}{" "}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DesignPanel() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedProject = figmaProjects.find((f) => f.id === selected) ?? null;

  return (
    <div className="absolute inset-0 flex items-center translate-y-16 justify-center">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="relative z-10 flex flex-col items-center gap-3 group"
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={open ? { y: -6 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Folder
            className="w-24 h-24 text-primary/80 group-hover:text-primary transition-colors"
            strokeWidth={1.25}
            fill="currentColor"
            fillOpacity={0.12}
          />
        </motion.div>
        <span className="text-xs uppercase tracking-widest text-white/40">
          {open ? "Close folder" : "Design projects"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open &&
          figmaProjects.map((project, i) => {
            const pos = getBouquetPosition(i, figmaProjects.length);
            return (
              <motion.button
                key={project.id}
                onClick={() => setSelected(project.id)}
                className="absolute z-20 flex flex-col items-center gap-1.5"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
                animate={{ x: pos.x, y: pos.y, opacity: 1, scale: 1, rotate: pos.rotate }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.4, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.07 }}
                whileHover={{ scale: 1.08, rotate: 0, y: pos.y - 8 }}
              >
                <ProjectImage
                  src={project.cover}
                  color={project.color}
                  className="w-20 h-20 rounded-lg border border-white/10 shadow-lg"
                />
                <span className="text-[10px] text-white/60 whitespace-nowrap">
                  {project.name}
                </span>
              </motion.button>
            );
          })}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ExpandedProject project={selectedProject} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DesignDevShowcase() {
  return (
    <section id="folder" className="relative w-full py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/45 mb-3">
            Still curious?
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white">
            Open the folder<span className="text-primary">.</span>
          </h2>
          <p className="mt-3 text-sm text-white/55 max-w-sm">
            Every project in full: all the screens, the PDFs and the source files.
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-[#0d0d0f] overflow-hidden aspect-[16/10]">
          <DesignPanel />
        </div>
      </div>
    </section>
  );
}
