export interface UseSwipeDismissOptions {
  disabled?: boolean;
  dismissThreshold?: number;
  axisThreshold?: number;
  snapBackDurationMs?: number;
  onDismiss: () => void;
}
