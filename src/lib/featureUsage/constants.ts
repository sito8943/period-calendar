/**
 * Catalogue sent to sito-feature-usage: every screen of Period Calendar, so
 * the ones nobody uses show up. Dotted slugs; only these names are ever sent,
 * never dates, ids or anything the user logs.
 * Pages are `page.<AppRoutes key in snake_case>` (see `toPageFeature`).
 */
export const PERIOD_CALENDAR_FEATURES = [
  "page.sign_in",
  "page.sign_up",
  "page.sign_up_confirmation",
  "page.forgot_password",
  "page.update_password",
  "page.confirm_email_success",
  "page.confirm_email_error",
  "page.sign_out",
  "page.home",
  "page.period_log",
  "page.period_log_by_id",
  "page.daily_log_by_date",
  "page.history",
  "page.profile",
  "page.about",
  "page.cookies_policy",
  "page.terms_and_conditions",
  "page.privacy_policy",
] as const;

/** `AppRoutes` keys that are not screens: layout roots and catch-alls. */
export const NON_FEATURE_ROUTE_KEYS: readonly string[] = [
  "AuthRoot",
  "AuthNotFound",
  "NotFound",
];
