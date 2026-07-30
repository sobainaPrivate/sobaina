import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import { useCoins } from "@/context/coin-context";

export default function CoinCounter() {
  const { coins } = useCoins();
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (coins === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [coins]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed top-6 right-6 z-[90] flex items-center gap-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md px-4 py-2"
    >
      <motion.div
        animate={bump ? { scale: [1, 1.3, 1], rotate: [0, -15, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 text-black"
      >
        <Coins className="w-3 h-3" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={coins}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-bold text-white tabular-nums"
        >
          {coins}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}