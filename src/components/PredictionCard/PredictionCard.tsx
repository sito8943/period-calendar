import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  PREDICTION_CARD_CLASSNAMES,
  PREDICTION_CARD_CLOSE_BUTTON_VARIANT_CLASSNAMES,
  PREDICTION_CARD_VARIANT_CLASSNAMES,
} from "./constants";
import type { PredictionCardProps } from "./types";
import {
  isPredictionCardDismissed,
  joinClasses,
  persistPredictionCardDismissed,
} from "./utils";

export function PredictionCard({
  title,
  message,
  closeAriaLabel,
  dismissStorageKey,
  onClose,
  variant = "primary",
  className,
  messageClassName,
}: PredictionCardProps) {
  const [isDismissed, setIsDismissed] = useState<boolean>(() =>
    isPredictionCardDismissed(dismissStorageKey),
  );

  const handleClose = useCallback(() => {
    setIsDismissed(true);
    persistPredictionCardDismissed(dismissStorageKey);
    onClose?.();
  }, [dismissStorageKey, onClose]);

  if (isDismissed) return null;

  return (
    <div
      className={joinClasses(
        PREDICTION_CARD_CLASSNAMES.root,
        PREDICTION_CARD_VARIANT_CLASSNAMES[variant],
        className,
      )}
    >
      <button
        type="button"
        className={joinClasses(
          PREDICTION_CARD_CLASSNAMES.closeButton,
          PREDICTION_CARD_CLOSE_BUTTON_VARIANT_CLASSNAMES[variant],
        )}
        aria-label={closeAriaLabel}
        onClick={handleClose}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
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
