import { useCallback, useEffect, useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@sito/dashboard-app";
import { useSwipeDismiss } from "hooks";
import {
  PREDICTION_CARD_CLASSNAMES,
  PREDICTION_CARD_CLOSE_BUTTON_VARIANT_CLASSNAMES,
  PREDICTION_CARD_DISMISS_ANIMATION_DURATION_MS,
  PREDICTION_CARD_SWIPE_DISMISS_THRESHOLD,
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
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isClosing) return;

    const timeoutId = setTimeout(() => {
      setIsDismissed(true);
    }, PREDICTION_CARD_DISMISS_ANIMATION_DURATION_MS);

    return () => clearTimeout(timeoutId);
  }, [isClosing]);

  const handleClose = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    persistPredictionCardDismissed(dismissStorageKey);
    onClose?.();
  }, [dismissStorageKey, isClosing, onClose]);
  const { bind, dragStyle } = useSwipeDismiss({
    disabled: isClosing,
    dismissThreshold: PREDICTION_CARD_SWIPE_DISMISS_THRESHOLD,
    onDismiss: handleClose,
  });

  if (isDismissed) return null;

  return (
    <div
      className={joinClasses(
        isClosing
          ? PREDICTION_CARD_CLASSNAMES.exitAnimation
          : PREDICTION_CARD_CLASSNAMES.enterAnimation,
      )}
    >
      <div
        {...bind()}
        style={dragStyle}
        className={joinClasses(
          PREDICTION_CARD_CLASSNAMES.root,
          PREDICTION_CARD_VARIANT_CLASSNAMES[variant],
          className,
        )}
      >
        <IconButton
          type="button"
          icon={faXmark}
          variant="text"
          className={joinClasses(
            PREDICTION_CARD_CLASSNAMES.closeButton,
            PREDICTION_CARD_CLOSE_BUTTON_VARIANT_CLASSNAMES[variant],
          )}
          name={closeAriaLabel}
          aria-label={closeAriaLabel}
          onClick={handleClose}
        />
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
    </div>
  );
}
