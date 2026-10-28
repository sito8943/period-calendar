import type { ResolvedTheme, ThemeMode } from "./types";

// Keep in sync with the inline boot script in `index.html` (avoids a flash of
// the wrong theme before React mounts).
// Not to be confused with `config.storage.theme` (girl/boy palette).
export const THEME_STORAGE_KEY = "period-calendar:color-theme";

export const THEME_MODES: readonly ThemeMode[] = ["system", "light", "dark"];

export const DARK_THEME_CLASS = "dark";

export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

/** `<meta name="theme-color">` per theme (browser chrome / PWA status bar). */
export const THEME_COLOR_META: Record<ResolvedTheme, string> = {
  light: "#d4477a",
  dark: "#121214",
};
