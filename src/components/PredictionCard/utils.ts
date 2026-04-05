import {
  PREDICTION_CARD_DISMISS_STORAGE_PREFIX,
  PREDICTION_CARD_DISMISS_STORAGE_VALUE,
} from "./constants";

export const joinClasses = (...classes: Array<string | undefined>): string =>
  classes.filter(Boolean).join(" ");

export function getPredictionCardDismissStorageKey(storageKey: string): string {
  return `${PREDICTION_CARD_DISMISS_STORAGE_PREFIX}:${storageKey}`;
}

export function isPredictionCardDismissed(storageKey?: string): boolean {
  if (!storageKey || typeof window === "undefined") return false;

  try {
    return (
      window.sessionStorage.getItem(
        getPredictionCardDismissStorageKey(storageKey),
      ) === PREDICTION_CARD_DISMISS_STORAGE_VALUE
    );
  } catch {
    return false;
  }
}

export function persistPredictionCardDismissed(storageKey?: string): void {
  if (!storageKey || typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      getPredictionCardDismissStorageKey(storageKey),
      PREDICTION_CARD_DISMISS_STORAGE_VALUE,
    );
  } catch {
    // Ignore storage write errors to avoid blocking UI interaction.
  }
}
