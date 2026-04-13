import { useEffect, useRef } from "react";

import { DEFAULT_SWIPE_THRESHOLD } from "./constants";
import type { UseSwipeOptions } from "./types";

/**
 * Detects horizontal swipe gestures on a given element.
 */
export function useSwipe({
  ref,
  onSwipeLeft,
  onSwipeRight,
  threshold = DEFAULT_SWIPE_THRESHOLD,
}: UseSwipeOptions) {
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX.current;
      const diffY = endY - startY.current;

      // Only trigger if horizontal movement is dominant
      if (Math.abs(diffX) < threshold || Math.abs(diffX) < Math.abs(diffY))
        return;

      if (diffX < 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold]);
}
