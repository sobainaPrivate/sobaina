import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { projects, Project } from "../data/dev/projects";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [, setLocation] = useLocation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLocation(`/case/${project.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-white/10 group relative"
    >
      <motion.a 
        href={`/case/${project.id}`}
        onClick={handleClick}
        data-cursor="view"
        className="block relative overflow-hidden py-16 px-6 md:px-12 transition-colors duration-500"
        whileHover="hover"
      >
        <motion.div 
          className="absolute inset-0 opacity-0 z-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
          style={{ backgroundColor: project.colorAccent + "0D" }} // 0D is ~5% opacity
        />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
          {/* Massive Number */}
          <div className="hidden md:block w-32 shrink-0 pointer-events-none">
            <span className="text-[8rem] font-bold text-white/5 leading-none transition-colors duration-500 group-hover:text-white/10">
              0{index + 1}
            </span>
          </div>

          {/* Project Info */}
          <motion.div 
            className="flex-1 flex flex-col gap-4"
            variants={{
              hover: { x: 16 }
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 text-sm font-medium tracking-widest text-white/40 uppercase">
              <span>{project.category}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{project.year}</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              {project.title}
            </h3>
            
            <p className="text-lg text-white/60 max-w-xl line-clamp-2">
              {project.description}
            </p>
            
            <div className="flex gap-2 flex-wrap mt-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Preview Box */}
          <motion.div 
            className="w-full md:w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative shrink-0 pointer-events-none"
            variants={{
              hover: { rotate: 2, scale: 1.05 }
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{ backgroundColor: project.colorAccent }}
            />
            <div 
              className="absolute inset-0 opacity-50 mix-blend-overlay"
              style={{ 
                background: `radial-gradient(circle at 30% 30%, ${project.colorAccent}, transparent 70%)` 
              }}
            />
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] border border-white/10 rounded-2xl" />
            
            {/* Inner abstract geometric decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full" />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rotate-45 rounded-md"
              style={{ backgroundColor: project.colorAccent + "80" }}
            />
          </motion.div>
        </div>
      </motion.a>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="work" className="py-24 relative bg-background">
      <div className="container mx-auto px-0 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24 px-6 md:px-12 flex flex-col gap-2"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
            Selected Work
          </span>
          <div className="flex items-center gap-4">
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">Projects.</h2>
            <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary font-sans text-xl md:text-3xl font-bold mt-2">
              (3)
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col border-t border-white/10">
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}