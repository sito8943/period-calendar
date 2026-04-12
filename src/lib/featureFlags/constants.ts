import type { AppFeatures } from "./types";

export const APP_FEATURE_KEYS: Array<keyof AppFeatures> = [
  "historyEnabled",
  "periodLogEnabled",
  "dailyLogEnabled",
  "profileEnabled",
  "aboutEnabled",
  "termsAndConditionsEnabled",
  "cookiesPolicyEnabled",
  "privacyPolicyEnabled",
];
