import type { ThemeColors } from "@sito/dashboard-app";

// Light/dark logic lives in `@sito/dashboard-app` (`ThemeProvider`); these are
// the app-specific values it is configured with.

// Keep in sync with the inline boot script in `index.html` (avoids a flash of
// the wrong theme before React mounts). Kept from the former local provider so
// saved preferences survive.
// Not to be confused with `config.storage.theme` (girl/boy palette).
export const THEME_STORAGE_KEY = "period-calendar:color-theme";

/** `<meta name="theme-color">` per theme (browser chrome / PWA status bar). */
export const THEME_COLOR_META: ThemeColors = {
  light: "#d4477a",
  dark: "#121214",
};
