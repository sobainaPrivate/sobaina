import { motion } from "framer-motion";

interface Orb {
  id: string;
  color: string;
  size: number;
  top: string;
  left: string;
  duration: number;
}

const orbs: Orb[] = [
  { id: "indigo", color: "#6366F1", size: 480, top: "-10%", left: "5%", duration: 22 },
  { id: "cyan", color: "#22D3EE", size: 360, top: "55%", left: "70%", duration: 26 },
  { id: "pink", color: "#EC4899", size: 320, top: "70%", left: "10%", duration: 30 },
  { id: "violet", color: "#A78BFA", size: 300, top: "10%", left: "65%", duration: 24 },
];

export default function NeonBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color,
            filter: "blur(110px)",
            opacity: 0.22,
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.95, 1],
            opacity: [0.16, 0.28, 0.18, 0.16],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}