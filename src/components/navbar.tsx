import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import CoinCounter from "@/components/coin-counter";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [location] = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const isHome = location === "/";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (!isHome) return; // Let it navigate normally if not on home page
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80; // Offset for navbar
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-md border-b border-white/10 py-4"
          : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/">
          <span className="font-serif text-2xl font-bold tracking-tighter text-white hover:text-white/80 transition-colors cursor-pointer select-none flex items-center gap-1 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
            Sk
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/#work" onClick={(e) => handleNavClick(e, "work")}>
            <span className="text-sm font-medium text-muted-foreground hover:text-white transition-colors cursor-pointer uppercase tracking-widest">
              Work
            </span>
          </Link>
          <Link href="/#about" onClick={(e) => handleNavClick(e, "about")}>
            <span className="text-sm font-medium text-muted-foreground hover:text-white transition-colors cursor-pointer uppercase tracking-widest">
              About
            </span>
          </Link>
          <Link href="/#contact" onClick={(e) => handleNavClick(e, "contact")}>
            <span className="text-sm font-medium text-muted-foreground hover:text-white transition-colors cursor-pointer uppercase tracking-widest">
              Contact
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-medium">Open to Work</span>
          </div>
          <CoinCounter />
        </div>
      </div>
    </motion.header>
  );
}