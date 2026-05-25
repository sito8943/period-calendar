import type { PredictionCardVariant } from "./types";

export const PREDICTION_CARD_CLASSNAMES = {
  root: "prediction-card",
  enterAnimation: "quick-blur-appear",
  exitAnimation: "quick-blur-disappear",
  title: "prediction-card-title",
  message: "prediction-card-message",
  closeButton: "prediction-card-close-button",
} as const;

export const PREDICTION_CARD_VARIANT_CLASSNAMES: Record<
  PredictionCardVariant,
  string
> = {
  primary: "prediction-card-primary",
  fertile: "prediction-card-fertile",
  error: "prediction-card-error",
};

export const PREDICTION_CARD_CLOSE_BUTTON_VARIANT_CLASSNAMES: Record<
  PredictionCardVariant,
  string
> = {
  primary: "prediction-card-close-button-primary",
  fertile: "prediction-card-close-button-fertile",
  error: "prediction-card-close-button-error",
};

export const PREDICTION_CARD_DISMISS_STORAGE_PREFIX =
  "period-calendar:prediction-card:dismissed";
export const PREDICTION_CARD_DISMISS_STORAGE_VALUE = "1";
export const PREDICTION_CARD_DISMISS_ANIMATION_DURATION_MS = 300;
export const PREDICTION_CARD_SWIPE_DISMISS_THRESHOLD = 40;
