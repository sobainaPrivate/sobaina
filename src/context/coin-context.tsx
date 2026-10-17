import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast {
  id: number;
  sectionId: string;
  amount: number;
  label: string;
}

interface CoinContextValue {
  coins: number;
  earnedIds: string[];
  toasts: Toast[];
  earnSection: (id: string, amount: number, label: string) => void;
  dismissToast: (id: number) => void;
}

const CoinContext = createContext<CoinContextValue | null>(null);

// Intentionally no localStorage here — coins and badges reset to zero
// every time the page is refreshed, so the "unlock" moment replays.
export function CoinProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState<number>(0);
  const [earnedSections, setEarnedSections] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const earnSection = useCallback((id: string, amount: number, label: string) => {
    setEarnedSections((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);

      setCoins((c) => c + amount);

      const toastId = Date.now();
      setToasts((t) => [...t, { id: toastId, sectionId: id, amount, label }]);
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
    <CoinContext.Provider
      value={{ coins, earnedIds: [...earnedSections], toasts, earnSection, dismissToast }}
    >
      {children}
    </CoinContext.Provider>
  );
}

export function useCoins() {
  const ctx = useContext(CoinContext);
  if (!ctx) throw new Error("useCoins must be used inside CoinProvider");
  return ctx;
}