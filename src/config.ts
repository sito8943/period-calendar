import type { AppFeatures } from "./lib/featureFlags/types";

const {
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
  VITE_FEATURE_FLAGS_STORAGE_KEY,
  VITE_FEATURE_HISTORY_ENABLED_DEFAULT,
  VITE_FEATURE_PERIOD_LOG_ENABLED_DEFAULT,
  VITE_FEATURE_DAILY_LOG_ENABLED_DEFAULT,
  VITE_FEATURE_PROFILE_ENABLED_DEFAULT,
  VITE_FEATURE_ABOUT_ENABLED_DEFAULT,
  VITE_FEATURE_TERMS_AND_CONDITIONS_ENABLED_DEFAULT,
  VITE_FEATURE_COOKIES_POLICY_ENABLED_DEFAULT,
  VITE_FEATURE_PRIVACY_POLICY_ENABLED_DEFAULT,
} = import.meta.env;

const supabaseUrl = VITE_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = VITE_SUPABASE_ANON_KEY?.trim() ?? "";
const isSupabaseEnabled = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

const parseBooleanWithDefault = (
  value: string | undefined,
  defaultValue = true,
): boolean => {
  if (value === "true") return true;
  if (value === "false") return false;
  return defaultValue;
};

const featureFlagsDefaults: AppFeatures = {
  historyEnabled: parseBooleanWithDefault(VITE_FEATURE_HISTORY_ENABLED_DEFAULT),
  periodLogEnabled: parseBooleanWithDefault(
    VITE_FEATURE_PERIOD_LOG_ENABLED_DEFAULT,
  ),
  dailyLogEnabled: parseBooleanWithDefault(
    VITE_FEATURE_DAILY_LOG_ENABLED_DEFAULT,
  ),
  profileEnabled: parseBooleanWithDefault(VITE_FEATURE_PROFILE_ENABLED_DEFAULT),
  aboutEnabled: parseBooleanWithDefault(VITE_FEATURE_ABOUT_ENABLED_DEFAULT),
  termsAndConditionsEnabled: parseBooleanWithDefault(
    VITE_FEATURE_TERMS_AND_CONDITIONS_ENABLED_DEFAULT,
  ),
  cookiesPolicyEnabled: parseBooleanWithDefault(
    VITE_FEATURE_COOKIES_POLICY_ENABLED_DEFAULT,
  ),
  privacyPolicyEnabled: parseBooleanWithDefault(
    VITE_FEATURE_PRIVACY_POLICY_ENABLED_DEFAULT,
  ),
};

export const config = {
  appName: "Period Calendar",
  defaultLanguage: "es",
  storage: {
    periods: "period-calendar:periods",
    settings: "period-calendar:settings",
    onboarding: "period-calendar:onboarding",
    theme: "period-calendar:theme",
  },
  featureFlags: {
    storageKey:
      VITE_FEATURE_FLAGS_STORAGE_KEY?.trim() ??
      "period-calendar:feature-flags",
    defaults: featureFlagsDefaults,
  },
  supabase: {
    enabled: isSupabaseEnabled,
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  },
};
