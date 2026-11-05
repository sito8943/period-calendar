import { useCallback, useMemo, useState } from "react";

// lib
import { persistConsent, readStoredConsent } from "lib";

// types
import type { ConsentContextType } from "./types";
import type { BasicProviderPropTypes } from "../types";

import { ConsentContext } from "./ConsentContext";

// config
import { config } from "../../config";

/**
 * Consent for optional technologies (today: anonymous feature usage).
 * Essential storage (session, preferences, offline data) does not depend on it.
 */
export const ConsentProvider = ({ children }: BasicProviderPropTypes) => {
  const storageKey = config.consent.storageKey;
  const [analytics, setAnalyticsState] = useState<boolean | null>(
    () => readStoredConsent(storageKey)?.analytics ?? null,
  );
  const [reopened, setReopened] = useState(false);

  const setAnalytics = useCallback(
    (allowed: boolean) => {
      persistConsent(storageKey, allowed);
      setAnalyticsState(allowed);
      setReopened(false);
    },
    [storageKey],
  );

  const openBanner = useCallback(() => setReopened(true), []);

  const value = useMemo<ConsentContextType>(
    () => ({
      analytics,
      isBannerOpen: analytics === null || reopened,
      setAnalytics,
      openBanner,
    }),
    [analytics, reopened, setAnalytics, openBanner],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
};
