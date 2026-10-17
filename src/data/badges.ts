import { Box, Cat, Heart, type LucideIcon } from "lucide-react";

export interface BadgeDef {
  id: string; // must match the `id` passed to <RewardTrigger>
  name: string;
  icon: LucideIcon;
}

// Treats are earned by reaching sections; each one unlocks a cat badge. Find them all and the
// footer cat gets happy. Add an entry here (matching a RewardTrigger id) to add another.
export const badges: BadgeDef[] = [
  { id: "showcase", name: "Box Explorer", icon: Box },
  { id: "about", name: "Curious Cat", icon: Cat },
  { id: "contact", name: "Purr Pal", icon: Heart },
];
