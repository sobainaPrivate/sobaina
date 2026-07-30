import { useRef, useEffect, ReactNode } from "react";
import { useInView } from "framer-motion";
import { useCoins } from "@/context/coin-context";

interface RewardTriggerProps {
  id: string;
  amount: number;
  label: string;
  children: ReactNode;
}

export default function RewardTrigger({ id, amount, label, children }: RewardTriggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.4, once: true });
  const { earnSection } = useCoins();

  useEffect(() => {
    if (isInView) earnSection(id, amount, label);
  }, [isInView, id, amount, label, earnSection]);

  return <div ref={ref}>{children}</div>;
}