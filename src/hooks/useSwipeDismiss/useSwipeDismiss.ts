import { useEffect, useState } from "react";
import { useDrag } from "@use-gesture/react";
import type { CSSProperties } from "react";
import {
  DEFAULT_SWIPE_DISMISS_AXIS_THRESHOLD,
  DEFAULT_SWIPE_DISMISS_SNAP_BACK_DURATION_MS,
  DEFAULT_SWIPE_DISMISS_SWIPE_DURATION_MS,
  DEFAULT_SWIPE_DISMISS_SWIPE_VELOCITY,
  DEFAULT_SWIPE_DISMISS_THRESHOLD,
} from "./constants";
import type { UseSwipeDismissOptions } from "./types";

export function useSwipeDismiss({
  disabled = false,
  dismissThreshold = DEFAULT_SWIPE_DISMISS_THRESHOLD,
  axisThreshold = DEFAULT_SWIPE_DISMISS_AXIS_THRESHOLD,
  snapBackDurationMs = DEFAULT_SWIPE_DISMISS_SNAP_BACK_DURATION_MS,
  onDismiss,
}: UseSwipeDismissOptions) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!disabled) return;

    setOffsetX(0);
    setIsDragging(false);
  }, [disabled]);

  const bind = useDrag(
    ({ down, movement: [movementX], swipe: [swipeX] }) => {
      const nextOffsetX = Math.max(movementX, 0);

      if (down) {
        setIsDragging(true);
        setOffsetX(nextOffsetX);
        return;
      }

      setIsDragging(false);
      setOffsetX(0);

      if (nextOffsetX >= dismissThreshold || swipeX === 1) {
        onDismiss();
      }
    },
    {
      enabled: !disabled,
      axis: "x",
      filterTaps: true,
      threshold: axisThreshold,
      swipe: {
        distance: dismissThreshold,
        velocity: DEFAULT_SWIPE_DISMISS_SWIPE_VELOCITY,
        duration: DEFAULT_SWIPE_DISMISS_SWIPE_DURATION_MS,
      },
    },
  );

  const dragStyle: CSSProperties = {
    transform: `translate3d(${offsetX}px, 0, 0)`,
    transition: isDragging
      ? "none"
      : `transform ${snapBackDurationMs}ms ease`,
  };

  return {
    bind,
    dragStyle,
  };
}
