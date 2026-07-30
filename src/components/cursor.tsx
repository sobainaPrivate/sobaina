import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredText, setHoveredText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringProject, setIsHoveringProject] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magneticElement = target.closest("a, button, .magnetic, [data-cursor]");
      
      if (magneticElement) {
        setIsHovering(true);
        const cursorData = magneticElement.getAttribute("data-cursor");
        if (cursorData) {
          setHoveredText(cursorData);
          if (cursorData.toLowerCase() === "view") {
            setIsHoveringProject(true);
          } else {
            setIsHoveringProject(false);
          }
        } else {
          setHoveredText("OPEN");
          setIsHoveringProject(false);
        }
      } else {
        setIsHovering(false);
        setHoveredText("");
        setIsHoveringProject(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white flex items-center justify-center pointer-events-none z-[10000] mix-blend-difference"
        style={{ x: smoothX, y: smoothY }}
        animate={{
          scale: isHovering ? 2 : 1,
          backgroundColor: isHoveringProject ? "white" : "transparent",
          borderColor: isHoveringProject ? "transparent" : "white",
        }}
        transition={{ duration: 0.2 }}
      >
        {isHovering && hoveredText && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-[3px] uppercase tracking-widest font-bold ${isHoveringProject ? "text-black mix-blend-normal" : "text-white"}`}
          >
            {hoveredText}
          </motion.span>
        )}
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{ x: dotX, y: dotY }}
        animate={{
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}