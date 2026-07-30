import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast {
  id: number;
  amount: number;
  label: string;
}

interface CoinContextValue {
  coins: number;
  toasts: Toast[];
  earnSection: (id: string, amount: number, label: string) => void;
  dismissToast: (id: number) => void;
}

const CoinContext = createContext<CoinContextValue | null>(null);
const STORAGE_KEY = "portfolio-coins";
const EARNED_KEY = "portfolio-earned-sections";

export function CoinProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [earnedSections, setEarnedSections] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(EARNED_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  const earnSection = useCallback((id: string, amount: number, label: string) => {
    setEarnedSections((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(EARNED_KEY, JSON.stringify([...next]));

      setCoins((c) => {
        const updated = c + amount;
        localStorage.setItem(STORAGE_KEY, String(updated));
        return updated;
      });

      const toastId = Date.now();
      setToasts((t) => [...t, { id: toastId, amount, label }]);
      setTimeout(() => {
        setToasts((t) => t.filter((toast) => toast.id !== toastId));
      }, 3200);

      return next;
    });
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  return (
    <CoinContext.Provider value={{ coins, toasts, earnSection, dismissToast }}>
      {children}
    </CoinContext.Provider>
  );
}

export function useCoins() {
  const ctx = useContext(CoinContext);
  if (!ctx) throw new Error("useCoins must be used inside CoinProvider");
  return ctx;
}