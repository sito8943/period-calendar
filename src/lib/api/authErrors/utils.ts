import { AUTH_PROVIDER_NOT_CONFIGURED_MESSAGE } from "./constants";
import type {
  PeriodCalendarAuthError,
  PeriodCalendarAuthErrorCode,
} from "./types";

export const createAuthProviderNotConfiguredError =
  (): PeriodCalendarAuthError =>
    Object.assign(new Error(AUTH_PROVIDER_NOT_CONFIGURED_MESSAGE), {
      name: "PeriodCalendarAuthError",
      code: "not_configured" as const,
      status: 503,
      message: AUTH_PROVIDER_NOT_CONFIGURED_MESSAGE,
    });

export const isPeriodCalendarAuthError = (
  error: unknown,
  code?: PeriodCalendarAuthErrorCode,
): error is PeriodCalendarAuthError => {
  if (typeof error !== "object" || error === null) return false;
  if (!("code" in error)) return false;

  if (code) {
    return error.code === code;
  }

  return true;
};
