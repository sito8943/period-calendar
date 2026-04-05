import type { PredictionCardVariant } from "./types";

export const PREDICTION_CARD_CLASSNAMES = {
  root: "relative rounded-xl p-4 pr-10 shadow-md quick-blur-appear",
  title: "text-sm font-medium opacity-80",
  message: "text-2xl max-sm:text-lg font-bold mt-1",
  closeButton:
    "absolute top-2 right-2 size-7 rounded-full flex items-center justify-center transition-colors transition-opacity opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
} as const;

export const PREDICTION_CARD_VARIANT_CLASSNAMES: Record<
  PredictionCardVariant,
  string
> = {
  primary: "bg-primary text-white",
  fertile: "bg-base-light border-2 border-fertile text-fertile",
  error: "bg-bg-error text-white",
};

export const PREDICTION_CARD_CLOSE_BUTTON_VARIANT_CLASSNAMES: Record<
  PredictionCardVariant,
  string
> = {
  primary: "hover:bg-white/20 focus-visible:ring-white/70 focus-visible:ring-offset-bg-primary",
  fertile:
    "hover:bg-fertile/10 focus-visible:ring-fertile/40 focus-visible:ring-offset-base-light",
  error: "hover:bg-white/20 focus-visible:ring-white/70 focus-visible:ring-offset-bg-error",
};

export const PREDICTION_CARD_DISMISS_STORAGE_PREFIX =
  "period-calendar:prediction-card:dismissed";
export const PREDICTION_CARD_DISMISS_STORAGE_VALUE = "1";
