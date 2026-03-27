import { createContext } from "react";

export type BottomNavActionContextType = {
  onAction: (() => void) | null;
  setOnAction: (action: (() => void) | null) => void;
};

export const BottomNavActionContext =
  createContext<BottomNavActionContextType | null>(null);
