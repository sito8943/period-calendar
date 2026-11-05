import { describe, expect, it } from "vitest";
import { isValidFeature } from "@sito/feature-usage";

import { AppRoutes } from "../../routes";
import {
  NON_FEATURE_ROUTE_KEYS,
  PERIOD_CALENDAR_FEATURES,
  pageFeatureOf,
  toPageFeature,
} from "..";

describe("period calendar feature usage catalogue", () => {
  it("lists only valid, unique names the service accepts", () => {
    expect(PERIOD_CALENDAR_FEATURES.every((f) => isValidFeature(f))).toBe(true);
    expect(new Set(PERIOD_CALENDAR_FEATURES).size).toBe(
      PERIOD_CALENDAR_FEATURES.length,
    );
  });

  it("has a page feature for every screen route", () => {
    const pages = Object.keys(AppRoutes)
      .filter((key) => !NON_FEATURE_ROUTE_KEYS.includes(key))
      .map(toPageFeature);
    expect([...pages].sort()).toEqual(
      PERIOD_CALENDAR_FEATURES.filter((f) => f.startsWith("page.")).sort(),
    );
  });
});

describe("pageFeatureOf", () => {
  it.each([
    ["/", "page.home"],
    ["/log", "page.period_log"],
    ["/log/42", "page.period_log_by_id"],
    ["/daily-log/2026-11-05", "page.daily_log_by_date"],
    ["/history", "page.history"],
    ["/auth/sign-in", "page.sign_in"],
    ["/auth/forgot-password", "page.forgot_password"],
    ["/about-us", "page.about"],
  ])("%s → %s", (pathname, feature) => {
    expect(pageFeatureOf(pathname)).toBe(feature);
  });

  it("ignores unknown paths and catch-alls", () => {
    expect(pageFeatureOf("/nope")).toBeNull();
    expect(pageFeatureOf("/auth")).toBeNull();
    expect(pageFeatureOf("/auth/whatever")).toBeNull();
  });
});
