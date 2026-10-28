import type { ResolvedTheme, ThemeMode } from "lib";

export type ThemeContextType = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};
