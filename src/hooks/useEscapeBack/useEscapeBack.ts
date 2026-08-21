import { useEffect } from "react";
import { ESCAPE_KEY } from "./constants";
import type { UseEscapeBackOptions } from "./types";

export function useEscapeBack(
  onBack: (() => void) | undefined,
  options: UseEscapeBackOptions = {},
): void {
  const { enabled = true } = options;

  useEffect(() => {
    if (!onBack || !enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ESCAPE_KEY || event.defaultPrevented) return;
      onBack();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack, enabled]);
}
