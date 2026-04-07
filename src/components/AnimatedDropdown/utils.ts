import { ANIMATED_DROPDOWN_ANIMATION_DURATION_MS } from "./constants";

export function getAnimatedDropdownCloseDelayMs(): number {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return 0;
  }

  return ANIMATED_DROPDOWN_ANIMATION_DURATION_MS;
}
