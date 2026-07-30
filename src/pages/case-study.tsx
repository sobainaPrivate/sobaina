import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { projects } from "@/data/projects";
import PdfViewer from "@/components/pdf-viewer";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NotFound from "./not-found";

export default function CaseStudy() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          {/* Back link */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-12">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="flex gap-4 items-center mb-6 text-sm font-medium text-white/50">
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">{project.category}</span>
              <span>{project.year}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight" style={{ color: project.colorAccent }}>
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-12">
              {project.description}
            </p>
          </motion.div>

          {/* Abstract Image Replacement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full aspect-video rounded-3xl bg-zinc-900 border border-white/10 mb-16 overflow-hidden relative flex items-center justify-center"
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `radial-gradient(circle at center, ${project.colorAccent}, transparent 70%)` }}
            />
            <div className="relative z-10 w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 rotate-12 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20" />
            </div>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-16">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">The Challenge</h2>
              <div className="h-[1px] w-12 bg-white/20 mb-6" />
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {project.challenge}
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">The Approach</h2>
              <div className="h-[1px] w-12 bg-white/20 mb-6" />
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {project.approach}
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">The Outcome</h2>
              <div className="h-[1px] w-12 bg-white/20 mb-6" />
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {project.outcome}
              </p>
            </motion.section>
          </div>

          {/* Action Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 pt-12 border-t border-white/10 flex flex-col items-center text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Want to see the details?</h3>
            <button
              onClick={() => setIsPdfOpen(true)}
              className="px-8 py-4 bg-white text-black rounded-full font-medium flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-300"
            >
              <FileText className="w-5 h-5" /> View Full Case Study PDF
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />

      <PdfViewer 
        isOpen={isPdfOpen} 
        onClose={() => setIsPdfOpen(false)} 
        pdfUrl={project.pdfUrl} 
      />
    </div>
  );
}
