import { useDrag } from "@use-gesture/react";

import {
  DEFAULT_SWIPE_AXIS_THRESHOLD,
  DEFAULT_SWIPE_DURATION_MS,
  DEFAULT_SWIPE_THRESHOLD,
  DEFAULT_SWIPE_VELOCITY,
} from "./constants";
import type { UseSwipeOptions } from "./types";

/**
 * Detects horizontal swipe gestures and returns bind props for the target element.
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = DEFAULT_SWIPE_THRESHOLD,
  axisThreshold = DEFAULT_SWIPE_AXIS_THRESHOLD,
  disabled = false,
}: UseSwipeOptions) {
  return useDrag(
    ({ last, movement: [movementX], swipe: [swipeX] }) => {
      if (!last) return;

      if (swipeX === -1 || movementX <= -threshold) {
        onSwipeLeft?.();
        return;
      }

      if (swipeX === 1 || movementX >= threshold) {
        onSwipeRight?.();
      }
    },
    {
      enabled: !disabled,
      axis: "x",
      filterTaps: true,
      threshold: axisThreshold,
      swipe: {
        distance: threshold,
        velocity: DEFAULT_SWIPE_VELOCITY,
        duration: DEFAULT_SWIPE_DURATION_MS,
      },
    },
  );
}
