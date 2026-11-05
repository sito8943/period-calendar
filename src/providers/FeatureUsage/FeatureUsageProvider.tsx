import { useEffect, useMemo, useRef } from "react";

// @sito/feature-usage
import { createTracker, noopTracker } from "@sito/feature-usage";
import type { Tracker } from "@sito/feature-usage";
import { FeatureUsageProvider as BaseFeatureUsageProvider } from "@sito/feature-usage/react";

// lib
import { PERIOD_CALENDAR_FEATURES } from "lib";
import type { PeriodCalendarFeature } from "lib";

// providers
import { useConsent } from "../Consent";

// types
import type { BasicProviderPropTypes } from "../types";

// components
import { PageUsageTracker } from "./PageUsageTracker";

// config
import { config } from "../../config";

/**
 * Anonymous feature usage (sito-feature-usage): counts which screens and
 * features are used, never who uses them. Off without VITE_USAGE_URL, and
 * until the user accepts it in the privacy notice.
 */
export const FeatureUsageProvider = ({ children }: BasicProviderPropTypes) => {
  const { analytics } = useConsent();
  const allowed = analytics === true;

  const tracker = useMemo<Tracker<PeriodCalendarFeature>>(
    () =>
      allowed
        ? createTracker({
            app: config.featureUsage.app,
            key: config.featureUsage.key,
            endpoint: config.featureUsage.url,
            features: PERIOD_CALENDAR_FEATURES,
          })
        : noopTracker<PeriodCalendarFeature>(),
    [allowed],
  );

  // Stop the tracker it replaces; on withdrawal, also forget what it kept.
  // Not done in an effect cleanup: StrictMode's extra run would stop the
  // live tracker.
  const previous = useRef<Tracker<PeriodCalendarFeature> | null>(null);
  useEffect(() => {
    const replaced = previous.current;
    previous.current = tracker;
    if (!replaced || replaced === tracker) return;
    replaced.stop();
    if (!allowed) replaced.clear();
  }, [tracker, allowed]);

  return (
    <BaseFeatureUsageProvider tracker={tracker}>
      <PageUsageTracker />
      {children}
    </BaseFeatureUsageProvider>
  );
};
