import type { ReactNode } from "react";

export type BottomNavItemType = {
  page: string;
  path: string;
  icon: ReactNode;
  position: "left" | "right";
};
