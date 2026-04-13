import type { RefObject } from "react";

export interface UseSwipeOptions {
  /** Element ref to attach touch listeners to */
  ref: RefObject<HTMLElement | null>;
  /** Called on a left swipe (finger moves left) */
  onSwipeLeft?: () => void;
  /** Called on a right swipe (finger moves right) */
  onSwipeRight?: () => void;
  /** Minimum horizontal distance in px to count as a swipe (default: 50) */
  threshold?: number;
}
