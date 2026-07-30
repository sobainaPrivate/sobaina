import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";

const taglines = [
  "UI/UX Designer",
  "Software Developer",
  "Creative Technologist"
];

const MOUSE_MAGNETIC_RADIUS = 80;

function MagneticButton({ children, href, className, primary }: { children: ReactNode; href: string; className?: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance < MOUSE_MAGNETIC_RADIUS) {
      x.set(distanceX * 0.3);
      y.set(distanceY * 0.3);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      className={`relative inline-flex items-center justify-center magnetic ${className}`}
      data-cursor={primary ? "" : ""}
    >
      {children}
    </motion.a>
  );
}

function ScrambleText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState<string[]>(Array(text.length).fill(""));
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  
  useEffect(() => {
    const letters = text.split("");
    let frame = 0;
    
    const update = setInterval(() => {
      let resolvedCount = 0;
      setDisplayText(letters.map((char, index) => {
        if (char === " ") return " ";
        if (frame > index * 4 + 10) {
          resolvedCount++;
          return char;
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }));
      
      frame++;
      if (resolvedCount === letters.length) {
        clearInterval(update);
      }
    }, 40);
    
    return () => clearInterval(update);
  }, [text]);

  return <>{displayText.join("")}</>;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [taglineIndex, setTaglineIndex] = useState(0);

  // Cycle taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Canvas particle grid effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 };
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const spacing = 40;
    const cols = Math.floor(width / spacing) + 2;
    const rows = Math.floor(height / spacing) + 2;

    const dots: { x: number; y: number; originX: number; originY: number }[] = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;
        dots.push({ x, y, originX: x, originY: y });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = 150;
        const force = Math.max(0, maxDist - dist) / maxDist;
        
        if (dist < maxDist) {
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 15;
          const pushY = Math.sin(angle) * force * 15;
          
          dot.x += (dot.originX + pushX - dot.x) * 0.1;
          dot.y += (dot.originY + pushY - dot.y) * 0.1;
        } else {
          dot.x += (dot.originX - dot.x) * 0.05;
          dot.y += (dot.originY - dot.y) * 0.05;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden text-center py-20">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
      />
      <div className="absolute inset-0 z-0 bg-background/50 radial-gradient-mask pointer-events-none" 
           style={{ background: 'radial-gradient(circle at center, transparent 0%, var(--color-background) 80%)' }} />

      <div className="container relative z-10 px-6 md:px-12 flex flex-col items-center justify-center w-full">
        <p className="text-lg md:text-2xl font-medium text-white/60 tracking-tight font-sans mb-2 md:mb-3">
          Hi, I'm
        </p>
        <h1 className="text-[11vw] md:text-[9vw] font-bold tracking-tighter text-white leading-[0.85] font-sans">
          <ScrambleText text="SOBAINA" />
        </h1>

        <div className="mt-8 md:mt-12 h-10 md:h-16 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={taglineIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: "anticipate" }}
              className="text-2xl md:text-4xl font-bold text-primary tracking-tight font-sans"
            >
              {taglines[taglineIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.p
          className="mt-6 md:mt-8 text-lg md:text-2xl text-muted-foreground max-w-3xl font-light leading-relaxed mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          I design systems that feel inevitable and build products people fall in love with.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          <MagneticButton
            href="#work"
            primary
            className="px-10 py-5 bg-white text-black rounded-full font-bold text-sm tracking-widest uppercase shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-shadow duration-300 w-full sm:w-auto"
          >
            View Work
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="px-10 py-5 border border-white/20 rounded-full font-bold text-sm tracking-widest uppercase text-white hover:bg-white/5 transition-colors duration-300 w-full sm:w-auto"
          >
            Get in Touch
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}