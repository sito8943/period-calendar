import type { PredictionCardVariant } from "./types";

export const PREDICTION_CARD_CLASSNAMES = {
  root: "rounded-xl p-4 shadow-md",
  title: "text-sm font-medium opacity-80",
  message: "text-2xl max-sm:text-lg font-bold mt-1",
} as const;

export const PREDICTION_CARD_VARIANT_CLASSNAMES: Record<
  PredictionCardVariant,
  string
> = {
  primary: "bg-primary text-white",
  fertile: "bg-base-light border-2 border-fertile text-fertile",
  error: "bg-bg-error text-white",
};
