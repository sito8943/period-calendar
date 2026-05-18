import type { HttpError } from "@sito/dashboard-app";

export type PeriodCalendarAuthErrorCode = "not_configured";

export type PeriodCalendarAuthError = HttpError & {
  code: PeriodCalendarAuthErrorCode;
};
