import { useCallback, useEffect, useRef, useState } from "react";

// @sito/dashboard-app
import { Dropdown } from "@sito/dashboard-app";

// constants
import { ANIMATED_DROPDOWN_CLASSNAMES } from "./constants";

// types
import type { AnimatedDropdownProps } from "./types";

// utils
import { getAnimatedDropdownCloseDelayMs } from "./utils";

export function AnimatedDropdown({
  children,
  open,
  onClose,
  anchorEl,
  className,
}: AnimatedDropdownProps) {
  const [isVisible, setIsVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const [persistedAnchorEl, setPersistedAnchorEl] =
    useState<HTMLElement | null>(anchorEl ?? null);

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeAnimationFrameRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current === null) return;
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }, []);

  const clearCloseAnimationFrame = useCallback(() => {
    if (closeAnimationFrameRef.current === null) return;
    cancelAnimationFrame(closeAnimationFrameRef.current);
    closeAnimationFrameRef.current = null;
  }, []);

  useEffect(() => {
    if (!anchorEl) return;
    setPersistedAnchorEl(anchorEl);
  }, [anchorEl]);

  useEffect(() => {
    if (open) {
      clearCloseAnimationFrame();
      clearCloseTimeout();
      setIsVisible(true);
      setIsClosing(false);
      return;
    }

    if (!isVisible) return;

    const closeDelayMs = getAnimatedDropdownCloseDelayMs();

    if (closeDelayMs === 0) {
      setIsVisible(false);
      setIsClosing(false);
      return;
    }

    clearCloseAnimationFrame();
    closeAnimationFrameRef.current = requestAnimationFrame(() => {
      setIsClosing(true);
      closeTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        closeTimeoutRef.current = null;
      }, closeDelayMs);
      closeAnimationFrameRef.current = null;
    });
  }, [clearCloseAnimationFrame, clearCloseTimeout, isVisible, open]);

  useEffect(
    () => () => {
      clearCloseAnimationFrame();
      clearCloseTimeout();
    },
    [clearCloseAnimationFrame, clearCloseTimeout],
  );

  useEffect(() => {
    const container = contentRef.current?.parentElement;
    if (!container) return;

    container.classList.add(ANIMATED_DROPDOWN_CLASSNAMES.container);
    container.classList.remove(
      ANIMATED_DROPDOWN_CLASSNAMES.enter,
      ANIMATED_DROPDOWN_CLASSNAMES.exit,
    );
    container.classList.add(
      isClosing
        ? ANIMATED_DROPDOWN_CLASSNAMES.exit
        : ANIMATED_DROPDOWN_CLASSNAMES.enter,
    );

    return () => {
      container.classList.remove(
        ANIMATED_DROPDOWN_CLASSNAMES.container,
        ANIMATED_DROPDOWN_CLASSNAMES.enter,
        ANIMATED_DROPDOWN_CLASSNAMES.exit,
      );
    };
  }, [isClosing, isVisible]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    onClose();
  }, [isClosing, onClose]);

  const resolvedAnchorEl = open
    ? (anchorEl ?? persistedAnchorEl)
    : persistedAnchorEl;

  if (!isVisible || !resolvedAnchorEl) return null;

  return (
    <Dropdown
      open
      onClose={handleClose}
      anchorEl={resolvedAnchorEl}
      className={className}
    >
      <div ref={contentRef} className={ANIMATED_DROPDOWN_CLASSNAMES.content}>
        {children}
      </div>
    </Dropdown>
  );
}
