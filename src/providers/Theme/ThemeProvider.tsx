import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// lib
import {
  DARK_SCHEME_QUERY,
  applyResolvedTheme,
  persistThemeMode,
  prefersDarkScheme,
  readStoredThemeMode,
  resolveTheme,
} from "lib";
import type { ThemeMode } from "lib";

// types
import type { ThemeContextType } from "./types";
import type { BasicProviderPropTypes } from "../types";

import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const [mode, setModeState] = useState<ThemeMode>(readStoredThemeMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState(prefersDarkScheme);
  const modeRef = useRef(mode);

  // The `<html>` class is applied in the handlers, BEFORE the state update:
  // children that read CSS variables during render must see
  // the new tokens on that same render, and child effects run before ours.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(DARK_SCHEME_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      applyResolvedTheme(resolveTheme(modeRef.current, event.matches));
      setSystemPrefersDark(event.matches);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme = resolveTheme(mode, systemPrefersDark);

  // initial sync (the boot script in index.html already set the class)
  useEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      modeRef.current = next;
      persistThemeMode(next);
      applyResolvedTheme(resolveTheme(next, systemPrefersDark));
      setModeState(next);
    },
    [systemPrefersDark],
  );

  const value = useMemo<ThemeContextType>(
    () => ({ mode, resolvedTheme, setMode }),
    [mode, resolvedTheme, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
