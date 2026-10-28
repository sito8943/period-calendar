import { useContext } from "react";

// types
import type { ThemeContextType } from "./types";
import { ThemeContext } from "./ThemeContext";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
