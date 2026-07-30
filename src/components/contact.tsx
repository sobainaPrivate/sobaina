import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Dribbble, Mail, ArrowRight } from "lucide-react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 relative bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 mb-6">
            Let's Make<br />
            Something<br />
            Unforgettable.
          </h2>
          <p className="text-lg text-white/40 uppercase tracking-widest font-medium">
            Open to senior roles & select projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative group">
                  <label htmlFor="name" className="absolute -top-6 left-0 text-xs font-bold uppercase tracking-widest text-white/40 group-focus-within:text-primary transition-colors">
                    Name
                  </label>
                  <input 
                    id="name"
                    type="text" 
                    required
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg focus:outline-none focus:border-white transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="relative group">
                  <label htmlFor="email" className="absolute -top-6 left-0 text-xs font-bold uppercase tracking-widest text-white/40 group-focus-within:text-primary transition-colors">
                    Email
                  </label>
                  <input 
                    id="email"
                    type="email" 
                    required
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg focus:outline-none focus:border-white transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              
              <div className="relative group mt-6">
                <label htmlFor="message" className="absolute -top-6 left-0 text-xs font-bold uppercase tracking-widest text-white/40 group-focus-within:text-primary transition-colors">
                  Message
                </label>
                <textarea 
                  id="message"
                  required
                  rows={1}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg focus:outline-none focus:border-white transition-colors resize-none overflow-hidden min-h-[44px]"
                  placeholder="Tell me about your project..."
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || isSent}
                className="mt-8 group w-full bg-white text-black py-6 rounded-full font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-4 hover:bg-white/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed magnetic"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="submitting"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"
                    />
                  ) : isSent ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-primary"
                    >
                      Sent Successfully!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Send Message
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end gap-12 mt-16 lg:mt-0"
          >
            <div className="flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Socials</span>
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Dribbble, href: "https://dribbble.com", label: "Dribbble" },
                { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-white/70 hover:text-white hover:translate-x-2 transition-all duration-300 w-fit"
                >
                  <social.icon className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-wide">{social.label}</span>
                </a>
              ))}
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Location</span>
              <span className="text-white/80 leading-relaxed">Lahore , Pakistan <br/>09:41 AM (PST)</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}