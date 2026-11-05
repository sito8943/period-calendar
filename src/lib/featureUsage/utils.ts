import { matchPath } from "react-router-dom";

import { AppRoutes } from "../routes";
import { NON_FEATURE_ROUTE_KEYS, PERIOD_CALENDAR_FEATURES } from "./constants";
import type { PeriodCalendarFeature } from "./types";

const catalogue: ReadonlySet<string> = new Set(PERIOD_CALENDAR_FEATURES);

/** `DailyLogByDate` → `page.daily_log_by_date`. */
export const toPageFeature = (routeKey: string): string =>
  `page.${routeKey.replace(/[A-Z]/g, (char, index: number) =>
    index === 0 ? char.toLowerCase() : `_${char.toLowerCase()}`,
  )}`;

export const isPeriodCalendarFeature = (
  feature: string,
): feature is PeriodCalendarFeature => catalogue.has(feature);

/** The page feature of a pathname, or null when it is not a known screen. */
export const pageFeatureOf = (
  pathname: string,
): PeriodCalendarFeature | null => {
  for (const [key, path] of Object.entries(AppRoutes)) {
    if (NON_FEATURE_ROUTE_KEYS.includes(key)) continue;
    if (!matchPath({ path, end: true }, pathname)) continue;
    const feature = toPageFeature(key);
    return isPeriodCalendarFeature(feature) ? feature : null;
  }
  return null;
};
