import { beforeEach, describe, expect, it, vi } from "vitest";

const storage = new Map<string, unknown>();

vi.mock("@sito/dashboard-app", () => ({
  fromLocal: (key: string) => storage.get(key) ?? null,
  toLocal: (key: string, value: unknown) => {
    storage.set(key, value);
  },
  removeFromLocal: (key: string) => {
    storage.delete(key);
  },
}));

import {
  CONSENT_VERSION,
  clearStoredConsent,
  persistConsent,
  readStoredConsent,
} from "..";

const KEY = "consent_test";

describe("consent storage", () => {
  beforeEach(() => storage.clear());

  it("has no choice until the user makes one", () => {
    expect(readStoredConsent(KEY)).toBeNull();
  });

  it("stores the choice with its version and date", () => {
    const now = new Date("2026-11-05T10:00:00Z");
    expect(persistConsent(KEY, true, now)).toEqual({
      analytics: true,
      version: CONSENT_VERSION,
      decidedAt: "2026-11-05T10:00:00.000Z",
    });
    expect(readStoredConsent(KEY)?.analytics).toBe(true);
    persistConsent(KEY, false, now);
    expect(readStoredConsent(KEY)?.analytics).toBe(false);
  });

  it("asks again for an older version or a malformed value", () => {
    storage.set(KEY, {
      analytics: true,
      version: CONSENT_VERSION - 1,
      decidedAt: "x",
    });
    expect(readStoredConsent(KEY)).toBeNull();
    storage.set(KEY, {
      analytics: "yes",
      version: CONSENT_VERSION,
      decidedAt: "x",
    });
    expect(readStoredConsent(KEY)).toBeNull();
    storage.set(KEY, "true");
    expect(readStoredConsent(KEY)).toBeNull();
  });

  it("clears the choice", () => {
    persistConsent(KEY, true);
    clearStoredConsent(KEY);
    expect(readStoredConsent(KEY)).toBeNull();
  });
});
