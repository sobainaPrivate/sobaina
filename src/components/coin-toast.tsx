import { AnimatePresence, motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import { useCoins } from "@/context/coin-context";
import { badges } from "@/data/badges";

export default function CoinToast() {
  const { toasts, dismissToast } = useCoins();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const badge = badges.find((b) => b.id === toast.sectionId);
          const Icon = badge?.icon ?? PawPrint;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.3 } }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              className="pointer-events-auto flex items-center gap-3 rounded-full bg-white text-black pl-2 pr-5 py-2 shadow-2xl"
            >
              <motion.div
                initial={{ rotate: -30, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 text-black"
              >
                <Icon className="w-4 h-4" />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold">
                  {badge ? `${badge.name} unlocked` : `+${toast.amount} treats`}
                </span>
                <span className="text-[11px] text-black/60">
                  {toast.label} · +{toast.amount} treats 🐾
                </span>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="ml-1 text-black/30 hover:text-black text-xs"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}