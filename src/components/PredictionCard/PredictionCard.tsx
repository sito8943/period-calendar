import { useCallback, useEffect, useRef, useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@sito/dashboard-app";
import {
  PREDICTION_CARD_CLASSNAMES,
  PREDICTION_CARD_CLOSE_BUTTON_VARIANT_CLASSNAMES,
  PREDICTION_CARD_DISMISS_ANIMATION_DURATION_MS,
  PREDICTION_CARD_SWIPE_DISMISS_THRESHOLD,
  PREDICTION_CARD_SWIPE_LOCK_AXIS_THRESHOLD,
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
  const cardRef = useRef<HTMLDivElement>(null);
  const swipeStartXRef = useRef(0);
  const swipeStartYRef = useRef(0);
  const swipeDeltaXRef = useRef(0);
  const isTouchTrackingRef = useRef(false);
  const isHorizontalSwipeRef = useRef(false);
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

  const clearSwipeStyles = useCallback(() => {
    const element = cardRef.current;
    if (!element) return;

    element.style.transition = "";
    element.style.transform = "";
    swipeDeltaXRef.current = 0;
  }, []);

  const handleClose = useCallback(() => {
    if (isClosing) return;

    clearSwipeStyles();
    setIsClosing(true);
    persistPredictionCardDismissed(dismissStorageKey);
    onClose?.();
  }, [clearSwipeStyles, dismissStorageKey, isClosing, onClose]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || isClosing) return;

    const resetPosition = (withTransition: boolean) => {
      if (withTransition) {
        element.style.transition = "transform 180ms ease";
      }
      element.style.transform = "";
      swipeDeltaXRef.current = 0;
      if (!withTransition) return;

      window.setTimeout(() => {
        if (cardRef.current === element) {
          element.style.transition = "";
        }
      }, 200);
    };

    const applyDragStyles = (deltaX: number) => {
      element.style.transition = "none";
      element.style.transform = `translate3d(${deltaX}px, 0, 0)`;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;

      const touchPoint = event.touches[0];
      swipeStartXRef.current = touchPoint.clientX;
      swipeStartYRef.current = touchPoint.clientY;
      swipeDeltaXRef.current = 0;
      isTouchTrackingRef.current = true;
      isHorizontalSwipeRef.current = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isTouchTrackingRef.current || event.touches.length !== 1) return;

      const touchPoint = event.touches[0];
      const deltaX = touchPoint.clientX - swipeStartXRef.current;
      const deltaY = touchPoint.clientY - swipeStartYRef.current;
      const dragX = Math.max(deltaX, 0);

      if (!isHorizontalSwipeRef.current) {
        if (Math.abs(deltaX) < PREDICTION_CARD_SWIPE_LOCK_AXIS_THRESHOLD) {
          swipeDeltaXRef.current = dragX;
          applyDragStyles(dragX);
          return;
        }

        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
          isTouchTrackingRef.current = false;
          resetPosition(false);
          return;
        }

        isHorizontalSwipeRef.current = true;
      }

      event.preventDefault();
      swipeDeltaXRef.current = dragX;
      applyDragStyles(dragX);
    };

    const handleTouchEnd = () => {
      if (!isTouchTrackingRef.current) return;

      isTouchTrackingRef.current = false;

      if (!isHorizontalSwipeRef.current) {
        resetPosition(false);
        return;
      }

      isHorizontalSwipeRef.current = false;
      if (swipeDeltaXRef.current >= PREDICTION_CARD_SWIPE_DISMISS_THRESHOLD) {
        handleClose();
        return;
      }

      resetPosition(true);
    };

    const handleTouchCancel = () => {
      isTouchTrackingRef.current = false;
      isHorizontalSwipeRef.current = false;
      resetPosition(true);
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    element.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchCancel);
      clearSwipeStyles();
    };
  }, [clearSwipeStyles, handleClose, isClosing]);

  if (isDismissed) return null;

  return (
    <div
      ref={cardRef}
      className={joinClasses(
        PREDICTION_CARD_CLASSNAMES.root,
        isClosing
          ? PREDICTION_CARD_CLASSNAMES.exitAnimation
          : PREDICTION_CARD_CLASSNAMES.enterAnimation,
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
  );
}
