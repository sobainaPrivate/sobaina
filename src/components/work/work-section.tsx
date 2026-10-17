import { motion } from "framer-motion";
import { workProjects } from "@/data/work";
import ProjectSequence from "./project-sequence";

export default function WorkSection() {
  return (
    <section id="work" className="relative bg-black">
      <div className="container mx-auto px-6 pb-4 pt-32 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/45">Selected work</p>
          <h2 className="mt-4 font-display text-5xl leading-[0.95] text-white md:text-7xl">
            projects,
            <br />
            <em className="text-primary">frame by frame.</em>
          </h2>
          <p className="mt-6 max-w-lg text-white/60 md:text-lg">
            Live sites I designed, built and maintain, then app and visual design.
          </p>
        </motion.div>
      </div>

      {workProjects.map((project, i) => (
        <ProjectSequence key={project.id} project={project} index={i} total={workProjects.length} />
      ))}
    </section>
  );
}
