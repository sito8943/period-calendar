import { config } from "../config";

export type PeriodTheme = "girl" | "boy";
export type BaseAppLanguage = "es" | "en";

const PERIOD_THEME_DATA_ATTRIBUTE = "data-period-theme";
const DEFAULT_THEME: PeriodTheme = "girl";

const isPeriodTheme = (value: unknown): value is PeriodTheme =>
  value === "girl" || value === "boy";

export const toBaseAppLanguage = (value?: string | null): BaseAppLanguage =>
  value?.toLowerCase().startsWith("en") ? "en" : "es";

export const getThemedLanguage = (
  baseLanguage: BaseAppLanguage,
  theme: PeriodTheme,
): string => (theme === "boy" ? `${baseLanguage}-x-boy` : baseLanguage);

export const getStoredPeriodTheme = (): PeriodTheme => {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const value = window.localStorage.getItem(config.storage.theme);
  return isPeriodTheme(value) ? value : DEFAULT_THEME;
};

export const getAppliedPeriodTheme = (): PeriodTheme => {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const value = document.documentElement.getAttribute(
    PERIOD_THEME_DATA_ATTRIBUTE,
  );
  return isPeriodTheme(value) ? value : DEFAULT_THEME;
};

export const applyPeriodTheme = (theme: PeriodTheme): void => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(PERIOD_THEME_DATA_ATTRIBUTE, theme);
};

export const setPeriodTheme = (theme: PeriodTheme): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(config.storage.theme, theme);
  }
  applyPeriodTheme(theme);
};

export const initPeriodTheme = (): void => {
  applyPeriodTheme(getStoredPeriodTheme());
};
