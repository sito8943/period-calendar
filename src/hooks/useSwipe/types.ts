export interface UseSwipeOptions {
  /** Called on a left swipe (finger moves left) */
  onSwipeLeft?: () => void;
  /** Called on a right swipe (finger moves right) */
  onSwipeRight?: () => void;
  /** Minimum horizontal distance in px to count as a swipe (default: 50) */
  threshold?: number;
  /** Minimum drag distance in px before locking on the horizontal axis */
  axisThreshold?: number;
  /** Disables the gesture handlers */
  disabled?: boolean;
}
