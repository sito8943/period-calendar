import {
  DARK_SCHEME_QUERY,
  DARK_THEME_CLASS,
  THEME_COLOR_META,
  THEME_MODES,
  THEME_STORAGE_KEY,
} from "./constants";
import type { ResolvedTheme, ThemeMode } from "./types";

export const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === "string" && THEME_MODES.includes(value as ThemeMode);

export const readStoredThemeMode = (): ThemeMode => {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(value) ? value : "system";
  } catch {
    return "system";
  }
};

export const persistThemeMode = (mode: ThemeMode) => {
  try {
    if (mode === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // storage unavailable (private mode): the choice lasts this session only
  }
};

export const prefersDarkScheme = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(DARK_SCHEME_QUERY).matches;

export const resolveTheme = (
  mode: ThemeMode,
  systemPrefersDark: boolean,
): ResolvedTheme => {
  if (mode === "system") return systemPrefersDark ? "dark" : "light";
  return mode;
};

export const applyResolvedTheme = (theme: ResolvedTheme) => {
  const root = document.documentElement;
  root.classList.toggle(DARK_THEME_CLASS, theme === "dark");
  root.style.colorScheme = theme;

  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  meta?.setAttribute("content", THEME_COLOR_META[theme]);
};
