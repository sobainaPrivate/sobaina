import { motion } from "framer-motion";
import { useCoins } from "@/context/coin-context";
import { badges } from "@/data/badges";

export default function BadgeTray() {
  const { earnedIds } = useCoins();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.7, duration: 0.6 }}
      className="fixed top-24 right-6 z-[80] flex flex-col gap-2 items-end"
    >
      {badges.map((badge) => {
        const unlocked = earnedIds.includes(badge.id);
        const Icon = badge.icon;

        return (
          <motion.div
            key={badge.id}
            animate={unlocked ? { scale: [0.6, 1.15, 1], rotate: [0, -8, 0] } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border backdrop-blur-md transition-colors duration-700 ${
              unlocked
                ? "border-white/20 bg-black/50"
                : "border-white/5 bg-black/20"
            }`}
          >
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-colors duration-700 ${
                unlocked
                  ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-black"
                  : "bg-white/5 text-white/20"
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <span
              className={`text-[10px] uppercase tracking-widest font-medium transition-colors duration-700 ${
                unlocked ? "text-white" : "text-white/20"
              }`}
            >
              {unlocked ? badge.name : "Locked"}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}