import {
  PREDICTION_CARD_CLASSNAMES,
  PREDICTION_CARD_VARIANT_CLASSNAMES,
} from "./constants";
import type { PredictionCardProps } from "./types";
import { joinClasses } from "./utils";

export function PredictionCard({
  title,
  message,
  variant = "primary",
  className,
  messageClassName,
}: PredictionCardProps) {
  return (
    <div
      className={joinClasses(
        PREDICTION_CARD_CLASSNAMES.root,
        PREDICTION_CARD_VARIANT_CLASSNAMES[variant],
        className,
      )}
    >
      <h2 className={PREDICTION_CARD_CLASSNAMES.title}>{title}</h2>
      <p
        className={joinClasses(
          PREDICTION_CARD_CLASSNAMES.message,
          messageClassName,
        )}
      >
        {message}
      </p>
    </div>
  );
}
