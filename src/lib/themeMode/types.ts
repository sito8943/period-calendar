/** User preference; `system` follows `prefers-color-scheme`. */
export type ThemeMode = "system" | "light" | "dark";

/** Theme actually painted on screen. */
export type ResolvedTheme = Exclude<ThemeMode, "system">;
